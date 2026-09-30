import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import type { TestContext } from 'node:test'
import { createServer as createViteServer, isFileServingAllowed } from 'vite'
import { createWaitlistMiddleware, createWaitlistStore, localWaitlistPlugin } from './waitlist.ts'

async function setup(t: TestContext) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'openswarm-waitlist-'))
  const file = path.join(directory, 'waitlist.json')
  const middleware = createWaitlistMiddleware(file)
  const server = createServer((request, response) => {
    middleware(request, response, () => {
      response.writeHead(404)
      response.end()
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
      server.closeAllConnections()
    })
    await rm(directory, { recursive: true, force: true })
  })
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/waitlist`
  return {
    file,
    url,
    post: (body: unknown) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  }
}

test('saves normalized numbers durably and deduplicates repeated submissions', async (t) => {
  const { post, file } = await setup(t)
  const response = await post({ phone: '+1 (202) 555-0123', source: 'hero' })
  assert.equal(response.status, 201)
  const result = await response.json()
  assert.equal(result.ok, true)
  assert.match(result.referral.code, /^[A-Za-z0-9_-]{32}$/)
  assert.deepEqual(result.referral, { code: result.referral.code, count: 0, goal: 3, priorityAccess: false })
  assert.ok(!JSON.stringify(result).includes('2025550123'))
  assert.equal(response.headers.get('cache-control'), 'no-store')

  const entries = JSON.parse(await readFile(file, 'utf8'))
  assert.equal(entries.length, 1)
  assert.equal(entries[0].phone, '+12025550123')
  assert.equal(entries[0].source, 'hero')
  assert.equal(entries[0].referralCode, result.referral.code)
  assert.ok(Number.isFinite(Date.parse(entries[0].createdAt)))
  assert.equal((await stat(file)).mode & 0o777, 0o600)

  const duplicate = await post({ phone: '+12025550123', source: 'closing' })
  assert.equal(duplicate.status, 200)
  assert.deepEqual(await duplicate.json(), result)
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), entries)

  // A new store reads the durable file instead of depending on process memory.
  assert.deepEqual(await createWaitlistStore(file).add('+12025550123', 'nav'), { added: false, referral: result.referral })
})

test('concurrent new and duplicate submissions do not lose entries', async (t) => {
  const { post, file } = await setup(t)
  const phones = Array.from({ length: 12 }, (_, index) => `+120255501${String(index).padStart(2, '0')}`)
  const responses = await Promise.all(
    [...phones, ...phones].map((phone) => post({ phone, source: 'hero' })),
  )
  assert.equal(responses.filter((response) => response.status === 201).length, phones.length)
  assert.equal(responses.filter((response) => response.status === 200).length, phones.length)
  for (const response of responses) assert.equal((await response.json()).ok, true)
  const entries = JSON.parse(await readFile(file, 'utf8')) as { phone: string }[]
  assert.equal(entries.length, phones.length)
  assert.deepEqual(entries.map((entry) => entry.phone).sort(), phones.sort())
})

test('rejects invalid input without creating a signup file', async (t) => {
  const { post, file, url } = await setup(t)
  for (const body of [
    null,
    [],
    {},
    { phone: '202555012' },
    { phone: '+12' },
    { phone: 12025550123 },
    { phone: '+12025550123', source: {} },
    { phone: '+12025550123', source: ' ' },
    { phone: '+12025550123', source: 'x'.repeat(65) },
    { phone: '+12025550123', referralCode: '' },
    { phone: '+12025550123', referralCode: '../waitlist.json' },
    { phone: '+12025550123', referralCode: 42 },
  ]) {
    const response = await post(body)
    assert.equal(response.status, 400)
    assert.equal((await response.json()).ok, false)
  }
  const malformed = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  })
  assert.equal(malformed.status, 400)
  const unsupported = await fetch(url, { method: 'POST', body: '{}' })
  assert.equal(unsupported.status, 415)
  const oversized = await post({ phone: '+12025550123', extra: 'x'.repeat(4_096) })
  assert.equal(oversized.status, 413)
  const unsupportedMethod = await fetch(url)
  assert.equal(unsupportedMethod.status, 405)
  assert.equal(unsupportedMethod.headers.get('allow'), 'POST')
  assert.equal((await fetch(`${url}/unrelated`)).status, 404)
  await assert.rejects(readFile(file), { code: 'ENOENT' })
})

test('migrates only the returning legacy signup without dropping its metadata or crediting a new referral', async (t) => {
  const { post, file } = await setup(t)
  const legacy = [
    { phone: '+12025550123', source: 'hero', createdAt: '2026-09-20T12:00:00.000Z', note: 'preserve metadata' },
    { phone: '+12025550124', source: 'nav', createdAt: '2026-09-21T12:00:00.000Z' },
  ]
  await writeFile(file, JSON.stringify(legacy))
  const inviter = await (await post({ phone: '+12025550125' })).json()
  const migrated = await post({ phone: legacy[0].phone, source: 'different', referralCode: inviter.referral.code })
  assert.equal(migrated.status, 200)
  const result = await migrated.json()
  assert.match(result.referral.code, /^[A-Za-z0-9_-]{32}$/)
  const entries = JSON.parse(await readFile(file, 'utf8'))
  assert.deepEqual(entries[0], { ...legacy[0], referralCode: result.referral.code })
  assert.deepEqual(entries[1], legacy[1])
  assert.equal((await createWaitlistStore(file).referral(inviter.referral.code))?.count, 0)
})

test('three unique referred signups unlock priority and survive reload; repeats and self-referrals never count', async (t) => {
  const { post, file, url } = await setup(t)
  const inviter = (await (await post({ phone: '+12025550123' })).json()).referral
  const other = (await (await post({ phone: '+12025550124' })).json()).referral
  const getStatus = async (code: string) => {
    const response = await fetch(`${url}/referral?code=${code}`)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    const body = await response.json()
    assert.deepEqual(Object.keys(body).sort(), ['ok', 'referral'])
    assert.deepEqual(Object.keys(body.referral).sort(), ['code', 'count', 'goal', 'priorityAccess'])
    return body.referral
  }
  assert.deepEqual(await getStatus(inviter.code), inviter)

  // Knowing one's own public share code cannot turn a repeated signup into a referral.
  await post({ phone: '+12025550123', referralCode: inviter.code })
  await post({ phone: '+12025550124', referralCode: inviter.code })
  assert.equal((await getStatus(inviter.code)).count, 0)

  for (const [index, phone] of ['+12025550125', '+12025550126', '+12025550127'].entries()) {
    const response = await post({ phone, referralCode: inviter.code })
    assert.equal(response.status, 201)
    const signup = await response.json()
    assert.notEqual(signup.referral.code, inviter.code)
    await post({ phone, referralCode: inviter.code })
    await post({ phone, referralCode: other.code })
    assert.deepEqual(await getStatus(inviter.code), {
      code: inviter.code, count: index + 1, goal: 3, priorityAccess: index === 2,
    })
    assert.equal((await getStatus(other.code)).count, 0)
  }
  const reloadedStore = createWaitlistStore(file)
  assert.deepEqual(await reloadedStore.referral(inviter.code), {
    code: inviter.code, count: 3, goal: 3, priorityAccess: true,
  })
  const entries = JSON.parse(await readFile(file, 'utf8')) as { referralCode: string, referredBy?: string }[]
  assert.equal(entries.filter((entry) => entry.referredBy === inviter.code).length, 3)
  assert.equal(new Set(entries.map((entry) => entry.referralCode)).size, entries.length)
})

test('concurrent referrals count each unique phone once and preserve the first attribution', async (t) => {
  const { post, file } = await setup(t)
  const inviter = (await (await post({ phone: '+12025550123' })).json()).referral
  const phones = Array.from({ length: 10 }, (_, index) => `+120255502${String(index).padStart(2, '0')}`)
  const responses = await Promise.all([...phones, ...phones, ...phones].map((phone) => post({ phone, referralCode: inviter.code })))
  assert.equal(responses.filter((response) => response.status === 201).length, phones.length)
  assert.equal(responses.filter((response) => response.status === 200).length, phones.length * 2)
  assert.deepEqual(await createWaitlistStore(file).referral(inviter.code), {
    code: inviter.code, count: phones.length, goal: 3, priorityAccess: true,
  })
})

test('unknown invites do not block signup; public status rejects unknown codes and never exposes the store', async (t) => {
  const { post, url, file } = await setup(t)
  const unknown = 'x'.repeat(32)
  const response = await post({ phone: '+12025550123', referralCode: unknown })
  assert.equal(response.status, 201)
  const entries = JSON.parse(await readFile(file, 'utf8'))
  assert.equal(entries[0].referredBy, undefined)
  for (const suffix of ['', '?code=bad', `?code=${unknown}`, '?code=..%2Fwaitlist.json']) {
    const missing = await fetch(`${url}/referral${suffix}`)
    assert.equal(missing.status, 404)
    assert.deepEqual(await missing.json(), { ok: false, error: 'This invite link was not found.' })
  }
  const wrongMethod = await fetch(`${url}/referral`, { method: 'POST' })
  assert.equal(wrongMethod.status, 405)
  assert.equal(wrongMethod.headers.get('allow'), 'GET')
})

test('rejects duplicate stored identities or codes without rewriting the file', async (t) => {
  const { post, file } = await setup(t)
  const original = { phone: '+12025550123', source: 'hero', createdAt: new Date().toISOString(), referralCode: 'a'.repeat(32) }
  for (const invalid of [
    [original, original],
    [original, { ...original, phone: '+12025550124' }],
    [{ ...original, referralCode: 'invalid' }],
  ]) {
    const contents = JSON.stringify(invalid)
    await writeFile(file, contents)
    const response = await post({ phone: '+12025550125' })
    assert.equal(response.status, 503)
    assert.equal(await readFile(file, 'utf8'), contents)
  }
})

test('protects malformed existing data and recovers after it is repaired', async (t) => {
  const { post, file } = await setup(t)
  for (const invalid of ['not json', '', '{}', '[{"phone":"invalid"}]']) {
    await writeFile(file, invalid)
    const response = await post({ phone: '+442079460018', source: 'nav' })
    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), {
      ok: false,
      error: 'The waitlist could not be saved. Please try again.',
    })
    assert.equal(await readFile(file, 'utf8'), invalid)
  }
  await writeFile(file, '[]')
  const response = await post({ phone: '+442079460018', source: 'nav' })
  assert.equal(response.status, 201)
  assert.equal(JSON.parse(await readFile(file, 'utf8')).length, 1)
})

test('returns a save error when the storage location is unavailable', async (t) => {
  const { post, file } = await setup(t)
  await writeFile(file, '[]')
  // Replacing the parent directory with a file makes subsequent reads/writes fail.
  await rm(path.dirname(file), { recursive: true, force: true })
  await writeFile(path.dirname(file), 'unavailable')
  const response = await post({ phone: '+12025550123', source: 'hero' })
  assert.equal(response.status, 503)
  assert.equal((await response.json()).ok, false)
})

test('Vite denies direct, encoded, transformed and absolute requests for local signup data', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'openswarm-vite-waitlist-'))
  await mkdir(path.join(directory, '.data'))
  const file = path.join(directory, '.data', 'waitlist.json')
  const privateFixture = JSON.stringify([{ phone: '+12025550123', source: 'test', createdAt: new Date().toISOString() }])
  await writeFile(file, privateFixture)
  await writeFile(path.join(directory, 'index.html'), '<!doctype html><title>Waitlist test</title>')
  const server = await createViteServer({
    configFile: false,
    root: directory,
    logLevel: 'silent',
    plugins: [localWaitlistPlugin()],
    server: { host: '127.0.0.1', port: 0, fs: { deny: ['**/custom-private/**'] } },
    optimizeDeps: { noDiscovery: true, include: [] },
  })
  t.after(async () => {
    await server.close()
    await rm(directory, { recursive: true, force: true })
  })
  await server.listen()
  const address = server.httpServer!.address() as AddressInfo
  const base = `http://127.0.0.1:${address.port}`
  for (const requestPath of [
    '/.data',
    '/.data/',
    '/.data/waitlist.json',
    '/.DATA/waitlist.json',
    '/.data/waitlist.json?raw',
    '/.data/waitlist.json?import',
    '/%2edata/waitlist.json',
    '/.data%2fwaitlist.json',
    `/@fs${file}`,
    `/@fs${file}?raw`,
    `/@fs${file}?import`,
  ]) {
    const response = await fetch(`${base}${requestPath}`)
    assert.ok([403, 404].includes(response.status), `Expected denied status for ${requestPath}`)
    assert.ok(!(await response.text()).includes(privateFixture), 'Private fixture must never be served')
  }
  assert.ok(server.config.server.fs.deny.includes('.env'))
  assert.ok(server.config.server.fs.deny.includes('**/.git/**'))
  assert.ok(server.config.server.fs.deny.includes('**/custom-private/**'))
  assert.ok(server.config.server.fs.deny.includes('**/.data/**'))
  assert.equal(isFileServingAllowed(server.config, file), false)
  assert.equal((await fetch(base)).status, 200)
})
