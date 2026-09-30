import { randomBytes, randomUUID } from 'node:crypto'
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'
import { normalizePhone } from '../src/lib/phone.ts'

type WaitlistEntry = {
  phone: string
  source: string
  createdAt: string
  referralCode?: string
  referredBy?: string
}

export type ReferralStatus = {
  code: string
  count: number
  goal: 3
  priorityAccess: boolean
}

export type WaitlistStore = {
  add(phone: string, source: string, referralCode?: string): Promise<{ added: boolean, referral: ReferralStatus }>
  referral(code: string): Promise<ReferralStatus | null>
}

const MAX_BODY_BYTES = 4_096
const REFERRAL_CODE = /^[A-Za-z0-9_-]{32}$/

function isReferralCode(value: unknown): value is string {
  return typeof value === 'string' && REFERRAL_CODE.test(value)
}

// Vite 8's defaults are internal. Keep them when adding the local data deny rule.
const DEFAULT_SERVER_FS_DENY = [
  '.env',
  '.env.*',
  '*.{crt,pem,key,p12,pfx,cer,der}',
  '.npmrc',
  '.yarnrc.yml',
  '**/.git/**',
]

function isEntry(value: unknown): value is WaitlistEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<WaitlistEntry>
  return (
    typeof entry.phone === 'string' &&
    normalizePhone(entry.phone) === entry.phone &&
    typeof entry.source === 'string' &&
    entry.source.trim().length > 0 &&
    entry.source.length <= 64 &&
    typeof entry.createdAt === 'string' &&
    Number.isFinite(Date.parse(entry.createdAt)) &&
    (entry.referralCode === undefined || isReferralCode(entry.referralCode)) &&
    (entry.referredBy === undefined || isReferralCode(entry.referredBy))
  )
}

/** A single local process owns this file; queued writes cannot lose another signup. */
export function createWaitlistStore(filePath: string) {
  let queue: Promise<unknown> = Promise.resolve()

  async function readEntries(): Promise<WaitlistEntry[]> {
    let entries: WaitlistEntry[] = []
    let contents: string | undefined
    try {
      contents = await readFile(filePath, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }

    if (contents !== undefined) {
      const parsed: unknown = JSON.parse(contents)
      if (!Array.isArray(parsed) || !parsed.every(isEntry)) {
        throw new Error('The local waitlist file is invalid.')
      }
      entries = parsed
    }
    const codes = entries.flatMap((entry) => entry.referralCode ? [entry.referralCode] : [])
    if (new Set(entries.map((entry) => entry.phone)).size !== entries.length || new Set(codes).size !== codes.length) {
      throw new Error('The local waitlist file has duplicate entries.')
    }
    return entries
  }

  async function writeEntries(entries: WaitlistEntry[]) {
    const directory = path.dirname(filePath)
    await mkdir(directory, { recursive: true, mode: 0o700 })
    const temporaryPath = `${filePath}.${randomUUID()}.tmp`
    try {
      const file = await open(temporaryPath, 'wx', 0o600)
      try {
        await file.writeFile(`${JSON.stringify(entries, null, 2)}\n`, 'utf8')
        await file.sync()
      } finally {
        await file.close()
      }
      await rename(temporaryPath, filePath)
      const directoryHandle = await open(directory, 'r')
      try {
        await directoryHandle.sync()
      } finally {
        await directoryHandle.close()
      }
    } finally {
      await unlink(temporaryPath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error
      })
    }
  }

  function referralStatus(entries: WaitlistEntry[], code: string): ReferralStatus {
    const count = entries.filter((entry) => entry.referredBy === code && entry.referralCode !== code).length
    return { code, count, goal: 3, priorityAccess: count >= 3 }
  }

  function queued<T>(operation: () => Promise<T>): Promise<T> {
    const result = queue.then(operation)
    // A failed write must not block later requests after the underlying issue is fixed.
    queue = result.catch(() => undefined)
    return result
  }

  return {
    add(phone: string, source: string, referralCode?: string) {
      return queued(async () => {
        const entries = await readEntries()
        let entry = entries.find((candidate) => candidate.phone === phone)
        const added = !entry
        if (!entry) {
          entry = { phone, source, createdAt: new Date().toISOString() }
          // Attribute only a first signup. Re-submission cannot change an inviter or credit a second signup.
          if (referralCode && entries.some((candidate) => candidate.referralCode === referralCode)) {
            entry.referredBy = referralCode
          }
          entries.push(entry)
        }
        if (!entry.referralCode) {
          // 192 random bits; public share codes never encode a phone number or a record index.
          let code: string
          do {
            code = randomBytes(24).toString('base64url')
          } while (entries.some((candidate) => candidate.referralCode === code))
          entry.referralCode = code
          // Legacy records gain only a code; original fields and unknown metadata remain intact.
          await writeEntries(entries)
        }
        return { added, referral: referralStatus(entries, entry.referralCode) }
      })
    },
    referral(code: string) {
      return queued(async () => {
        const entries = await readEntries()
        if (!entries.some((entry) => entry.referralCode === code)) return null
        return referralStatus(entries, code)
      })
    },
  }
}

class RequestError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function readBody(request: IncomingMessage): Promise<string> {
  // Vercel's Node runtime may have already parsed/consumed the request stream.
  // Normalize that body through the same JSON validation and size limit as local requests.
  if ('body' in request && request.body !== undefined) {
    const body = Buffer.isBuffer(request.body)
      ? request.body.toString('utf8')
      : typeof request.body === 'string' ? request.body : JSON.stringify(request.body)
    if (Buffer.byteLength(body ?? '', 'utf8') > MAX_BODY_BYTES) {
      return Promise.reject(new RequestError(413, 'This request is too large.'))
    }
    return Promise.resolve(body ?? '')
  }
  if (request.readableEnded) return Promise.resolve('')
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    let tooLarge = false
    request.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        if (!tooLarge) reject(new RequestError(413, 'This request is too large.'))
        tooLarge = true
        chunks.length = 0
      } else if (!tooLarge) {
        chunks.push(chunk)
      }
    })
    request.on('end', () => {
      if (!tooLarge) resolve(Buffer.concat(chunks).toString('utf8'))
    })
    request.on('error', reject)
    request.on('aborted', () => reject(new RequestError(400, 'The request was interrupted.')))
  })
}

function respond(response: ServerResponse, status: number, body: object) {
  if (response.destroyed || response.writableEnded) return
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  response.end(JSON.stringify(body))
}

export function createWaitlistMiddleware(storage: string | WaitlistStore): Connect.NextHandleFunction {
  const store = typeof storage === 'string' ? createWaitlistStore(storage) : storage

  return (request, response, next) => {
    let requestPath = request.url?.split('?')[0] ?? ''
    try {
      requestPath = decodeURIComponent(requestPath).replaceAll('\\', '/')
    } catch {
      // Vite handles malformed URL encoding for paths outside this middleware.
    }
    if (requestPath.toLowerCase().split('/').includes('.data')) {
      respond(response, 404, { ok: false, error: 'Not found.' })
      return
    }
    const rawPath = request.url?.split('?')[0]
    const isReferralRequest = rawPath === '/api/waitlist/referral'
    if (rawPath !== '/api/waitlist' && !isReferralRequest) return next()
    const allowedMethod = isReferralRequest ? 'GET' : 'POST'
    if (request.method !== allowedMethod) {
      response.setHeader('Allow', allowedMethod)
      respond(response, 405, { ok: false, error: isReferralRequest ? 'Use GET to check your referrals.' : 'Use POST to join the waitlist.' })
      return
    }

    async function handle() {
      if (isReferralRequest) {
        const code = new URL(request.url ?? '', 'http://localhost').searchParams.get('code')
        if (!isReferralCode(code)) throw new RequestError(404, 'This invite link was not found.')
        const referral = await store.referral(code)
        if (!referral) throw new RequestError(404, 'This invite link was not found.')
        respond(response, 200, { ok: true, referral })
        return
      }
      const contentType = request.headers['content-type']?.split(';')[0].trim().toLowerCase()
      if (contentType !== 'application/json') {
        throw new RequestError(415, 'Send the form as JSON.')
      }

      let input: unknown
      const body = await readBody(request)
      try {
        input = JSON.parse(body)
      } catch {
        throw new RequestError(400, 'The form could not be read. Please try again.')
      }
      if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new RequestError(400, 'Enter a valid US number, or use + and your country code.')
      }
      const { phone: rawPhone, source: rawSource = 'website', referralCode } = input as Record<string, unknown>
      const phone = typeof rawPhone === 'string' ? normalizePhone(rawPhone) : null
      if (!phone) {
        throw new RequestError(400, 'Enter a valid US number, or use + and your country code.')
      }
      if (typeof rawSource !== 'string' || !rawSource.trim() || rawSource.length > 64) {
        throw new RequestError(400, 'The form source is invalid. Please refresh and try again.')
      }
      if (referralCode !== undefined && !isReferralCode(referralCode)) {
        throw new RequestError(400, 'The invite code is invalid. Please refresh and try again.')
      }

      const { added, referral } = await store.add(phone, rawSource.trim(), referralCode)
      respond(response, added ? 201 : 200, { ok: true, referral })
    }

    void handle().catch((error: unknown) => {
      if (error instanceof RequestError) {
        respond(response, error.status, { ok: false, error: error.message })
      } else {
        // Do not expose phone numbers, file contents, or filesystem paths in responses or logs.
        respond(response, 503, { ok: false, error: 'The waitlist could not be saved. Please try again.' })
      }
    })
  }
}

/** Local development and local preview only. Static hosting needs a hosted API. */
export function localWaitlistPlugin(): Plugin {
  let middleware: Connect.NextHandleFunction
  return {
    name: 'local-phone-waitlist',
    config(config) {
      return {
        server: {
          fs: {
            deny: [...new Set([
              ...DEFAULT_SERVER_FS_DENY,
              ...(config.server?.fs?.deny ?? []),
              '**/.data/**',
            ])],
          },
        },
      }
    },
    configResolved(config) {
      middleware = createWaitlistMiddleware(path.join(config.root, '.data', 'waitlist.json'))
    },
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
