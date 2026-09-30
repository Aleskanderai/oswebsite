# Benchmark claims audit

## Finding

The repository contains no evaluation dataset, run output, reproducible harness, task definition, sample size, comparison system identity, or linked methodology supporting the former browser benchmark claims.

The former `Benchmarks.tsx` comment attributed the figures to a team video. README's existing “Before launch” checklist explicitly required confirmation of the figures and attribution. It also said that the approximately 40-second comparison was derived from “about 10x faster,” rather than supplied by the video. A draft assertion and arithmetic derived from it are not evidence of a measured comparison.

## Decision and removal

The numeric benchmark section and its dedicated presentation components have been removed. This cuts the 92%/68% accuracy comparison, 4-second/approximately 40-second timing comparison, 0%/12% false-positive comparison, unnamed “Previous best” rows, “Best-in-class browser use” headline, and unsupported team-testing source note.

No substitute metrics are introduced. The existing Capabilities section already shows the BrowserScene and explains browsing in parallel, so a second browser feature block would repeat content without adding product evidence. App integration removes the section and one adjacent divider; navigation and footer remove benchmark links.

BrowserScene and HeroScene source files are unchanged. Their illustrative product timelines are not comparative evaluation results.

## References outside the removed section

- `src/App.tsx`: former benchmark import/render and page-order comment.
- `src/components/Nav.tsx`: former “Benchmarks / How the agents score” item.
- `src/components/Closing.tsx`: former Benchmarks anchor.
- `README.md`: old component map, color guidance, and unconfirmed benchmark checklist item.
- Historical design/QA notes in `docs/benchmark-assets-pass.md`, `docs/microinteraction-polish.md`, `docs/waitlist-design.md`, `docs/component-enhancement-pass.md`, and the two reference-review documents describe prior iterations. This audit supersedes their benchmark status.

The Research use-case demo's references to research papers and web benchmarks are illustrative subject matter, not claims about Open Swarm's performance; they are outside this removal. The “10,000+ integrations” capability claim is also outside the benchmark section and remains marked for confirmation in README.

## Reintroduction requirement

A future comparative section should link a named evaluation, date/version, task sample, success definition, comparison system, and reproducible result or report. Until that exists, publish capability descriptions and product demonstrations without comparative percentages or speeds.

## Number ticker

The user-supplied spring counter pattern is implemented as `src/components/ui/number-ticker.tsx` with the existing `motion/react` dependency. It supports value, direction, delay, decimalPlaces, and className; starts on first entry into view; cancels delayed work and animation on cleanup; renders the final value immediately under reduced motion; and keeps the accessible final value separate from decorative changing digits. Overlaid invisible endpoint text reserves width and tabular numerals prevent layout shifts.

The hero's user-confirmed waitlist count is a suitable use for this component. Removing unverified benchmark figures does not affect that independently supplied count.
