---
name: konjo-quality
description: Konjo Code Quality Framework — Three-Wall framework to prevent AI slop. Auto-load when writing tests, reviewing code quality, refactoring, or on quality gate failures.
user-invocable: true
---

# Konjo Quality Framework — Agent Reference (TypeScript)

## The Three Walls

| Wall | When | Blocks |
|------|------|--------|
| Wall 1 | Pre-commit | The commit |
| Wall 2 | CI / GitHub Actions | The merge |
| Wall 3 | Claude Opus review | The merge |

## Thresholds

| Metric | Hard Block | Target |
|--------|-----------|--------|
| TypeScript check | clean | clean |
| Build | green | green |
| Tests | green | green |
| File length | ≤ 500L | ≤ 300L |
| DRY violations | 0 | 0 |
| `any` types | 0 | 0 |

## Zero-Tolerance Rules
- No `any` type
- No `// @ts-ignore` without justification
- No `console.log` in production code
- Every exported symbol must have a JSDoc comment
- All animated components must honor `prefers-reduced-motion`
- Named exports over default exports

## Running Locally
```bash
npm run typecheck
npm run build
npm test
python3 .konjo/scripts/dry_check.py --staged-only
git diff HEAD~1 | python3 .konjo/scripts/konjo_review.py
```
