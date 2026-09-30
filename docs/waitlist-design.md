# Waitlist reference lock

Scope: replace download/star conversion points with a phone-number waitlist; preserve the existing Open Swarm page, octopus, Geist typography, sky, section order, and coded demos.

| Decision | Reference | Adaptation |
| --- | --- | --- |
| Page composition and palette | Existing site and user's explicit constraint | Preserve; no new sections or theme change |
| Compact glass lens input and blue enamel metal submit | User correction plus supplied liquid-glass and metal button components | Two controls in a single 44px row; preserve original hero and product spacing |
| Translucent field and inset edge | UI Layout liquid-weather-glass on 21st.dev, supplied liquid glass button | Lightweight CSS surface; keep text crisp and omit draggable/weather behavior |
| Chrome-rimmed blue enamel, rolling type and press feedback | Supplied liquid metal buttons | CSS only, no continuous shader or GPU work |
| Consistent line icons | Refero bundled icons guidance | Lucide at 16–20 px; preserve original third-party logos |
| Clear labels, phone keyboard, focus and validation | Refero craft-details | International number validation on client and server; accessible error/success states |
| Honest completion | User authorized local storage | Show success only after API confirms durable local save; no invented rank, rewards, or SMS claims |

Refero live research was attempted but returned NO_SUBSCRIPTION. The supplied sources and bundled craft references ground this scoped change. The user later explicitly requested the scenic footer, which now uses an original generated coastal illustration.

Source: https://21st.dev/@uilayout.contact/components/liquid-weather-glass

## Navigation update

The user subsequently supplied a six-second Grain navigation clip and explicitly requested it as the top navbar reference. Preserve its wide frosted mega menu, two-column link layout, slim visual tile, and soft entrance. Per the user correction, the outer navbar keeps the original dimensions, rounded-rectangle hover states, and chevrons. Adapt to Open Swarm's existing wordmark, sky palette, links, and phone waitlist action. Retain a compact mobile accordion.

## Product surfaces and footer

User supplied painterly product-background references and asked for different palettes without touching the hero sky. Nonhero product demos now use original textured dawn, jade and dusk assets. Team tabs vary their palette/crop; foreground app panels remain glass/white. The illustrated coastal footer follows the supplied links-over-landscape composition. Exact built-in image-generation prompts, source outputs and saved assets: [image-assets.md](image-assets.md).

## Stronger controls and a single footer

The user rejected the muted initial controls and explicitly requested more playful styling. The supplied liquid-glass component now owns the rounded lens, double inset edge and highlights. The supplied liquid-metal component owns the reflective chrome shell, glossy face, physical press and moving glint. Open Swarm's existing sky blue is the CTA accent; the compact 44px row and all hero spacing remain fixed. A tiny illuminated phone badge responds on focus and existing RollText lettering rolls on hover. Motion respects the global reduced-motion override. The old blue closing CTA is removed, leaving the illustrated coastal footer as the single ending.

## Reference corrections: menu artwork, single illustrated scene, and canvas wallpaper

The user requested a composed artwork panel in the existing dropdown, published icon assets, removal of GitHub links, and a closer match to the supplied monochrome footer. Microsoft Fluent Emoji 3D PNGs and SVGL brand SVGs supply the menu and phone icons; provenance is recorded in `icon-sources.md`. The dropdown retains its existing dimensions while the mascot sits among real app tiles over a dusk wallpaper. The footer is now a full cobalt/ivory scene with its navigation directly over the cloudy sky (`footer-revision.md`).

The infinite canvas alone receives a heavily blurred twilight wallpaper (`canvas-wallpaper.md`); the outer hero sky, all demo timelines, cameras, cards, cursors and foreground animation files are preserved. The user confirmed there is no launch video yet, so all launch-video links are removed. Promotional GitHub links/icons are removed; the existing animated product demo content remains untouched as requested.

The latest waitlist reference supersedes the blue button treatment: black face, reflective neutral silver rim with tiny warm/cool highlights, clear light text. The field is neutral translucent glass, retaining its real mobile-phone asset and the compact 44px geometry.

## Latest scope correction

The user clarified that the scenic footer should remain in its preceding framed design. Restored that rounded cobalt/ivory card, its original gutters, overlaid navigation, and copyright beneath; the full-screen expansion is removed. GitHub and launch-video links remain removed, with no duplicate closing CTA.

## Hero and motion refinement — September 29

Reference lock: the user's annotated 4:31 PM screenshot specifies the extent of the lower canvas and a soft cloud border at the sky edge. Their black/silver metal-button reference still owns the waitlist colors and dimensions. Existing Open Swarm geometry and demo motion are the build target. Refero's bundled motion guidance supplies reduced-motion and interaction behavior; its live research previously returned NO_SUBSCRIPTION.

| Decision | Source | Implementation |
| --- | --- | --- |
| Reveal canvas down to the marked rectangle | Annotated screenshot | Remove the negative bottom crop, exposing roughly 80px more desktop canvas and its rounded glass bottom border. Keep the original scene dimensions, cameras and timelines. |
| Cloud border on the sides | Annotated scribbles and request to blend clouds | Extend the existing procedural cloud field into a billowing white cloud bank at the original hero edge; blend it into the page behind the projecting product window. |
| Agent marketplace labels | User's correction | Describe the listings as apps agents use within Open Swarm, preserving the cards and their capabilities/counts. |
| Metal flows continuously | User's explicit motion request and black/silver reference | Continuous silver-rim reflection plus face sheen, with no size/layout changes. Disabled buttons pause; reduced motion stops both loops. |
| Illustrated footer stays framed | User's explicit clarification | Restore the preceding illustrated card instead of the full-screen or plain footer. |

Validation: production build and targeted lint pass; desktop visual review confirms the extended product frame, soft cloud transition and framed scenic footer. At 320px and 390px, the compact waitlist, full canvas bottom border and footer navigation were visually checked. Continuous metal highlights were observed without hover; the reduced-motion CSS disables both loops. Temporary responsive QA page removed. HeroScene, AppsScene, BrowserScene and SwarmScene checksums match the unchanged scene sources.

## Microinteraction refinement and final user correction

The latest changes supersede the earlier literal-pixel benchmark and plain-footer trials. Smooth fluid benchmark bars, rolling values, independently entering menu items, measured dropdown height transitions, a phone header without its waitlist button, matte cloud contours and tighter intro spacing are now implemented. The existing cobalt/ivory coastal artwork is restored in a compact framed footer, with Open Swarm branding and Back to top. See `microinteraction-polish.md` for reference evidence and validation limits.
