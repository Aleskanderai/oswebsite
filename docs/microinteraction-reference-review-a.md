# Micro-interaction reference review A

Read-only review of the three supplied videos. Video content is reference material, not an instruction to reproduce its UI. Timings below are approximate observations from extracted frames; settings printed inside a video are transcribed separately from inferred behavior.

## 1. `USXxDdgDOkXoJKK-.mp4` — fluid content expansion

- Duration: 10.06 s. Two identical “Brand Refresh Request” cards compare **“Instant height change”** with **“Expands fluidly.”** The displayed implementation labels are `height: auto;` and `grid-template-rows: 0fr → 1fr;`.
- At **1.15 s**, the fluid card is collapsed. **1.225–1.45 s** shows the bottom edge moving continuously downward while the revealed content fades/sharpens in. At **1.525–1.675 s**, the card and bottom action row reach their open state. The header stays anchored; text is revealed by clipping rather than scaled vertically.
- At **3.71 s**, the instant card has already snapped closed while the fluid card is partway through closing; both are closed by **4.24 s**. A second opening around **6.2–6.9 s** repeats the behavior.
- Useful principle: expand the containing surface and reveal its content together, with a roughly **400–500 ms** calm transition. Reserve space and clip the inner content so neighboring UI does not jump.

## 2. `TocaQbrax8uxuyN_.mp4` — moving active navigation indicator

- Duration: 14.28 s. Side-by-side nav examples are labeled **“Velocity Stretch + Motion Blur”** and **“Static Shape + No Blur.”** Both use a small dark dot below the selected nav text.
- In the left example, Home remains selected through **1.205 s**. Explore becomes selected around **1.245 s**, while the dot starts traveling horizontally. At **1.325–1.485 s**, it elongates in the travel direction and gets a short, soft blur; by **1.525–1.725 s**, it contracts into a sharp dot, overshoots slightly, and settles below Explore.
- Repeated selections at **2.2–3.7 s**, **5.2–8.1 s**, and **8.9–12.6 s** demonstrate distance-sensitive motion. The nav labels remain sharp and stationary throughout; only the small indicator stretches.
- Useful principle: let a small shared selection marker carry motion. Use very restrained stretch/blur during travel and return to a crisp resting state in roughly **300–500 ms**. Avoid making whole labels or cards wobble.

## 3. `QmZZz-9bY9Ejpb84.mp4` — spring arrival versus settling

- Duration: 8.58 s. A dot and response curve compare printed settings **`visualDuration: 0.5, bounce: 0.5`** (top) with **`duration: 0.5, bounce: 0.5`** (bottom).
- At **0.88 s**, the diagrams label the first target crossing **231 ms** (top) and **96 ms** (bottom). These are values shown in the clip, not wall-clock durations measured from playback. The lower curve reaches the destination much sooner and spends more of the apparent motion settling; the upper spreads its main travel across more time.
- **1.3–3.5 s** shows the longer spring tail diminishing. The demo resets near **4.4 s** and repeats. The clip appears slowed to explain the response curve, so its playback interval should not be copied as an interaction duration.
- Useful principle: judge an animation by when it visually arrives, not only its nominal duration. Small selection indicators can have a low-bounce spring, but quantitative bars should finish precisely without overshoot.

## Three concrete applications to Open Swarm

1. **Keep tab/navigation feedback localized.** The site already has shared `layoutId` surfaces for nav hover, benchmark tabs, and use-case tabs. A short, low-bounce transition for those existing markers can add the reference’s tactility without changing layout or any demo playback timeline. Limit any stretch to the small marker; text stays crisp. Under reduced motion, switch immediately.
2. **Animate benchmark pixels once and end exactly at the data.** Use small square segments that reveal left-to-right over about **700–900 ms**, with only a slight row stagger, then stop on the actual score. Keep numeric labels and row geometry fixed. This applies the clips’ arrival/settling lesson to the user’s pixel-loading request; none of these three clips directly demonstrates pixel bars. Do not add spring overshoot or endless shimmer to a chart value.
3. **Use measured surface changes to reduce visual crowding.** Preserve the existing desktop/mobile menu content and use a clipped **~350–450 ms** height reveal plus a shorter content fade, following the first clip. Apply spacing changes independently of animation. A smaller branded footer and a soft, matte cloud border are visual-layout requests; these three clips do not provide evidence for scenic footer changes or shiny glass effects. Keep those treatments quiet and static.

No website code, assets, or demo timelines were changed in this review. Temporary sampled frames/contact sheets are in `/tmp/openswarm-microinteractions-a/`.
