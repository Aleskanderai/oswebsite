# Waitlist success polish

Reference: the user's supplied `particle-button.tsx` component (`8b4e02df-07b5-4fc0-9355-4e574ac38d2a/pasted-text.txt`, duplicated in `a54b010a-f1f3-4420-ab2f-7769594c9c20`). The small success burst is a good fit for confirmed waitlist signup; the page keeps its existing compact controls and spacing.

- `src/components/ui/particle-button.tsx` exports a reusable `SuccessParticles` wrapper, using the existing `motion/react` dependency and no additional button library.
- Eight deterministic coral and silver particles originate at the success checkmark. They finish within 600ms. They are local, decorative, ignore pointer events, and do not measure the DOM or add layout space.
- The original 44px black/silver `LiquidMetalButton`, form submission, validation, loading state, and failure messaging stay intact. A successful HTTP response with `{ ok: true }` is the only path to celebration. Clicking alone cannot trigger it.
- The checkmark settles quickly, followed by a short text entrance. Reduced motion displays the final success content immediately and omits particles.
- Motion owns and stops animation work when its elements unmount. There are no custom animation timers or RAF loops. Pending fetch and timeout are cleaned up on unmount; the “Another number” focus handoff uses an effect instead of an uncancelled RAF.

No backend, product scene, global CSS, or dimensions were changed. Validation: production TypeScript/Vite build and targeted Oxlint pass. Root agent handles the combined browser review.

## Local preview tracking guard

The browser review found that the existing X advertising script loads in local previews and inspects form interactions. `src/lib/x-pixel.ts` now returns before creating its queue, setting the installed flag, or adding its script/listener in Vite development, `localhost` (including subdomains), IPv4/IPv6 loopback, and `0.0.0.0` previews. Production tracking behavior is preserved. A full page reload removes any script already loaded by the preceding development session. TypeScript and targeted Oxlint pass.
