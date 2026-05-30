# konjoai/ui

Shared design system and portfolio homepage for KonjoAI. Monorepo structure:
- `packages/ui/` — `@konjoai/ui` design system (React 19, TypeScript, Tailwind v4, motion)
- `apps/web/` — konjo.ai homepage

See `packages/ui/CLAUDE.md` for the full design system specification.

## Konjo Quality Framework

Three walls against AI slop — all enforced by CI.

**Wall 1 — Pre-commit** (`bash .konjo/scripts/install-hooks.sh`):
DRY check, TODO scan, file size. Blocks the commit.

**Wall 2 — CI gate** (`.github/workflows/konjo-gate.yml`):
TypeScript type check, build, tests, file ≤ 500L, DRY. Blocks the merge.

**Wall 3 — Adversarial review** (local only — disabled in CI):
`git diff HEAD~1 | python3 .konjo/scripts/konjo_review.py`

See `KONJO_QUALITY_FRAMEWORK.md` for the full specification.

## Skills
See `.claude/skills/` — auto-loaded when relevant.
Run `/konjo` to boot a full session (Brief + Discovery + Plan).
