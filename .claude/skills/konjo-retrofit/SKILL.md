---
name: konjo-retrofit
description: Retrofit the Konjo Quality Framework onto an existing repo. Use when asked to add konjo quality gates, audit an existing codebase, or run a quality sprint.
user-invocable: true
---

# Konjo Retrofit Protocol (TypeScript)

1. Baseline Audit — measure everything, fix nothing yet
2. Triage — P0 critical, P1 debt, P2 style
3. Install at current baseline
4. Enable TypeScript strict mode incrementally
5. Complexity ratchet: one component at a time
6. DRY cleanup: highest similarity first
7. Wall 3: soft-fail week 1, blocking week 2

## TypeScript Checklist (ui)
- [ ] `npm run typecheck` clean
- [ ] `npm run build` green
- [ ] `npm test` green
- [ ] No `any` types
- [ ] No `console.log` in production
- [ ] All exported APIs have JSDoc
- [ ] All animated components honor `prefers-reduced-motion`
- [ ] All components expose ARIA semantics
