# Functionality audit — September 29, 2026

The local website and phone waitlist work. The hosted API implementation is prepared, but this workspace has not deployed it or connected a production database or SMS provider. Do not treat the local preview as a live lead-collection service.

## Verified flows

- Country selection accepts national formats; US ten-digit input needs no `+`. Explicit international input overrides the selection. Valid values are normalized and deduplicated before storage.
- A browser signup with a reserved example number opened the confirmation dialog and returned a personal `https://openswarm.com/?ref=…` URL. The copy button reported success.
- A duplicate of that number preserved its referral code. Three unique test invitees unlocked priority; reopening the dialog fetched and displayed `3 of 3 friends joined` and `Priority access unlocked`.
- Reloading and opening Share recovered the saved referral from the API. The public response exposes no phone numbers. The browser stores only the random share code.
- Invalid phone input shows an error and remains editable. API/save failures do not display a successful signup.
- Marketplace actions navigate to the phone form. Product links resolve their matching sections. Use-case links select their matching tab, arrow keys switch tabs, and direct tab URLs preserve the selection on reload.
- Navigation handles modified clicks natively, uses one scroll offset, and has keyboard focus handling. The phone menu releases its scroll lock on selection, Home, Escape and desktop resize.
- All X links now use `https://x.com/openswarm`; that page, the existing Discord invitation and Entrepreneurs First page returned HTTP 200.
- The prior Privacy and Terms URLs returned HTTP 404. Those links are hidden until approved HTTPS pages are configured with `VITE_PRIVACY_URL` and `VITE_TERMS_URL`.
- The confirmation dialog and navigation no longer start transparent. The proof count initially renders its real value and falls back to that value if decorative animation is suspended. This fixed blank confirmation content observed in the Safari preview.

Native sharing is available when the browser provides it, with clipboard/manual-copy fallbacks. The copy action was verified; no message or post was sent during testing. A public invite can only credit a new signup after the same backend is deployed behind the public domain.

## Validation

- `npm run build`: passes; Vite retains its existing large-bundle advisory.
- Scoped oxlint: passes for changed UI, helpers, API and server files.
- `node --experimental-strip-types --test server/*.test.ts`: 27 pass, one hosted PostgreSQL integration test skipped because no `TEST_DATABASE_URL` is configured.
- The actual migration and SQL store also passed an isolated embedded PostgreSQL audit, including constraints, deduplication, referral attribution, RLS and restart persistence. Hosted networking/TLS and multi-connection concurrency still need the configured database.
- Current browser checks used Safari plus desktop navigation checks in Chrome. Earlier phone component checks covered 320px and 395px layouts. No physical iPhone was used.
- Browser signup/referral tests used a separate temporary store on port 4311 and reserved example numbers. The workspace's existing `.data/waitlist.json` was not changed.
- The original HeroScene, AppsScene, BrowserScene and SwarmScene SHA-256 hashes match the preserved originals.

## Deployment and remaining connections

The previous preview script uploaded only static assets. It now prepares full source, requires an explicit Vercel target and its `DATABASE_URL`, and checks that both Node API functions are built before it can deploy. Offline staging and mocked guard tests pass; no deployment occurred. See [deployment instructions](deploy-preview.md) and [database setup](production-waitlist.md).

Remaining external inputs:

1. The intended hosting project and a server-only database connection, followed by migration and a hosted signup/referral smoke test. No project is linked here; the existing Railway authentication has expired.
2. The intended SMS provider/account and launch-notification setup. No text messages or phone-ownership verification are currently sent.
3. Approved working Privacy and Terms pages. No replacement legal terms have been invented.

Priority status currently records waitlist eligibility. It does not itself create or activate an Open Swarm product account. The desktop scenes remain visual demonstrations; their simulated app controls are not website actions.
