import { normalizeEmail } from '../src/lib/email.ts'
import type { EmailPayload } from './email-outbox.ts'

export type EmailDeliveryConfig = {
  apiKey: string
  from: string
  replyTo?: string
  publicUrl: string
  secret: string
  cronSecret: string
  postalAddress?: string
}

export type EmailDeliverySetup =
  | { state: 'disabled' }
  | { state: 'invalid' }
  | { state: 'ready', config: EmailDeliveryConfig }

function mailbox(value: string | undefined): string | null {
  if (!value || value.length > 320 || /[\r\n]/.test(value)) return null
  const address = value.match(/^[^<>]+<([^<>]+)>$/)?.[1] ?? value
  return normalizeEmail(address) ? value : null
}

/** Server-only opt-in. Never infer a sending identity from the website or request host. */
export function readEmailDeliveryConfig(env: NodeJS.ProcessEnv = process.env): EmailDeliverySetup {
  if (env.WAITLIST_EMAIL_ENABLED !== 'true') return { state: 'disabled' }
  const apiKey = env.RESEND_API_KEY?.trim()
  const from = mailbox(env.WAITLIST_EMAIL_FROM?.trim())
  const replyTo = env.WAITLIST_EMAIL_REPLY_TO?.trim()
  const secret = env.WAITLIST_EMAIL_SECRET?.trim()
  const cronSecret = env.CRON_SECRET?.trim()
  const postalAddress = env.WAITLIST_EMAIL_POSTAL_ADDRESS?.trim()
  let publicUrl: URL
  try { publicUrl = new URL(env.WAITLIST_EMAIL_PUBLIC_URL ?? '') } catch { return { state: 'invalid' } }
  if (!apiKey || /\s/.test(apiKey) || !from || (replyTo && !mailbox(replyTo)) ||
    !secret || Buffer.byteLength(secret) < 32 || !cronSecret || Buffer.byteLength(cronSecret) < 32 ||
    /[\r\n]/.test(cronSecret) || publicUrl.protocol !== 'https:' || publicUrl.username || publicUrl.password ||
    publicUrl.search || publicUrl.hash || publicUrl.hostname === 'localhost' ||
    (postalAddress && postalAddress.length > 500)) return { state: 'invalid' }
  return { state: 'ready', config: {
    apiKey, from, replyTo, secret, cronSecret,
    publicUrl: publicUrl.href.replace(/\/$/, ''), postalAddress,
  } }
}

/** Provider detail is deliberately excluded from the error message. */
export class EmailDeliveryError extends Error {
  readonly retryable: boolean
  constructor(message: string, options: { retryable: boolean }) {
    super(message)
    this.name = 'EmailDeliveryError'
    this.retryable = options.retryable
  }
}

/** One bounded attempt; the durable outbox owns retries and stores the exact payload. */
export function createResendTransport(apiKey: string, fetcher: typeof fetch = fetch, timeoutMs = 8_000) {
  return async (payload: EmailPayload, idempotencyKey: string): Promise<{ id: string }> => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'error',
      })
      if (!response.ok) {
        // Retry an in-flight idempotent request; a changed payload with the same key is permanent.
        let concurrent = false
        if (response.status === 409) {
          const body: unknown = await response.json().catch(() => null)
          concurrent = !!body && typeof body === 'object' &&
            (body as { name?: unknown }).name === 'concurrent_idempotent_requests'
        } else {
          await response.body?.cancel().catch(() => undefined)
        }
        const retryable = concurrent || response.status === 408 || response.status === 429 || response.status >= 500
        throw new EmailDeliveryError('Email delivery was not accepted.', { retryable })
      }
      const result: unknown = await response.json()
      if (!result || typeof result !== 'object' || typeof (result as { id?: unknown }).id !== 'string' ||
        !(result as { id: string }).id) {
        throw new EmailDeliveryError('Email delivery could not be confirmed.', { retryable: true })
      }
      return { id: (result as { id: string }).id }
    } catch (error) {
      if (error instanceof EmailDeliveryError) throw error
      throw new EmailDeliveryError('Email delivery is temporarily unavailable.', { retryable: true })
    } finally {
      clearTimeout(timer)
    }
  }
}
