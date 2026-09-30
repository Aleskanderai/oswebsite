# New component reference review

## Scope and reference lock

All nine newly supplied attachment files were reviewed as component references. The latest product direction remains decisive: a smooth static hero, compact controls with restrained corners, no gift artwork, bubble fields or game-like referral tiles. The inline AntiMetal and Button1 references are a source for small action feedback, not permission to replace the page with their demos.

The design methodology is the previously applied Refero skill, using the user’s concrete references and its craft/motion guidance. The primary target is the current Open Swarm UI. A single action can borrow an accent-arrow interaction; the rest of the layout, typography and working signup flow stay consistent.

## Attachment inventory and decisions

| Attachment ID | Components reviewed | Useful detail and decision |
| --- | --- | --- |
| `3e1ec2fe-b0af-4a70-9cfa-8bffeb933463` | `OnboardingForm`; shadcn Button, Input and Avatar dependencies | A contained scenic image and calm content hierarchy inform the referral card’s narrow painted header using existing Open Swarm artwork. Do not add avatar upload, username collection, mock alerts or an account-creation step to the phone waitlist. Its demo motion does not justify animating the static hero sky. |
| `9a4b0fff-b7f9-4de2-a77b-d74912cb6490` | `EvervaultCard`, `CardPattern`, `Icon` | Local pointer feedback is useful in principle, but randomized code characters and a large radial glow would compete with the existing marketplace hover treatment. Do not add this effect or regenerate 1,500 characters on every pointer event. |
| `88a4bef4-d05c-4204-b45e-25bc3080641b` | `ParticleButton`, `SuccessParticles`; shadcn Button | Already adapted in the site’s `particle-button.tsx`: decorative particles appear only after a confirmed signup. Preserve that version’s deterministic trajectories, caller behavior and reduced-motion support rather than the demo’s click-only success simulation. |
| `01d6e5d3-0a98-4dbe-a651-6f63f53ecca1` | `PixelCanvas`, `PixelCanvasElement`, `Pixel` | Already adapted in the marketplace. The existing React version correctly distinguishes CSS size from device-pixel backing resolution and cleans up listeners/RAF. Keep the effect scoped to card hover/focus; the latest user-requested hero pixels are a separate faint cloud-only pointer effect, not this full grid. |
| `fdbb345c-041a-4d5d-a770-0d1cbfa3ae9d` | `WaitlistExperience`, local Input and Button | The clear confirmation message is relevant and already present. Do not import a Three.js animated full-screen background, invented countdown, invented social proof, unrelated “Mysh AI” branding, email collection or a console-only submit handler. No launch date has been confirmed. |
| `0ac42477-2e3a-4dcf-afad-59aa408231d9` | `LiquidCard`, `GlassFilter`, Card primitives | Thin depth cues may inform existing product frames. The full displacement filter, large glass demo and external image cards do not fit the newly restrained signup/share controls. Avoid repeated hard-coded SVG filter IDs and a Next.js dependency in this Vite application. |
| `9cd0558e-a01d-48d4-bc99-b23d08060804` | `LiquidButton`, `MetalButton`, Button variants and `GlassFilter` | The 44px control and subtle hover brightness fit the current black/silver hero CTA. Preserve the existing site-specific implementation rather than adding duplicate wrappers, `transition: all`, new touch state or handlers that overwrite consumer callbacks. |
| `75430f5e-c5b4-45a3-b447-1398ce66785f` | `QRCodeDisplay`; Card and Button dependencies | A QR code is an optional future cross-device sharing method, not needed for this compact referral card. The supplied component only displays an output image; its demo draws a placeholder pattern rather than encoding a valid QR code. Do not present that pattern as a functioning invite QR. |
| `cf645494-5366-4a0b-a5f9-10e6730e6223` | `QRCodeDisplay`; Card and Button dependencies | Identical to the prior QR attachment. No second implementation or new dependencies are needed. |

## Video-reference synthesis

The earlier frame-by-frame reviews remain in `microinteraction-reference-review-a.md` and `microinteraction-reference-review-b.md`.

- Fluid height changes apply to content that genuinely expands. They do not justify moving neighboring hero content on hover.
- The traveling navigation marker and spring-arrival examples keep motion local and return to a precise resting state. The new action’s accent panel follows that principle: only its reserved arrow area expands.
- Corner smoothing preserves the component’s footprint. Both new actions keep a 44px height and 9px corners.
- Contextual reveal suggests keeping the stronger action inside the share dialog, where it serves the immediate task.
- Independent child entrances can aid a short flow, but do not require a staggered animation on every control. The new buttons have no entrance animation or resting loop.

## Added reusable controls

`src/components/ui/anti-metal-button.tsx` exports named/default `AntiMetalButton` and `AntiMetalButtonProps`. It is a typed native button with forwarded ref, normal event/form attributes and `type="button"` by default. `accent` defaults to soft blue (`#d2e8f5`) and `accentForeground` to dark blue (`#19313e`). The arrow panel expands from 35px to 54px within an explicitly reserved area. It never crosses the label, so the label keeps high contrast throughout the transition. Three tiny decorative dots animate once on hover or keyboard focus and remain quiet at rest. Touch does not trigger a sticky hover animation. Disabled, reduced-motion and forced-color states are included.

`src/components/ui/button-1.tsx` exports named/default `Button1` and `Button1Props`. It is also a typed native button with forwarded ref and safe default type. It has a black face, small arrow movement and a low-intensity accent glow confined to the bottom edge on hover/focus. It has no hard-coded external destination, no uicat link and no continuous animation. Normal click/form behavior stays with the caller.

Both controls import their scoped rules from `accent-buttons.css`. They need no additional npm dependency.

## Placement recommendation

Use **one AntiMetalButton for the referral dialog’s main copy/share action**, if the integrated visual review confirms the accent fits. It offers a clear contextual interaction without making the referral progress playful. Keep the plain Share entry point, neutral dialog, actual progress and approved hero black/silver CTA. Do not repeat the accent action on every card or replace all links. Button1 is available as a quieter alternate component; it does not need a second prominent placement merely because it exists.

No existing WaitlistForm, WaitlistReferral, Hero, product motion or page layout was changed while creating these reusable controls.

## Project setup

The application already supports React, TypeScript, Tailwind CSS 4 and the shadcn project structure. `components.json` maps `@/components/ui` to `src/components/ui`, with shared styles in `src/index.css` and utility imports at `@/lib/utils`. This existing folder is the correct canonical UI location; a second root-level `/components/ui` directory would split the component library and break the established alias. No CLI setup or dependency installation is required.

## Validation

Targeted `oxlint` and `tsc -b --pretty false` pass for the new components. Integrated visual review belongs to their eventual usage; no unrelated demo was added to the live page.

## Integrated placements

The referral card now uses AntiMetalButton for confirmed invite sharing and Button1 for the pre-signup action; they are mutually exclusive states. The original black/silver hero button remains. A narrow scenic header borrows the onboarding reference’s composition without adding unrelated fields or gift imagery.
