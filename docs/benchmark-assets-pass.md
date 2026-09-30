# Benchmark asset polish

Reference lock: preserve the existing Open Swarm benchmark layout, centered statistics and tabs, quantitative bar widths, and the smooth color trails already adapted from the supplied Gabriel interaction videos. The user's latest correction asks for a more recognizable real browser asset and more character, without replacing the section.

| Decision | Source and role |
| --- | --- |
| Compose a small browser-window emblem using the published Chrome SVG and existing Open Swarm mascot | User's real-asset request; existing app-integration assets. Chrome identifies a browser, not the unnamed benchmark competitor. |
| Use a restrained pearl frame, tiny toolbar and offset mascot badge | Existing Open Swarm glass window styling. These are code-native interface primitives around untouched artwork. |
| Give each chart row a clear 32px identity tile | Refero icon guidance for marketing assets and optical consistency. Mascot identifies Open Swarm; neutral Fluent Content View identifies the unnamed previous best. |
| Keep motion localized in the existing bar and tab interactions | Supplied Gabriel microinteraction videos and previous reference review. No new looping illustration animation. |
| Keep all numbers, timing constants, colored flecks and chart math | Explicit scope restriction; visual polish must not change what the comparison communicates. |

Artwork and upstream licenses remain in `docs/icon-sources.md` and `public/media/icons/`. No new asset download or modification is needed.

Implementation uses `Benchmarks.tsx`, the identity markup in `AnimatedBenchmark.tsx`, and narrowly scoped classes in `AnimatedBenchmark.css`. Desktop and phone geometry retain the existing row stacking and centered controls.

Validation: TypeScript and targeted lint pass. The changes are presentational only: the existing `Count` behavior, benchmark values, fill ratios, `FILL_DURATION`, `FINISH`, flecks, row entrance transitions, and tab selection transitions are unchanged. The 32px badges fit the existing 180px desktop label column and preserve the stacked phone bar layout. Combined browser review is handled with the hero/referral pass.
