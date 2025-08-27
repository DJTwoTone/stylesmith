# src/state/store.ts
<!-- source-hash: 874732eb9b63987b5d7e38fb31b15fb22bc50735ffefd892c1199c332a798e2a -->

## Purpose
Zustand store managing single project, token CRUD (add/update/delete/rename/batch), typography scale + headings, and prefix groundwork.

## High-Level Role
- Define token categories + validators.
- Create project (initial scale + headings map).
- Add/update/delete/rename tokens; batch add.
- Update modular type scale & regenerate headings map.
- Set headings map with validation.
- Set namespace prefix (future utility prefix application).
- Provide deterministic token listing.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| create | zustand | Store factory. |
| nanoid | nanoid | Unique project id. |
| validation fns | ../domain/tokens/validation | Token name/value validation. |
| typography fns | ../domain/typography/scale | Type scale + headings utilities. |

## Exports
- Types: `TokenCategories`, `TokensState`, `ProjectMeta`, `Project`, `StoreState`.
- Constants: `tokenValueValidators` (legacy placeholder).
- Hook: `useStore`.
- Helper: `listTokens`.
- (Internal) `validateToken` not exported.

## Internal Elements
Internal `validateToken` wraps domain validation for name/value per category.

## Actions
- `createProject(name)`
- `addToken(category,name,value)`
- `updateToken(category,name,value)`
- `renameToken(category,oldName,newName)`
- `batchAddTokens(category, entries)` (all-or-nothing)
- `deleteToken(category,name)`
- `updateTypeScale(partial)` (regenerates headings map deterministically)
- `setHeadingsMap(map)` (validates references)
- `setPrefix(prefix)`

Each mutation immutably clones and stamps `updatedAt`.

## Validation
Delegates to shared domain validators; duplicates & existence handled in store.

## Edge Cases
No-op if project null. Batch add aborts on first validation aggregate failure.

## Change Risk
Medium (central API consumers depend on data shape).

## Future Ideas
- Persistence layer (WP-14).
- Migration handling (WP-15).
- Utilities prefix application integration (WP-21).
- Contrast-driven validation enrichment (WP-03).
