# Demo glass and application artwork

September 30, 2026.

The refinement follows the supplied sidebar and app-launcher screenshots: retain the existing scene layout and animation, give the navigation clearer separation from the twilight wallpaper, and use recognizable application artwork.

| Detail | Reference and implementation |
| --- | --- |
| Sidebar material | User request for slightly lighter glass. Replaced the nearly opaque mauve fill with a cool translucent surface, backdrop blur, a fine bright edge, and a restrained shadow. |
| Launcher surface | Existing Open Swarm panel hierarchy and [Apple's material guidance](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass). The panel remains dark enough for labels, with a lighter tint and one blur layer instead of two dark overlays. |
| Application identity | User's actual launcher screenshot and original installed application resources. Apple icons and Open Swarm app artwork are displayed with consistent optical bounds. Source details are in [app-assets.md](app-assets.md). |
| Small details | Stronger search-field contrast, consistent label baselines, subtle image shadows, and the same Daily Brief artwork in the launcher, sidebar, and window-to-icon animation. |
| Motion scope | The supplied [Gabriel profile](https://x.com/gabriell_lab), including its [native-menu feedback example](https://x.com/gabriell_lab/status/2104946256950813044), supports restrained, purposeful feedback. Existing timing, curved flight path, pointer targets, and scene cameras were retained. |

Refero's live searches returned `NO_SUBSCRIPTION`. Its bundled craft guidance and the supplied product references were used for the review. Higgsfield generated only the illustration for the demo-created Daily Brief app; official Apple and existing Open Swarm icons were sourced from the originals.

The sidebar retains its 56px width, 38px application slots, and 10px gaps. The hero retains its twelve-slot launcher and first-slot Daily Brief target. The smaller app-building scene retains its five existing slots and sixth-slot landing target. No new animation dependencies or interaction handlers were added.

## Verification

- Production TypeScript/Vite build passes; Vite retains its existing bundle-size advisory.
- Scoped lint reports only the existing animation and shared-export warnings.
- Safari visual checks cover the desktop launcher, the phone camera at 390px, and the smaller app-building scene.
- Both standard and WebKit-prefixed backdrop filters are supported. Opaque fallbacks preserve legibility without blur or when reduced transparency is requested.
- README screenshots now show the updated demo and original app artwork.

To inspect the frozen scenes locally:

```text
http://localhost:4310/?scene=hero&t=11.8&w=1280
http://localhost:4310/?scene=hero&t=11.8&w=390
http://localhost:4310/?scene=apps&t=9.6&w=520
```
