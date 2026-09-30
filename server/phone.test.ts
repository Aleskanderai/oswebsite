import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { normalizePhone, type CountryCode } from '../src/lib/phone.ts'
import { createWaitlistMiddleware } from './waitlist.ts'

test('US national, country-prefixed and familiar formatted numbers normalize to the same E.164 value', () => {
  for (const input of [
    '4155551234',
    '14155551234',
    '1 415 555 1234',
    '(415) 555-1234',
    '415.555.1234',
    '  415 555 1234  ',
    '(415) 555\u20111234',
    '1\u00a0(415)\u00a0555-1234',
    '+14155551234',
    '+1 (415) 555-1234',
  ]) {
    assert.equal(normalizePhone(input), '+14155551234', input)
  }
})

test('explicit international country codes are preserved rather than defaulting to US', () => {
  const cases = [
    ['+44 20 7946 0018', '+442079460018'],
    ['+33 1 42 68 53 00', '+33142685300'],
    ['+61 2 9374 4000', '+61293744000'],
    ['+81 3 1234 5678', '+81312345678'],
  ]
  for (const [input, expected] of cases) assert.equal(normalizePhone(input), expected)
})

test('country selection parses national numbers and removes the appropriate trunk prefix', () => {
  const cases: [CountryCode, string, string][] = [
    ['GB', '02079460958', '+442079460958'],
    ['GB', '(020) 7946 0958', '+442079460958'],
    ['FR', '0612345678', '+33612345678'],
    ['FR', '06 12 34 56 78', '+33612345678'],
    ['DE', '030901820', '+4930901820'],
    ['DE', '(030) 9018-20', '+4930901820'],
    ['AU', '02 9374 4000', '+61293744000'],
  ]
  for (const [country, input, expected] of cases) {
    assert.equal(normalizePhone(input, country), expected, `${country}: ${input}`)
    assert.equal(normalizePhone(expected, country), expected, 'Canonical forms stay idempotent')
  }
  // A selected country changes the interpretation; the implicit US default does not guess it.
  assert.equal(normalizePhone('02079460958'), null)
  assert.equal(normalizePhone('0612345678'), null)
})

test('an explicit international prefix overrides every selected country', () => {
  for (const country of ['US', 'GB', 'FR', 'DE'] as const) {
    assert.equal(normalizePhone('+1 (415) 555-1234', country), '+14155551234')
    assert.equal(normalizePhone('+44 20 7946 0958', country), '+442079460958')
    assert.equal(normalizePhone('+33 6 12 34 56 78', country), '+33612345678')
  }
})

test('selected-country parsing still rejects incomplete and non-phone content', () => {
  for (const country of ['GB', 'FR', 'DE'] as const) {
    for (const input of ['012', '00000000000', 'Call 02079460958', '0612345678 ext 2', '++33612345678', '06/12/34/56/78']) {
      assert.equal(normalizePhone(input, country), null, `${country}: ${input}`)
    }
  }
})

test('rejects incomplete, invalid, ambiguous international and non-phone input', () => {
  for (const input of [
    '', ' ', '+', '+12', '5551234', '415555123', '41555512345',
    '0000000000', '1234567890', '1111111111',
    '442079460018', '02079460018', '011442079460018',
    '+999123456789', '++14155551234', '415+5551234',
    'Call 4155551234', '4155551234 ext 12', '+1 (415) 555-1234#12',
    '415/555/1234', '+1' + '2'.repeat(39),
  ]) assert.equal(normalizePhone(input), null, input)
})

test('API accepts US input and keeps canonical deduplication and referral attribution across formats', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'openswarm-phone-input-'))
  const file = path.join(directory, 'waitlist.json')
  const middleware = createWaitlistMiddleware(file)
  const server = createServer((request, response) => middleware(request, response, () => {
    response.writeHead(404)
    response.end()
  }))
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve())
      server.closeAllConnections()
    })
    await rm(directory, { recursive: true, force: true })
  })
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/waitlist`
  const post = (phone: string, referralCode?: string) => fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, source: 'phone-test', referralCode }),
  })
  const inviterResponse = await post('2025550123')
  assert.equal(inviterResponse.status, 201)
  const inviter = (await inviterResponse.json()).referral
  const first = await post('(202) 555-0124', inviter.code)
  assert.equal(first.status, 201)
  const invitee = (await first.json()).referral
  for (const equivalent of ['2025550124', '12025550124', '1 202 555 0124', '+12025550124']) {
    const repeated = await post(equivalent, inviter.code)
    assert.equal(repeated.status, 200)
    assert.deepEqual((await repeated.json()).referral, invitee)
  }
  // A returning inviter cannot credit itself by changing the formatting.
  assert.equal((await post('+1 (202) 555-0123', inviter.code)).status, 200)
  const progressResponse = await fetch(`${url}/referral?code=${inviter.code}`)
  assert.equal(progressResponse.status, 200)
  assert.equal((await progressResponse.json()).referral.count, 1)
  const stored = JSON.parse(await readFile(file, 'utf8')) as { phone: string, referredBy?: string }[]
  assert.deepEqual(stored.map(({ phone }) => phone).sort(), ['+12025550123', '+12025550124'])
  assert.equal(stored.filter(({ referredBy }) => referredBy === inviter.code).length, 1)

  // Country selection happens in the form. The shared API receives canonical E.164,
  // so national and explicitly international presentations still refer to one signup.
  const ukNational = normalizePhone('02079460958', 'GB')!
  const ukInternational = normalizePhone('+44 20 7946 0958', 'FR')!
  const ukFirst = await post(ukNational, inviter.code)
  assert.equal(ukFirst.status, 201)
  const ukReferral = (await ukFirst.json()).referral
  const ukDuplicate = await post(ukInternational, inviter.code)
  assert.equal(ukDuplicate.status, 200)
  assert.deepEqual((await ukDuplicate.json()).referral, ukReferral)
  const afterInternational = await fetch(`${url}/referral?code=${inviter.code}`)
  assert.equal((await afterInternational.json()).referral.count, 2)
  const allStored = JSON.parse(await readFile(file, 'utf8')) as { phone: string }[]
  assert.equal(allStored.filter(({ phone }) => phone === '+442079460958').length, 1)
})
