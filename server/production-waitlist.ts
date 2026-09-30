import type { IncomingMessage, ServerResponse } from 'node:http'
import { Pool } from 'pg'
import { createPostgresWaitlistStore } from './postgres-waitlist.ts'
import { createWaitlistMiddleware, type WaitlistStore } from './waitlist.ts'

const unavailable: WaitlistStore = {
  async add() { throw new Error('A database connection is required.') },
  async referral() { throw new Error('A database connection is required.') },
}

/** Dependency injection keeps endpoint tests isolated from credentials and live databases. */
export function createProductionWaitlistHandler(store: WaitlistStore) {
  const middleware = createWaitlistMiddleware(store)
  return (request: IncomingMessage, response: ServerResponse): Promise<void> => new Promise((resolve) => {
    const finished = () => {
      response.removeListener('finish', finished)
      response.removeListener('close', finished)
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

/** Hosted entry points never fall back to a process-local JSON file. */
export function handleProductionWaitlist(request: IncomingMessage, response: ServerResponse) {
  if (!productionHandler) {
    const connectionString = process.env.DATABASE_URL?.trim()
    if (!connectionString) {
      return createProductionWaitlistHandler(unavailable)(request, response)
    }
    const pool = new Pool({
      connectionString,
      max: 3,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      statement_timeout: 5_000,
      allowExitOnIdle: true,
    })
    // Idle connection failures must not crash the process or expose credentials in logs.
    // A subsequent request reconnects or receives the middleware's safe 503 response.
    pool.on('error', () => {})
    productionHandler = createProductionWaitlistHandler(createPostgresWaitlistStore(pool))
  }
  return productionHandler(request, response)
}
