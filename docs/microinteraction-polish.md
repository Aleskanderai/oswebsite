# Microinteraction polish — September 29

## Reference lock

The user's six Gabriel / @gabriell_lab videos are primary for motion; the current Open Swarm site remains the layout and brand target. The public profile could not be fetched by the web tool (403), so the supplied video frames are the reliable reference evidence for this pass. Timestamped findings are in `microinteraction-reference-review-a.md` and `microinteraction-reference-review-b.md`.

Preserve: hero typography and sky, compact phone waitlist, black/silver flowing metal, real app icons, existing product demos and their timelines, marketplace app semantics. Apply changes locally, with reduced-motion alternatives. Do not reproduce the reference UI or add every demonstrated effect.

| Change | Source / reason | Implementation |
| --- | --- | --- |
| Fluid benchmark animation | User clarified that “pixels” meant stronger animation, not square blocks; spring-arrival clip favors a clear end state | Smooth rounded bars, staggered rows, traveling leading light and specular wave, rolling numerical readouts, then settle. A 280ms delay lets the section become visible first. Exact zero stays unfilled. Figures and source note preserved. |
| Independent menu entrances | `nUaBcLWoV6JsPBso.mp4` | Anchored menu surface, 240ms child entrances, 25ms stagger. |
| Shorter page reveals | Child-entrance and spring-arrival clips | 12px travel over 480ms, once per element, crisp text. |
| Uncrowded phone navigation | Explicit user request | Hide top waitlist action below 768px; retain hero form and optional drawer action; compact 44px submenu rows. |
| Contextual return action | `Jm0pW70psxXH_bxR.mp4` | Back to top reveals in the footer, keeping the header clear. |
| Matte cloud edge | User rejects white fade | Two shallow scalloped cloud layers in cool off-white, subtle contour, no blur; keep the full framed canvas in front. |
| Less dead space | Explicit user request | Intro top spacing halves from 96/128px to 48/64px. |
| Compact illustrated footer | User explicitly restored the earlier cobalt/ivory artwork direction after rejecting a plain footer | Original coastal artwork, framed at 480px minimum desktop /600px mobile, Open Swarm mascot and tagline, safe navigation and Back to top. |
| Browser artwork and colored trails | Latest user correction asks for a real browser asset, colored particle leakage and centered metrics | Published Microsoft Fluent Color webpage SVG in the heading and comparison row; continuous coral/teal gradient bars emit small colored flecks while filling, then settle. Stats and equal-width tabs are centered. |
| Current product positioning | User states Open Swarm is no longer open source | Removed open-source wording from hero and page description, and the footer's product MIT claim. Third-party icon licenses stay intact. |

## Validation

- TypeScript / production build and targeted lint pass.
- The earlier grid chart was visually inspected, then superseded by the user-requested smooth fluid bars. Final animation code clamps to exact ratios and emits no fill for zero.
- Keyboard Left and Home move focus and select Speed / Task accuracy with correct values.
- Product scene source files remain unchanged by this pass.
- Later Chrome verification completed during the component enhancement pass: inspected the fluid colored bars, exact empty zero state, centered tabs at 320px, phone header/menu, and compact illustrated desktop footer. The connection recovered after earlier interruptions; see `component-enhancement-pass.md` for the scope of checks.

Additional audit fixes: intro body copy uses the darker text token; desktop dropdowns animate measured heights when switching content; the phone cloud bank extends below the demo so its contour remains visible. Existing app demo scene checksums are unchanged.
