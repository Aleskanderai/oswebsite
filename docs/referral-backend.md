# Local waitlist referrals

The approved reward is **priority early access after three friends join**. There is no confirmed launch date; confirmation copy should say, “We’ll text you when early access opens.”

The Vite development and preview server persists signups and referral attribution in the existing private `.data/waitlist.json` file. No live signup data was changed while implementing or testing this feature.

## API contract

`POST /api/waitlist` accepts JSON:

```json
{
  "phone": "+12025550123",
  "source": "hero",
  "referralCode": "an-optional-32-character-code___"
}
```

The optional referral code is exactly 32 URL-safe characters (`A–Z`, `a–z`, `0–9`, `_`, `-`). New signups return HTTP 201; returning numbers return HTTP 200. Both return:

```json
{
  "ok": true,
  "referral": {
    "code": "a-random-32-character-share-code",
    "count": 0,
    "goal": 3,
    "priorityAccess": false
  }
}
```

`GET /api/waitlist/referral?code=<code>` returns the same public status shape. Unknown or malformed codes return 404. Responses never contain a phone number, source, signup date, or file path. All responses use `Cache-Control: no-store`.

Unknown but correctly shaped incoming invitation codes do not prevent a signup; they simply receive no referral attribution. Malformed supplied codes return 400. The frontend should send only valid-shaped codes captured from the `ref` URL parameter.

## Attribution and persistence

- Codes contain 192 bits from `crypto.randomBytes`, independent of phone numbers and signup order. Collisions are checked before use.
- A valid existing inviter is credited only when a new normalized phone number joins. A repeated signup cannot change its inviter, credit another signup, or count as a self-referral.
- Existing records receive a code lazily on their next submission. Their original date, source, and additional metadata remain intact, and they cannot be retroactively referred.
- Referral counts derive from durable attributed records. `priorityAccess` becomes true at three distinct referred phone numbers and remains true after restarting the server. This avoids a separately persisted flag drifting out of sync with its count.
- Queued atomic writes preserve simultaneous signups in one server process. Files retain private mode 0600; Vite blocks direct, encoded, transformed, and absolute access to `.data`.
- Duplicate identities/codes or malformed store data produce a generic 503 instead of overwriting the store.

## Scope

This is a functional **local** waitlist/referral implementation, consistent with the requested local build. Vite preview also serves it; a static deployment alone does not. A public deployment needs a hosted API and durable shared storage before invite links work across devices. The JSON store assumes one server process.

Priority eligibility is recorded; this implementation does not issue early-access accounts or send texts. Numbers are format-validated but not SMS-verified, so distinct numbers are counted rather than verified people. Phone verification and abuse controls belong in the hosted launch service. The public token grants access only to its non-sensitive referral progress; it is not an authentication token.

## Verification

`node --experimental-strip-types --test server/waitlist.test.ts` passes 11 tests covering durable saves, normalization and deduplication, legacy migration, threshold unlock, restart persistence, concurrent attributions, unknown/invalid codes, corrupt-store protection, storage failure, and Vite data privacy. Tests use isolated temporary files and reserved example numbers; they never write the workspace’s signup file.
