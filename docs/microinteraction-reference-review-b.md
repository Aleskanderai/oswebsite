# Microinteraction reference review B

Reviewed the three user-supplied videos by extracting timestamped frames with FFmpeg. The source files are local to this workspace session; review contact sheets and individual frames are under `/tmp/openswarm-microinteraction-b/`. Timestamps below describe observed states, not inferred source-code timings or easing curves.

## 1. Corner smoothing

Source: `/Users/alexdakhli/Downloads/RQIHaKqF5PN1k6Lw.mp4` — 14.19 seconds, 1918 × 1440.

| Timestamp | Visible evidence |
| --- | --- |
| 01.00–02.00 | A blue rounded square; the smoothing control reads 23%. |
| 03.00 | The slider is farther right and reads 38%; the square retains its size and position. |
| 05.00–07.00 | The slider reads 60% and the Apple marker beneath it is highlighted. The corners blend more gradually into the straight edges. |
| 10.00 | The slider reads 90%, showing another corner-continuity state. |
| 13.00 | The slider returns to 23%. The page layout remains stationary throughout. |

Lesson: changes in surface geometry should preserve the object's footprint. This reference is about direct manipulation of corner smoothing, not a looping animation or a menu entrance. No corner-morphing or new control was added to the navigation; its approved geometry is preserved.

Contact sheet: `/tmp/openswarm-microinteraction-b/RQIHaKqF5PN1k6Lw-contact.png`.

## 2. Contextual reveal zone

Source: `/Users/alexdakhli/Downloads/Jm0pW70psxXH_bxR.mp4` — 5.02 seconds, 2880 × 2160.

| Timestamp | Visible evidence |
| --- | --- |
| 00.00–00.65 | A scrollable article card shows content and statistics; no Back to Top control is visible. The adjacent explanatory diagram labels an inactive region and a lower Reveal Zone. |
| 00.80 | Back to Top becomes visible as the lower landscape card reaches the lower region. |
| 01.10–03.65 | The compact button remains in the lower portion of the article while that context remains visible. |
| 03.95 | The article has moved upward again; the control is fading near the clipped lower edge. |
| 04.10–04.50 | The control is absent again. The article title/header has stayed in the same position. |

Lesson: show secondary actions where they become useful rather than occupying permanent navigation space. The root implementation owns the footer's contextual Back to Top behavior. This navigation change hides the top waitlist action below the `md` breakpoint, as explicitly requested; the hero form remains the primary mobile signup surface. No second floating control was introduced.

Contact sheets: `/tmp/openswarm-microinteraction-b/Jm0pW70psxXH_bxR-contact.png` and `Jm0pW70psxXH_bxR-transitions.png`.

## 3. Independent child entrances

Source: `/Users/alexdakhli/Downloads/nUaBcLWoV6JsPBso.mp4` — 19.26 seconds, 1924 × 1440.

The two columns are explicitly labeled “Whole container animated” and “Children animate separately.” Each contains three architectural image cards.

| Timestamp | Visible evidence |
| --- | --- |
| 01.15–01.25 | Both columns are hidden. |
| 01.35 | The left column's three cards appear together at similar opacity. The right column starts with its top card. |
| 01.45 | All left-column cards are clearly visible; the third right-column card is still pale while the upper cards are farther along. |
| 01.55–01.85 | Right-column cards settle in sequence; captions and small controls arrive after their image surfaces. |
| 02.00–03.15 | Both columns have reached the same complete layout. |
| 03.30 | The left column fades as one unit. The right column's lower card remains stronger than the upper cards during the exit sequence. |
| 03.45–03.60 | The final lower card fades; both sides then return to the hidden state. |

Lesson: independent child entrances make the content sequence legible while the containing surface stays anchored. Adapt this at a small scale for navigation rather than importing the video's longer, more dramatic horizontal travel.

Contact sheets: `/tmp/openswarm-microinteraction-b/nUaBcLWoV6JsPBso-contact.png`, `nUaBcLWoV6JsPBso-entrance.png`, and `nUaBcLWoV6JsPBso-transitions.png`.

## Navigation changes grounded in these references

- The desktop mega-panel's inner content fades in place; each link independently fades and settles upward by 5px over 240ms, with a 25ms interval between links. The surface, two-column structure, feature artwork, icons, and destinations remain intact.
- On phones, the top waitlist action is hidden. Expanded accordion links use compact, minimum-44px rows; explanatory descriptions remain available to screen readers while the visible menu shows the icon and label. The existing drawer waitlist action is retained.
- Mobile sheet and accordion transitions are short (280ms and 240ms respectively). Reduced-motion mode immediately reveals content without the item translation, delay, or animated height transition.
- Corner geometry stays stable, following the first video's invariant footprint without adding an unrelated smoothing demo.

Verification: targeted `oxlint` of `src/components/Nav.tsx`, `tsc -b`, and a Vite production build passed. Vite reported the existing large-bundle warning. Full-site visual verification is coordinated by the root agent across the concurrent hero, footer, and benchmark changes.
