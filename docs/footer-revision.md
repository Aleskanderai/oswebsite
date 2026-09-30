# Footer revision

## Reference lock

- Primary: the user's cobalt-and-ivory Mediterranean footer reference, with navigation directly over an illustrated cloudy sky.
- Preserve: one footer; blue monochrome ink; textured ivory paper; full-height coastal artwork; a grand domed building and cliff at right; small boat and open sea at left.
- Reject: multicolored buildings, an empty beige upper panel, a separate landscape strip, invented links.
- Layout: the illustrated footer is restored as a compact centered framed card, with a 1240px maximum width, rounded 22px corners and navigation over the cloudy sky. Desktop has a 480px minimum height; mobile and tablet have a 600px minimum. Desktop artwork is cropped at 24% vertically to retain the coast, cathedral and small boat. Portrait cropping on phones keeps the cathedral, with a translucent upper wash for legible navigation. Copyright and Back to top sit inside the bottom of the scene over a subtle dark wash.
- Links: retained real in-page product anchors, Discord, X, Privacy and Terms. Removed every GitHub-bound footer link and the incorrect launch-video link. No launch-video placeholder was added.

## Asset

- Tool: built-in image generation.
- Saved: `public/media/footer-cobalt-coast.webp`.
- Size: 1612 × 976 pixels; WebP quality 91; 654,746 bytes.
- Source PNG retained at `/Users/alexdakhli/.codex/generated_images/01a0ef5d-9d22-7b50-b7ea-761407dc58ff/exec-e29391e9-989f-4f7c-8ace-7983677b4799.png`.
- The previous footer asset remains available; the component now references the new version.

## Final generation prompt

Use case: illustration-story.
Asset type: full-bleed website footer background, landscape aspect ratio 1.65:1, high resolution.
Primary request: an original richly detailed Mediterranean coastal engraving on warm ivory paper, printed entirely in cobalt blue ink and pale blue washes. A grand domed cathedral with a narrow bell tower rises over a picturesque village and rocky sea cliff in the lower-right; a deep-blue spreading tree enters from the upper-right edge; calm rippling sea stretches across the lower-left and center, with one tiny traditional sailboat on the left and low distant mountain coast at the horizon. Billowing layered ivory and very pale blue engraved clouds fill the entire upper half; visible paper grain and delicate antique etching linework throughout.
Composition: the lower 55 percent contains the scenic architecture, cliff, distant hills and sea. The grand domed building begins around 45 percent down on the right, occupying the rightmost third. The entire top 40 percent must be pale illustrated textured sky for readable website navigation overlay, with clouds and paper grain, NOT a blank beige rectangle and NOT an empty flat margin. The dark tree may reach into only the far upper-right corner. Architecture and scenery must extend to the edges for an immersive full-bleed composition. Use a wide eye-level coastal view, abundant cloud detail and atmospheric depth.
Style: fine antique copperplate engraving plus pale watercolor washes, blue and white porcelain landscape quality, polished editorial illustration.
Color palette: cobalt, Prussian blue, faded pale blue, ivory paper ONLY. No green, turquoise, orange, pink, yellow buildings or multicolor landscape.
Text: none. No typography, no logos, no watermark, no UI, no rounded frame, no screenshot, no page layout. The output is exclusively the artwork, suitable as a full footer background.
Avoid: photographic look, cartoon style, flat vector shapes, a thin panoramic strip, empty beige upper half, center-aligned cathedral, extra foreground objects.

## Validation

- Artwork inspected: cobalt/ivory only, textured sky, detailed domed building, sea/boat, no generated text.
- Component lint passes.
- Final desktop/mobile integration review is performed by the parent agent.

## Latest clarification: restore the framed illustrated footer

The user clarified that “revert” meant reverting only the full-screen/full-bleed expansion, not removing the designed footer. The latest correction explicitly rejects the plain neutral footer and restores the cobalt-and-ivory artwork while keeping the footer smaller. The current version is a framed 480px desktop / 600px mobile scenic card, with navigation over the sky, Open Swarm branding and the existing short tagline, X/Discord icons, copyright and Back to top. Current links remain, excluding GitHub and the incorrect launch video. There is still one footer; the previously removed duplicate blue closing CTA stays removed. Hero and canvas changes are independent of this restoration.
