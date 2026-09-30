import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHash, timingSafeEqual } from 'node:crypto'
import { waitUntil } from '@vercel/functions'
import { Pool } from 'pg'
import { createPostgresWaitlistStore } from './postgres-waitlist.ts'
import { createWaitlistMiddleware, type WaitlistStore } from './waitlist.ts'
import { createEmailOutbox } from './email-outbox.ts'
import { createResendTransport, readEmailDeliveryConfig, type EmailDeliverySetup } from './email-delivery.ts'
import { createUnsubscribeHandler, unsubscribeUrl } from './email-unsubscribe.ts'
import { renderWaitlistEmail } from './waitlist-email.ts'

const unavailable: WaitlistStore = {
  async add() { throw new Error('A database connection is required.') },
  async referral() { throw new Error('A database connection is required.') },
}

/** Dependency injection keeps endpoint tests isolated from credentials and live databases. */
export function createProductionWaitlistHandler(store: WaitlistStore, afterSignup?: () => void) {
  const middleware = createWaitlistMiddleware(store)
  return (request: IncomingMessage, response: ServerResponse): Promise<void> => new Promise((resolve) => {
    const finished = () => {
      response.removeListener('finish', finished)
      response.removeListener('close', finished)
      if (request.method === 'POST' && response.statusCode === 201 && response.writableFinished) {
        // Delivery is separate from signup persistence; it cannot change the saved response.
        try { afterSignup?.() } catch { /* The protected worker can drain the durable queue later. */ }
      }
      resolve()
    }
    response.once('finish', finished)
    response.once('close', finished)
    middleware(request, response, () => {
      response.writeHead(404, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      response.end(JSON.stringify({ ok: false, error: 'Not found.' }))
    })
  })
}

let productionHandler: ReturnType<typeof createProductionWaitlistHandler> | undefined
let productionPool: Pool | undefined

function getProductionPool(): Pool | undefined {
  if (productionPool) return productionPool
  const connectionString = process.env.DATABASE_URL?.trim()
  if (!connectionString) return undefined
  productionPool = new Pool({
    connectionString, max: 3, connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000, statement_timeout: 5_000, allowExitOnIdle: true,
  })
  productionPool.on('error', () => {})
  return productionPool
}

function createDrain(pool: Pool, setup: Extract<EmailDeliverySetup, { state: 'ready' }>) {
  const { config } = setup
  const outbox = createEmailOutbox(pool)
  return (limit: number) => outbox.drain({
    limit,
    render(message) {
      const optOut = unsubscribeUrl(config.publicUrl, message.referralCode, config.secret)
      const rendered = renderWaitlistEmail({
        kind: message.kind, referralCode: message.referralCode,
        publicUrl: config.publicUrl, unsubscribeUrl: optOut, postalAddress: config.postalAddress,
      })
      return {
        from: config.from, to: [message.email], ...rendered,
        ...(config.replyTo ? { reply_to: config.replyTo } : {}),
        headers: { 'List-Unsubscribe': `<${optOut}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      }
    },
    send: createResendTransport(config.apiKey),
  })
}

/** Hosted entry points never fall back to a process-local JSON file. */
export function handleProductionWaitlist(request: IncomingMessage, response: ServerResponse) {
  if (!productionHandler) {
    const pool = getProductionPool()
    if (!pool) {
      return createProductionWaitlistHandler(unavailable)(request, response)
    }
    const setup = readEmailDeliveryConfig()
    const drain = setup.state === 'ready' ? createDrain(pool, setup) : undefined
    productionHandler = createProductionWaitlistHandler(
      createPostgresWaitlistStore(pool, undefined, { emailDelivery: setup.state === 'ready' }),
      drain ? () => waitUntil(drain(2).catch(() => undefined)) : undefined,
    )
  }
  return productionHandler(request, response)
}

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(body))
}

function authorized(value: string | undefined, secret: string): boolean {
  if (!value || value.length > 1_024 || Buffer.byteLength(secret) < 32) return false
  const digest = (text: string) => createHash('sha256').update(text).digest()
  return timingSafeEqual(digest(value), digest(`Bearer ${secret}`))
}

/** GET supports an external cron; POST supports a deliberate manual drain. */
export function createEmailWorkerHandler(options: {
  secret?: string
  setup: EmailDeliverySetup
  drain?: () => Promise<unknown>
}) {
  return async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    if (request.method !== 'GET' && request.method !== 'POST') {
      response.setHeader('Allow', 'GET, POST')
      json(response, 405, { ok: false, error: 'Method not allowed.' })
      return
    }
    if (!options.secret || Buffer.byteLength(options.secret) < 32) {
      json(response, 503, { ok: false, error: 'Email delivery is not configured.' })
      return
    }
    if (!authorized(request.headers.authorization, options.secret)) {
      json(response, 401, { ok: false, error: 'Unauthorized.' })
      return
    }
    if (options.setup.state !== 'ready' || !options.drain) {
      json(response, 503, { ok: false, error: 'Email delivery is not configured.' })
      return
    }
    try {
      const result = await options.drain()
      json(response, 200, { ok: true, result })
    } catch {
      json(response, 503, { ok: false, error: 'Email delivery is temporarily unavailable.' })
    }
  }
}

export function handleProductionEmailWorker(request: IncomingMessage, response: ServerResponse) {
  const setup = readEmailDeliveryConfig()
  const pool = setup.state === 'ready' ? getProductionPool() : undefined
  const drain = pool && setup.state === 'ready' ? createDrain(pool, setup) : undefined
  return createEmailWorkerHandler({
    secret: process.env.CRON_SECRET?.trim(), setup,
    drain: drain ? () => drain(5) : undefined,
  })(request, response)
}

export function handleProductionUnsubscribe(request: IncomingMessage, response: ServerResponse) {
  // Opt-out keeps working after sending is disabled, as long as its signing key is retained.
  const secret = process.env.WAITLIST_EMAIL_SECRET?.trim()
  const pool = getProductionPool()
  if (!secret || Buffer.byteLength(secret) < 32 || !pool) {
    json(response, 503, { ok: false, error: 'Email preferences are temporarily unavailable.' })
    return Promise.resolve()
  }
  const outbox = createEmailOutbox(pool)
  return createUnsubscribeHandler({ secret, unsubscribe: (code) => outbox.unsubscribe(code) })(request, response)
}
