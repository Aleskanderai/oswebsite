# Marketplace interaction polish

Reference lock: the existing four white marketplace cards remain the layout and typography target. The supplied `2158e0e4` PixelCanvas reference contributes only a small interactive shimmer behind the real app-icon stacks. The duplicate `3ae11146` reference needs no second implementation. The supplied GradientText contributes one flowing marketplace heading; it does not change the hero.

| Decision | Reference and role | Implementation |
| --- | --- | --- |
| Local pixel response | Supplied PixelCanvas icon demo; decorative interaction feedback | Confine the canvas to the top 82px of each card and soften its edges with a mask. |
| Different colors per app | User request for distinct product colors | Coral, blue, mint, and lavender particles; body copy stays unchanged. |
| Hover and keyboard parity | Refero motion and craft guidance | Activate from the parent card's hover or visible keyboard focus, with no extra tab stop. |
| Quiet offscreen and on touch scroll | User request to preserve usability and product demo motion | Pause when outside the viewport, the document is hidden or unfocused, or reduced motion is enabled. Ignore touch hover. |

The React canvas uses CSS-pixel coordinates independently of its device-pixel backing resolution. It cleans up observers, event listeners, and every animation frame. Existing card dimensions, descriptions, app assets, and stretched waitlist links remain intact.

Validation: targeted oxlint, TypeScript build, and the production Vite build pass. Vite retains the existing bundle-size warning. Final rendered hover, keyboard focus, and mobile checks are delegated to the root browser review; they have not been claimed from source inspection.
