---
paths: ["**/*.ts", "**/*.tsx"]
---
# TypeScript Conventions
- No `any` type — use `unknown` and narrow, or define a proper type
- `verbatimModuleSyntax` is on — type-only imports must use `import type`
- `erasableSyntaxOnly` is on — no enums, no parameter properties, no namespaces
- `tsc --noEmit` must be clean before every commit
- No `// @ts-ignore` without a justification comment
- Every exported function, component, and type must have a JSDoc comment
- All animated/interactive components must honor `prefers-reduced-motion`
- Every component must expose ARIA semantics where applicable
- `npm test` and `npm run build` must stay green
- No `console.log` in production code — use proper error boundaries
- Named exports over default exports for tree-shaking
