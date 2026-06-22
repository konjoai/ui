# Changelog

All notable changes to `@konjoai/ui` are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.3.0] — 2026-06-22

### Added — Sprint 0.6: Portfolio Shell

Five components extracted from the `apps/web` build-out. Each clears the
shared-use bar — used by the marketing site and reusable across consumer
dashboards — so they live in `@konjoai/ui` rather than the app.

**`Nav`** — top navigation bar for the marketing site.
- Brand wordmark + inline links + optional grouped product menu + right-side actions
- Native `<details>`/`<summary>` for the product menu and mobile drawer — fully server-renderable, works without JavaScript (no `useState`, no `"use client"`)
- `aria-label="Primary"` nav landmark; product and mobile menus expose labelled summaries
- Responsive: inline links collapse into a mobile drawer below `sm`

**`ProductHero`** — top-of-page header for every product page.
- Oversized brand glyph, gradient title, tagline, optional version + status pills, and a CTA row
- Server-renderable (no hooks); designed to sit inside the `aurora-konjo` shell so the background lights through
- Consumers: every product page on konjo.ai

**`FeatureCard`** — one tile in a 2–3 column feature grid.
- Brand-accent glyph + optional eyebrow + title + description
- Subtle hover lift with a violet top-edge glow, mirroring the homepage project card treatment
- Server-renderable (no hooks)

**`MetricCard`** — single-value stat card for any scalar metric.
- Severity-tinted value, optional unit suffix, signed delta with arrow and context label
- `kanjo` entrance animation, honoring `useReducedMotion()`
- `role="status"` with a composed `aria-label` (label, value, delta)
- Consumers: squash (compliance %), kairu (latency / tok/s), squish (TTFT), kyro (NDCG/MRR), vectro (recall@k), miru (attention)

**`StatusBadge`** — small pill summarizing a service's health.
- Five levels: operational / degraded / outage / research / checking
- Optional last-checked timestamp (formatted UTC) and a pulsing dot for live checks
- `role="status"` with a descriptive `aria-label`; pulse honors `prefers-reduced-motion` via CSS (`motion-reduce:animate-none`)
- Consumers: the `/status` page and inline "live" indicators

### Changed

- `packages/ui/package.json`: version → 0.3.0
- `src/components/index.ts`: all five components and their types exported
- `src/App.tsx`: showcase status badge → v0.3.0, label → sprint 0.6
- `packages/ui/CLAUDE.md`: File Map updated with the five components; version label → v0.3.0

---

## [0.2.0] — 2026-05-19

### Added — Sprint 0.5: Design System Completion

Four new shared components that clear the ≥2-consumer rule and unblock
the full portfolio sprint sequence before any consumer wires up a frontend.

**`StatusMatrix`** — pass/fail/warn grid for compliance and quality dashboards.
- Rows × columns of `CellStatus` cells (pass / fail / warn / skip / pending)
- ARIA table semantics (`role="table"`, `role="row"`, `role="cell"`, `role="columnheader"`)
- Optional column headers with alignment spacer
- Summary footer with per-status counts
- Staggered row entrance via `kanjo` easing
- Consumers: squash (EU AI Act article checks), toki (attack vs. defence matrix)

**`TimeSeriesChart`** — rolling sparkline for live metric streams.
- SVG path with `pathLength` draw-in animation via `kanjo`
- Gradient area fill, y-axis guide lines, latest-value dot with glow
- `useId()` for unique per-instance SVG gradient IDs (multi-instance safe)
- `role="img"` with descriptive `aria-label` including label and latest value
- No-data placeholder for < 2 points
- Consumers: kairu (tok/s over time), squish (throughput), toki (loss curves)

**`ComparisonBar`** — horizontal benchmark bars with optional baseline marker.
- `scaleX` fill animation from left via `kanjo`; staggered row entrance
- Ghost baseline marker (faint vertical rule) when `baseline` is provided
- Auto-severity from value vs. baseline ratio; `higherIsBetter` flag
- `role="meter"` ARIA per bar with `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
- Consumers: vectro (recall@k vs. fp32), kairu (draft vs. AR), squash (score vs. threshold)

**`RankList`** — scored, ranked list with relevance score bars.
- Rank badge (severity-tinted circle), label + sublabel, score readout + bar
- Score bar fills from left via `kanjo`; items stagger in on mount
- Auto-severity from score / maxScore ratio
- `role="list"` + per-item `aria-label` including rank, label, and score
- Consumers: kyro (retrieval NDCG/MRR), miru (reasoning steps by attention)

### Changed

- `App.tsx`: four new showcase sections for the added components
- `App.tsx`: sprint label updated to `sprint 0.5`, status badge to `v0.2.0`
- `src/components/index.ts`: all four components and their types exported

---

## [0.1.0] — 2026-05-07

### Added — Sprint 0: Foundation

Initial release of `@konjoai/ui`. Establishes the shared visual language for the
KonjoAI portfolio (vectro · squish · kyro · miru · kohaku · kairu · toki · squash).

**Components (5):** `Dial`, `TokenStream`, `StagePipeline`, `RiskRing`, `KonjoApp`

**Design tokens:** 6 spectrum colors (`konjo-accent`, `konjo-violet`, `konjo-warm`,
`konjo-hot`, `konjo-good`, `konjo-cool`), 3 surface levels, 3 foreground tiers,
4 radii — all declared in `src/index.css @theme`; mirrored in `src/lib/tokens.ts`.

**Motion:** Three named easings — `kanjo` (settle), `nehan` (decisive), `seishin`
(steady pulse) — with `transition` and `variants` presets in `src/lib/motion.ts`.

**Utilities:** `glass-konjo`, `aurora-konjo`, `shadow-konjo-glow`, `scanlines-konjo`,
`konjo-pulse`, `text-konjo-display`, `text-konjo-mono`.

**Infrastructure:** React 19 · TypeScript ~6.0 · Vite 8 · Tailwind v4 · motion 12 ·
Vitest 4 · pnpm monorepo alongside `apps/web` (Next.js 15).
