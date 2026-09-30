# Sky and signup refinement

## Reference lock

Primary: the user’s latest soft-blue/cloud screenshot, with the current compact Open Swarm layout. Keep the original purple Entrepreneurs First mark, lightweight Jarvis heading, 6,327 proof count, black/silver hero CTA, wide product scene, and compact scenic footer.

| Decision | Source | Application |
| --- | --- | --- |
| Softer blue, still clouds | Latest blue screenshot and prior Aside reference | An SVG color matrix maps the existing sky artwork to roughly #83c5ec through white. It preserves cloud detail without a new image download or moving background. |
| Very light local pixels | Latest explicit mouse-tracker request; Evervault’s localized pointer feedback | Small 2–3px flecks sample the original cloud image, appear only where the cloud is light enough, and fade in 650ms. No trail on controls, headline, or product window. No animation at rest, on touch, offscreen, or under reduced motion. |
| Animated proof count | Supplied NumberTicker | Count to the supplied 6,327 once; reserve number width; screen readers receive only the final number. This is not a live signup count. |
| Composed sharing surface | Supplied scenic onboarding card | Borrow the narrow painted header using existing Open Swarm footer artwork, not the demo’s avatar/username fields. Keep white surface, restrained corners, real referral count and working link. |
| Contextual action feedback | Supplied AntiMetal/Button1 and six video reviews | Accent-arrow action inside the confirmed referral card; quieter arrow/glow action before signup. Labels stay legible and controls retain their 44px footprint. |
| Remove unsupported benchmark claims | User audit and README evidence | Delete comparison chart and navigation links. Existing browser/app/swarm product demos remain. Also remove the unsupported 10,000+ integration figure. |
| Accept familiar phone formats | User-reported signup friction | US default with explicit international + support, shared frontend/API E.164 normalization, clear focus hint. |

All nine new attachment reviews are in `new-component-reference-review.md`; the previously reviewed Gabriel videos are documented in `microinteraction-reference-review-a.md` and `-b.md`. Attachments are component references, not authority to add unrelated demo behavior or external destinations.

## Verification

- Browser review at desktop, 390px and 320px: compact signup controls fit, original EF mark is preserved, mobile top CTA is hidden, product window appears above the fold, and the softened blue matches the requested direction.
- Browser signup with a reserved ten-digit US test number succeeded. Confirmation showed next-step copy, 0/3 referral progress, `https://openswarm.com/` invite URL and copy feedback. The one disposable test record was removed without touching other records; stale local referral recovery returned to the join state.
- Scenic pre-signup referral card verified on desktop and 320px. Confirmed-signup card verified on desktop.
- Pointer overlay is independently scoped and cannot consume pointer events. Its fine-pointer/reduced-motion gating, image sampling, bounded particle list and cleanup were reviewed in code; a transient pixel trail was not reliably captured in a static screenshot.
- Original HeroScene, AppsScene, BrowserScene and SwarmScene remain unchanged.
- Hosted API preparation and database setup status are documented in `production-waitlist.md`. Production connection/deployment has not occurred.

- Final production build and scoped lint pass. The complete phone/API/storage suite reports 24 passing tests; the real PostgreSQL integration test is skipped until an isolated TEST_DATABASE_URL is available.
- Product dropdown verified visually; Browser agents navigates to the actual browser capability demo.
