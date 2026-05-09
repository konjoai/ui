# konjoai-ui

The KonjoAI design system and portfolio site, in one monorepo.

```
konjoai-ui/
├── packages/
│   └── ui/         # @konjoai/ui — shared React component library
└── apps/
    └── web/        # @konjoai/web — konjo.ai portfolio homepage (Next.js 15)
```

## Stack

- **packages/ui** — React 19 · TypeScript ~6.0 · Vite 8 · Tailwind v4 (`@theme`) · motion · Vitest 4
- **apps/web** — Next.js 15 (App Router) · React 19 · Tailwind v4 · motion
- **monorepo** — pnpm workspaces

## Getting started

```bash
pnpm install
pnpm dev          # apps/web at http://localhost:3030
pnpm dev:ui       # packages/ui showcase at http://localhost:5173
pnpm build        # build both
pnpm test         # run tests
pnpm typecheck
```

## Workspace layout

| Path                | Package         | Role                                         |
| ------------------- | --------------- | -------------------------------------------- |
| `packages/ui`       | `@konjoai/ui`   | Tokens, components, motion presets — Tailwind v4 single source of truth for the portfolio. |
| `apps/web`          | `@konjoai/web`  | konjo.ai homepage. Deploys to Vercel.        |

## Konjo

KONJO — Know, Outline, Nail, Justify, Optimize.
ቆንጆ (beauty) · 根性 (fighting spirit) · 康宙 (system health) · 건조 (strip to essence)

## Sprint plan

0. ✅ `@konjoai/ui` foundation
1. squash — Compliance Bridge (EU AI Act 2026-08-02)
2. miru — Mind of the Machine (flagship)
3. kairu — Speed Cockpit
4. squish — Inference Cockpit
5. kyro — RAG Observatory
6. vectro — Quantization Forge
7. kohaku — Memory Garden
8. toki — Adversarial Arena
9. konjoai.com — Portfolio Constellation (this `apps/web`)

## Consumers

`@konjoai/ui` is consumed by these portfolio repos via `file:../../konjoai-ui/packages/ui`:

squash · squish · vectro · kyro · kairu · miru · toki · kohaku
