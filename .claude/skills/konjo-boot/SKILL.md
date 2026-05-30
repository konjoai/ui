---
name: konjo-boot
description: Boot a Konjo session for ui — ui — shared design system for KonjoAI portfolio (React 19, TypeScript, Vite 8, Tailwind v4, motion, Vitest). Produces a Session Brief, runs Discovery, identifies the next sprint. Use at the start of any work session or when invoked with /konjo.
user-invocable: true
---

# Konjo Boot — ui

## Step 1 — Orient
Read CLAUDE.md, packages/ui/CLAUDE.md, README.md, CHANGELOG.md, docs/ in order.

## Step 2 — Session Brief
- Current version and component count
- Last shipped (from CHANGELOG.md)
- Active blockers
- Health: Green / Yellow / Red

## Step 3 — Discovery
- `npm run typecheck` — TypeScript clean?
- `npm run build` — build green?
- `npm test` — tests green?

## Step 4 — Plan
Identify the next sprint from the Sprint Plan in packages/ui/CLAUDE.md and propose the first concrete task.
