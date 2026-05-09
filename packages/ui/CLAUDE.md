# @konjoai/ui

The shared design system for the KonjoAI portfolio. Lives at `packages/ui/` in the `konjoai/ui` monorepo (alongside `apps/web/` — the konjo.ai homepage). Five primitives, three motion curves, one brand shell — consumed by `vectro`, `squish`, `kyro`, `miru`, `kohaku`, `kairu`, `toki`, `squash`.

**v0.1.0** — Sprint 0 of the Konjo UI Initiative.

## Stack
React 19 · TypeScript ~6.0 · Vite 8 · Tailwind CSS v4 (`@theme` config) · motion (framer-motion successor) · Vitest 4

## Commands
```bash
npm install
npm run dev          # showcase at http://localhost:5173
npm test             # vitest run
npm run test:watch   # vitest watch mode
npm run build        # tsc -b && vite build
npm run typecheck    # tsc -b --noEmit
```

## Critical Constraints
- Tailwind v4 — config lives in CSS via `@theme` (no `tailwind.config.js`). Don't reintroduce one.
- All tokens declared once in [src/index.css](./src/index.css). `src/lib/tokens.ts` is a typed mirror, not a source of truth.
- All animated components must honor `useReducedMotion()` — accessibility is non-negotiable.
- `verbatimModuleSyntax` is on — type-only imports must use `import type`.
- `erasableSyntaxOnly` is on — no enums, no parameter properties, no namespaces.
- Every component exposes ARIA semantics (`role`, `aria-valuenow`, etc.) where applicable.
- `npm test` and `npm run build` must stay green.
- No `unwrap()`-style hacks; no silent fallbacks; no dead code.

## File Map
| Path | Role |
|------|------|
| `src/index.css` | Tokens (`@theme`) + utilities (`@utility`) + keyframes |
| `src/lib/tokens.ts` | Typed JS mirror of CSS tokens (rare imperative use) |
| `src/lib/motion.ts` | `ease`, `transition`, `variants` presets for `motion/react` |
| `src/lib/cn.ts` | Zero-dep classname joiner |
| `src/components/Dial.tsx` | Circular gauge |
| `src/components/TokenStream.tsx` | Streaming text with attention halos |
| `src/components/StagePipeline.tsx` | Multi-step process as a flowing river |
| `src/components/RiskRing.tsx` | Concentric arcs for nested risk |
| `src/components/KonjoApp.tsx` | Brand shell — wordmark, tagline, status, aurora |
| `src/App.tsx` | Showcase demo wiring all components |

## Tokens
Spectrum: `konjo-accent` (kyo cyan), `konjo-violet`, `konjo-warm`, `konjo-hot`, `konjo-good`, `konjo-cool`.
Surfaces: `konjo-bg`, `konjo-surface`, `konjo-surface-2`, `konjo-line`, `konjo-line-soft`.
Foreground: `konjo-fg`, `konjo-fg-muted`, `konjo-fg-faint`.

## Motion
Three named easings: `kanjo` (settle), `nehan` (decisive), `seishin` (steady pulse). Use the named presets from `lib/motion.ts` rather than raw curves so portfolio-wide tweaks land in one place.

## Sprint Plan (Konjo UI Initiative)
0. ✅ `@konjoai/ui` foundation (this repo)
1. squash — Compliance Bridge (calendar critical, EU AI Act 2026-08-02)
2. miru — Mind of the Machine (flagship)
3. kairu — Speed Cockpit
4. squish — Inference Cockpit
5. kyro — RAG Observatory
6. vectro — Quantization Forge
7. kohaku — Memory Garden
8. toki — Adversarial Arena
9. konjoai.com — Portfolio Constellation

Each flagship sprint depends on this package. Add components here when reuse appears across ≥2 repos; resist premature abstraction.

## When extending
- New component? Lives in `src/components/`, exported from `src/components/index.ts`.
- New token? Add to `@theme` in [src/index.css](./src/index.css), then mirror in [src/lib/tokens.ts](./src/lib/tokens.ts).
- New utility? Add as `@utility` in [src/index.css](./src/index.css).
- Always ship a Vitest test alongside.
