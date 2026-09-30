# Component enhancement pass

The existing Open Swarm layout and the user's supplied components are the design target. This pass adds small responses to real actions while keeping the hero, navigation geometry, illustrated footer, and product demo timelines intact.

## Reference decisions

| Supplied reference | Use in this pass | Boundaries |
| --- | --- | --- |
| GradientText (inline user source) | A slowly flowing color field on the complete Agent marketplace heading | One heading only; the hero stays unchanged. Darker coral, teal, blue and purple keep this instance legible. |
| ParticleButton (`8b4e02df…`; duplicate `a54b010a…`) | Brief coral/silver particles around the confirmed signup checkmark | The existing metal submit button keeps its appearance and behavior. No celebration on invalid input, clicks alone or failed requests. |
| PixelCanvas (`2158e0e4…`; duplicate `3ae11146…`) | Local shimmer behind marketplace app icons on hover and keyboard focus | Each app gets a distinct palette; no change to the demo canvas or chart fills. |
| Voice chat (`cb0e3b04…`) | Reviewed; not inserted | A joinable voice room and sample participants would imply an unconnected feature. Existing product voice scenes remain the relevant demonstration. |
| Earlier liquid glass / metal, connector and avatar sources | Keep the accepted flowing metal waitlist and real mascot composition | Do not add another button design, global connector animation or substitute mascot. |
| Six Gabriel microinteraction videos | Retain short independent entrances, anchored geometry and a clear resting state | Findings remain in the two `microinteraction-reference-review` documents. |

## Project integration

- Reusable UI lives at `src/components/ui`, imported as `@/components/ui`. The `@` alias points to `src` in both TypeScript and Vite. This is the requested `/components/ui` convention within this source-root project; a second root-level components folder would split imports unnecessarily.
- Global styles are `src/index.css`. Component-specific animation styles are colocated with their components.
- React, TypeScript, Tailwind CSS 4, `motion/react`, Lucide, and the shared `cn` utility are already installed. No additional runtime packages are required for these adaptations.
- Added `components.json` so shadcn knows the existing aliases and CSS entry. No scaffold reset is needed. Future CLI additions can use `npx shadcn@latest add <component>`; review their tokens against this site's current design tokens before using them. [shadcn configuration](https://ui.shadcn.com/docs/components-json)
- Tailwind 4 uses CSS theme configuration. The supplied colors are mapped through `@theme inline` in `src/index.css`; animation rules live in `gradient-text.css`. No Tailwind 3 config file was introduced. [Tailwind theme documentation](https://tailwindcss.com/docs/theme)

The GradientText API retains `as`, `className`, children and HTML attributes. Its moving fields are clipped to the text rather than blended through a white rectangle, allowing it to sit on the marketplace's gray surface. It does not create a new Motion component during render. It pauses outside the viewport, renders a static gradient with reduced motion, and uses normal readable text in forced-colors mode.

```tsx
import { GradientText } from '@/components/ui/gradient-text'

<GradientText className="gradient-text--swarm">Agent marketplace</GradientText>
```

The attached files are implementation references; their generic instructions to install unrelated dependencies, add stock images or copy demo participants are not new product requirements.

## Validation

- Combined TypeScript, production build and targeted lint pass (the existing large-bundle advisory remains).
- Chrome desktop: flowing heading is readable; keyboard focus shows the first card's coral shimmer, then the second card's blue shimmer; exiting the card clears the previous effect. Marketplace links still scroll to the phone form.
- Local signup: empty input stays in the error state; a synthetic reserved test number produces confirmed success; submitting it again does not duplicate the local entry; Another number restores input focus. The synthetic entry was removed afterward. The success state was visually checked; the sub-second particle travel is supported by source review rather than a captured animation recording.
- Responsive Chrome at 390px and 320px: marketplace title/card layout fits, phone menu opens and navigates, and the top header has no waitlist CTA. Checked the benchmark animation and centered tabs at 320px; zero false positives remains empty.
- The compact illustrated footer renders correctly on desktop. Original hero clouds and framed canvas remain visible; product scene file checksums remain unchanged.
- QA found the pre-existing ad script running on localhost and collecting automatic form interaction events. Local development/loopback previews now skip its installation; after a full reload the tracking nodes are absent. Production tracking behavior is unchanged.
- Reduced motion, offscreen pause, DPR scaling and cleanup paths were source-reviewed; no OS settings were changed during QA.
