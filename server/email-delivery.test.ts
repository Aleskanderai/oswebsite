import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createResendTransport, EmailDeliveryError, readEmailDeliveryConfig } from './email-delivery.ts'
import type { EmailPayload } from './email-outbox.ts'

const valid: NodeJS.ProcessEnv = {
  WAITLIST_EMAIL_ENABLED: 'true', RESEND_API_KEY: 're_test_key',
  WAITLIST_EMAIL_FROM: 'Open Swarm <hello@example.com>',
  WAITLIST_EMAIL_REPLY_TO: 'team@example.com', WAITLIST_EMAIL_PUBLIC_URL: 'https://example.com',
  WAITLIST_EMAIL_SECRET: 'secret'.repeat(8), CRON_SECRET: 'worker'.repeat(8),
}
const payload: EmailPayload = {
  from: 'Open Swarm <hello@example.com>', to: ['recipient@example.com'],
  subject: 'You’re on the list.', html: '<p>Welcome.</p>', text: 'Welcome.',
  reply_to: 'team@example.com', headers: { 'List-Unsubscribe': '<https://example.com/unsubscribe>' },
}

test('sending is explicit opt-in and incomplete setup is safely invalid', () => {
  assert.deepEqual(readEmailDeliveryConfig({}), { state: 'disabled' })
  assert.deepEqual(readEmailDeliveryConfig({ ...valid, WAITLIST_EMAIL_ENABLED: 'false' }), { state: 'disabled' })
  for (const key of ['RESEND_API_KEY', 'WAITLIST_EMAIL_FROM', 'WAITLIST_EMAIL_SECRET', 'CRON_SECRET', 'WAITLIST_EMAIL_PUBLIC_URL']) {
    assert.deepEqual(readEmailDeliveryConfig({ ...valid, [key]: '' }), { state: 'invalid' })
  }
  assert.equal(readEmailDeliveryConfig(valid).state, 'ready')
  for (const url of ['http://example.com', 'https://user:pass@example.com', 'https://example.com?token=secret', 'https://example.com#hero']) {
    assert.equal(readEmailDeliveryConfig({ ...valid, WAITLIST_EMAIL_PUBLIC_URL: url }).state, 'invalid')
  }
  assert.equal(readEmailDeliveryConfig({ ...valid, WAITLIST_EMAIL_FROM: 'hello@example.com\nBcc: bad@example.com' }).state, 'invalid')
  assert.equal(readEmailDeliveryConfig({ ...valid, WAITLIST_EMAIL_SECRET: 'short' }).state, 'invalid')
})

test('provider receives exact HTML/text payload, separate reply address, and stable idempotency key', async () => {
  const calls: RequestInit[] = []
  const send = createResendTransport('private-key', async (url, init) => {
    assert.equal(url, 'https://api.resend.com/emails')
    calls.push(init!)
    return Response.json({ id: 'provider-message-id' })
  })
  assert.deepEqual(await send(payload, 'waitlist/job-id'), { id: 'provider-message-id' })
  await send(payload, 'waitlist/job-id')
  assert.equal(calls[0].body, JSON.stringify(payload))
  assert.equal(calls[0].body, calls[1].body)
  assert.equal(new Headers(calls[0].headers).get('Idempotency-Key'), 'waitlist/job-id')
  assert.equal(new Headers(calls[0].headers).get('Authorization'), 'Bearer private-key')
  assert.equal(calls[0].redirect, 'error')
})

test('provider errors classify retries without exposing its response or recipient', async () => {
  for (const [status, name, retryable] of [
    [400, 'validation_error', false], [401, 'authentication_error', false],
    [403, 'validation_error', false], [409, 'invalid_idempotent_request', false],
    [409, 'concurrent_idempotent_requests', true], [429, 'rate_limit_exceeded', true], [503, 'application_error', true],
  ] as const) {
    const send = createResendTransport('private-key', async () => Response.json({ name, message: 'recipient@example.com private-key' }, { status }))
    await assert.rejects(send(payload, 'waitlist/job-id'), (error: unknown) => {
      assert.ok(error instanceof EmailDeliveryError)
      assert.equal(error.retryable, retryable)
      assert.doesNotMatch(error.message, /recipient|private-key/)
      return true
    })
  }
})

test('network failures, malformed success, and timeout remain retryable with safe errors', async () => {
  for (const fetcher of [
    async () => { throw new Error('secret network detail') },
    async () => Response.json({ unexpected: true }),
    async (_url: unknown, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new Error('secret timeout detail')), { once: true })
    }),
  ]) {
    const send = createResendTransport('key', fetcher as typeof fetch, 5)
    await assert.rejects(send(payload, 'key'), (error: unknown) => {
      assert.ok(error instanceof EmailDeliveryError)
      assert.equal(error.retryable, true)
      assert.doesNotMatch(error.message, /secret/)
      return true
    })
  }
})
