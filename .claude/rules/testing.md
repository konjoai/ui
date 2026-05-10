---
paths: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"]
---
# Testing Rules
Every component needs a corresponding Vitest test.
Ship a Vitest test alongside every new component.
`npm test` must be green before `git push`.
Test observable behavior, not implementation details.
