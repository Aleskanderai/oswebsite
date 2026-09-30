# Hero and referral pass — 2026-09-29

Reference lock: the supplied Aside screenshot and https://aside.com own the hero's smooth static cloud atmosphere, lighter type, compact vertical rhythm, and wider product reveal. The supplied Stanley gift card owns the compact invite-card hierarchy, copy-link affordance, and clear reward. Open Swarm keeps its own mascot, navigation, metal controls, and working product scene.

| Decision | Source | Role / reason |
| --- | --- | --- |
| Static cyan sky with soft natural clouds | Aside screenshot + explicit request | Hero backdrop only; no dots or background animation |
| Everyone gets a Jarvis now. | User | Exact headline, lighter weight, fewer lines of supporting copy |
| 100% free + 6,327 people on the waitlist | User-confirmed facts | Above-fold product cost and social proof, no artificial increment |
| Wider and higher product window | User + Aside composition | Show real product immediately; preserve the internal demo |
| Task-specific marketplace actions | User | Explain the intent behind each card |
| Three successful friend signups unlock priority early access | User-confirmed reward | Server-counted unique referrals, no client-generated progress |
| We'll text you when early access opens | User-confirmed date policy | No invented launch date |
| Small share button and confirmation dialog | Stanley reference | Keep the hero compact before signup; explain next step and invite reward afterward |

Implementation and validation notes will be appended after review.

## Static sky asset

Built-in image generation produced `public/media/hero-sky.webp` (1536 × 1024), adapted to WebP for delivery. Its presentation has a 3px static softness filter; there is no canvas, requestAnimationFrame, timer, parallax, or pixel overlay in Sky. The mascot on the hero window is also static. Product-demo motion remains independent.

Prompt: Create a polished static website background image, landscape 3:2 composition, no text, no UI, no logo, no symbols. A bright clear cyan blue sky with very soft natural white cumulus clouds. Overall serene minimal clean luminous photographic atmosphere with slightly dreamy soft focus, smooth edges, subtle dimensional cloud shading, not illustration outlines. Composition: upper center and central 55% largely clear pale cyan with generous negative space for dark headline; two asymmetric sculptural cloud banks entering from far left and far right near the upper third, a broad low white cloud bank along the bottom edge. Keep uppermost 12% very calm clear sky for navigation. Dominant sky colors light aqua #8fe4f0 and #a7e9f2, cloud white #f9ffff, faint cool shade. Clouds should have rounded billowy believable forms and very soft details, enough character to feel like actual clouds but not dramatic, not stormy. Avoid dots, pixel art, dithering, checkerboard, stars, grain, noise, harsh contours, purple, saturated royal blue, sunsets, birds, any text. This is an original Open Swarm website hero wallpaper intended to sit behind a compact centered headline above a large desktop app window.

## Follow-up design choices

The original purple Entrepreneurs First badge is restored. The user-confirmed 6,327 count is emphasized with larger purple typography; it stays a fixed supplied figure rather than falsely incrementing on local test submissions. The Share control uses a published Lucide Share2 icon and text with no filled pill. The invitation is a neutral white card with thin progress segments, a copy-link field and a dark rectangular action. Phone and waitlist controls have restrained 9px corners and quiet surfaces. The phone icon is a published Lucide Smartphone asset. No gift artwork, colored tiles or game-like rewards decoration are rendered. The navigation action is “Get early access,” the form is “Join free waitlist,” and marketplace actions are task-specific. Generated artwork remains confined to the sky; published brand/icon assets are used for interface identity.

Public invite links point to `https://openswarm.com/?ref=…` (configurable public origin) even during local preview. The API/referral data still run locally until this implementation is deployed. This pass does not send SMS or publish the site.

## Verification

- Production build and targeted frontend/server lint pass. Existing Vite large-chunk advisory remains.
- Eleven isolated API tests pass, including migration, deduplication, concurrent attribution, three-referral unlock, restart persistence, corruption handling and private-store protection.
- Chrome confirmed signup, personal-link copying, referral progress, priority unlock at three, incoming URL attribution, public openswarm.com invite URLs, Escape/focus recovery and stale-code recovery. Five reserved test entries were removed without changing other records.
- Hero/form layout inspected at desktop, 390px and320px; tablet navigation at768px received a no-wrap fix. The final rectangular controls and emphasized count were inspected on desktop. Later neutral referral styling retains the same responsive width/max-height constraints; its TypeScript/lint/build checks pass.
- The four product animation scene checksums remain unchanged. The illustrated compact footer remains unchanged.
- Initial URL fragments now resolve after React mounts, using Lenis or reduced-motion native scrolling and the fixed-header offset.
