# Changelog

All notable changes to `@konjoai/ui` are recorded here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning is [SemVer](https://semver.org/).

## [0.1.0] — 2026-05-06

### Added — Sprint 0: Foundation

The shared design system for the KonjoAI portfolio. First slice — lean by design.

- **Repository scaffold** — Vite 8 + React 19 + TypeScript ~6.0 + Tailwind v4 (`@theme` config) + Vitest 4 + motion 12.
- **Design tokens** in `src/index.css` via Tailwind v4's `@theme` block — spectrum (accent, violet, warm, hot, good, cool), surfaces, foreground tiers, three named motion easings, four radii, and three font stacks.
- **Konjo utilities** — `glass-konjo`, `aurora-konjo` + `aurora-konjo-bg`, `shadow-konjo-glow`, `scanlines-konjo`, `konjo-pulse`, `text-konjo-display`, `text-konjo-mono`.
- **Five primitive components**:
  - `<KonjoApp>` — brand shell with wordmark, tagline, status pill, aurora background.
  - `<Dial>` — circular gauge with animated arc + glow halo, ARIA `role="meter"`.
  - `<TokenStream>` — streaming text with per-token color and attention-weight halo, optional blinking caret, auto-scroll, `onTokenAppear` callback.
  - `<StagePipeline>` — horizontal/vertical flow of stages with `pending | active | done | error` states; pulsing active node, glowing connector that fills as stages complete.
  - `<RiskRing>` — concentric arcs for nested risk metrics, with severity-tinted glow and an inline legend.
- **Motion presets** — `ease.kanjo` (settle), `ease.nehan` (decisive), `ease.seishin` (steady pulse); reusable `transition` and `variants` exports for `motion/react`.
- **Showcase page** in `src/App.tsx` wiring all five primitives together with live data (animated pipeline, streaming reasoning tokens).
- **Tests** — 25 Vitest cases across all components and the `cn` utility; full ARIA + behavioral coverage. All green.
- **Docs** — README, CLAUDE.md (operating rules), this changelog.

### Notes

- This is **Sprint 0** of the 10-sprint Konjo UI Initiative. Sprints 1–9 build flagship UIs on top of this package: squash → miru → kairu → squish → kyro → vectro → kohaku → toki → konjoai.com.
- Tailwind v4's CSS-only config means there is no `tailwind.config.js`. Tokens live in [src/index.css](./src/index.css).
- All components honor `prefers-reduced-motion`.
