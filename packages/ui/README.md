# @konjoai/ui

The shared visual language for the **KonjoAI portfolio** — `vectro · squish · kyro · miru · kohaku · kairu · toki · squash`.

> ቆንጆ — beauty &nbsp;·&nbsp; 根性 — fighting spirit &nbsp;·&nbsp; 康宙 — system health &nbsp;·&nbsp; 건조 — strip to essence

Eight apps. One soul.

## What this is

A small, opinionated React design system that any KonjoAI app can drop in to look and feel Konjo. It ships:

- **Design tokens** — color, typography, motion easings, radii, glass / aurora primitives
- **Five primitives** — `<KonjoApp>`, `<Dial>`, `<TokenStream>`, `<StagePipeline>`, `<RiskRing>`
- **Three motion curves** — `kanjo` (settle), `nehan` (decisive), `seishin` (steady pulse)
- **One brand shell** — wordmark, status pill, aurora background

Every component is dark-mode-native, motion-reduced-accessible, and written for `motion/react` (Framer Motion's successor).

## Stack

`React 19` · `TypeScript` · `Vite 8` · `Tailwind CSS v4` · `motion` · `Vitest`

## Quick start

```bash
npm install
npm run dev       # showcase at http://localhost:5173
npm test          # vitest (25 tests)
npm run build     # production build
```

## Using it in a sibling repo

```ts
import "@konjoai/ui/styles";          // injects @theme + utilities
import { KonjoApp, Dial, TokenStream, StagePipeline, RiskRing } from "@konjoai/ui";

export default function App() {
  return (
    <KonjoApp product="miru" tagline="The mind of the machine"
              status={{ label: "streaming" }}>
      <Dial value={94} unit="%" label="Confidence" severity="ok" />
    </KonjoApp>
  );
}
```

## Components

| Component        | Used by                                                    | What it does |
|------------------|------------------------------------------------------------|--------------|
| `<KonjoApp>`     | every flagship                                             | Brand shell — wordmark, tagline, status pill, aurora background |
| `<Dial>`         | vectro, kairu, squish, toki                                | Circular gauge for any min..max metric |
| `<TokenStream>`  | miru, squish, kairu, kyro, toki                            | Streaming text with per-token color + attention-weight halo |
| `<StagePipeline>`| kyro, vectro, squash, kairu, squish                        | Multi-step process as a flowing river |
| `<RiskRing>`     | squash                                                     | Concentric arcs for nested risk metrics (EU AI Act / NIST / OWASP) |

## Design tokens

All tokens are declared once, in CSS, via Tailwind v4's `@theme` block. The
`src/lib/tokens.ts` module is a typed mirror for the rare cases JS needs the
raw values (Three.js uniforms, regl color attributes, imperative SVG).

**Spectrum:** `accent` (kyo cyan) · `violet` (konjo purple) · `warm` · `hot` · `good` · `cool`
**Surface:** `bg` · `surface` · `surface-2` · `line` · `line-soft`
**Foreground:** `fg` · `fg-muted` · `fg-faint`

## Motion

Three named easings define the portfolio's movement:

- **`kanjo`** — `cubic-bezier(0.16, 1, 0.3, 1)` — smooth settle. State transitions.
- **`nehan`** — `cubic-bezier(0.4, 0, 0.2, 1)` — quick decisive. Affordance feedback.
- **`seishin`** — `cubic-bezier(0.65, 0, 0.35, 1)` — steady spirit. Looping pulses.

All components honor `prefers-reduced-motion`.

## Project status

**v0.1.0 · Sprint 0 of the Konjo UI Initiative.**

This is the foundation. Every flagship in the portfolio (squash Compliance Bridge, miru Mind-of-the-Machine, kairu Speed Cockpit, …) builds on top of these primitives.

See [`CHANGELOG.md`](./CHANGELOG.md) for the version history and [`CLAUDE.md`](./CLAUDE.md) for the operating rules.
