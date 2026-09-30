# Waitlist confirmation and invitations

## Current reference lock

The user’s Stanley card informs the compact invitation flow and copy/link controls. The latest direction explicitly removes gift artwork, colored bubbles and game-like reward tiles. The implemented invitation is now a quiet product dialog: white surface, thin neutral border, compact Open Swarm branding and a clear explanation of the three-referral reward. No invented countdown, access date, or free-month reward is included.

| Decision | Source | Role |
| --- | --- | --- |
| Compact white 392px dialog, 14px corner radius, thin border | Stanley’s restrained information card and latest user correction | Invitation surface only; does not expand the hero permanently |
| Plain Share2 icon and text, transparent 44px touch target | Latest request to remove gift/bubble styling | Share entry point |
| Dark 44px action with 8px radius | Latest request for understated product controls | Copy/share action; no metal or pill treatment |
| Three thin progress segments with a factual count | Approved three-successful-referral reward | Actual server progress; no numbered friend cards |
| Native modal dialog | Refero craft: focus, forms, touch and accessibility | Focus containment, Escape, inert page and return focus |
| Short 180ms entrance with reduced-motion variant | Refero motion guidance | Opening feedback only |

## Integration

- `WaitlistForm` retains the compact phone field and signup action. On confirmed API success, the small checkmark celebration remains. The confirmation explains **We’ll text you when early access opens.**
- `WaitlistShareButton` from `@/components/ui/WaitlistReferral` accepts normal button props, an optional `className`, and optional children (for example **Invite friends**). It defaults to **Share**. The hero form hosts its dialog.
- Before signup, the card says **Invite friends. Get early access.** and explains the reward. **Get my invite link** closes the dialog and focuses the phone field. Already-joined users can recover a link by submitting the same number.
- Confirmed signup changes the heading to **You’re on the list.** Three successful referrals change it to **Priority access unlocked.**
- After signup, users get a personal link, copy action, optional native share sheet and actual progress. Three unique referred signups unlock priority early access.
- Progress refreshes whenever the card opens or its browser tab becomes visible. Errors offer Retry; they never invent success or increase a count.
- A missing referral (`404`) clears only that exact saved code and returns the card to its join-first state. It also invalidates an in-memory initial referral for the open dialog. A newer code stored by another tab is never removed.

## Persistence and boundaries

- The browser saves only the user’s random referral code in local storage. It stores incoming `?ref=` attribution in session storage. Phone numbers are never persisted by this frontend or placed in referral links.
- Links always use a public origin: `VITE_PUBLIC_SITE_URL`, defaulting to `https://openswarm.com`. The configured Vite base path is preserved, but unrelated query parameters, hashes, URL credentials, malformed origins and localhost/loopback overrides are discarded or rejected. Local preview produces public Open Swarm links, never localhost links.
- Public cross-device referral routing still requires deploying the site and API together at that public origin. Local preview does not publish the referral backend or transfer its local signup records. This is an integration requirement, not copy in the user flow.
- Clipboard failure leaves the entire link selectable. Native-share cancellation is quiet; other native-share errors fall back to copying.
- The dialog uses native modal focus containment, an accessible title/description, Escape, backdrop dismissal, a named close button, body scroll lock and focus restoration. It fits a 320px viewport and supports internal scrolling on short screens.
- New unique referred phones, deduplication, self-referral protection and durable reward state are enforced by the companion local waitlist API, not the UI.

## Validation

TypeScript, targeted lint and public-URL checks passed, including malformed configuration, localhost/loopback rejection, a custom public domain, preserved base path and tracking/hash cleanup. The integrated signup, copying, stale-code recovery and three-referral unlock flows were checked in Chrome. This latest neutral revision only changes decorative markup and CSS; root performs the final shared-browser visual review.
