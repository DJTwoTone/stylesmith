# Code Explanations

Purpose: Human-friendly, low-friction docs mirroring `src/` so contributors understand intent, contracts, edge cases, and change risk.

## Structure
Each `src/<path>/<file>.ts[x]` has `docs/code-explanations/src/<path>/<file>.ts[x].md`.

Index of all explanation docs: see `docs/code-explanations/INDEX.md`.

## Required Sections
Minimum: Purpose, High-Level Role, Imports, Exports, Internal Elements (or Algorithm), Edge Cases, Change Risk, Future Ideas.

## Source Hash
First line after title includes: `<!-- source-hash: <sha256> -->`
Used by CI to detect drift between code and explanation. Update via:
```bash
npm run doc:hash:update
```

## Maintenance Workflow
1. Modify code.
2. If behavior / signature / intent changes: update corresponding doc section(s).
3. Run:
```bash
npm run doc:check
```
4. If hash mismatch due only to incidental changes, adjust doc & rebuild hash.

## Scripts
- `doc:stubs`: Create stubs for missing docs (won't overwrite existing).
- `doc:hash:update`: Recompute hash comments for all existing docs.
- `doc:check`: Fails if any doc missing OR hash mismatch OR missing required sections.

## CI Enforcement
`docs-coverage` workflow runs on push & PR. Blocks merge if coverage or hash out-of-date.

## Future Enhancements
- Link each doc to its primary test file(s).
- Add performance considerations section for modules exceeding thresholds.
- Auto-generate "Exports" table with signatures (planned ts-morph enhancement).
- Optional drift PR bot commenting summary of changes.
- Coverage badge (count of documented vs total) in main README.

## Authoring Guidelines
Keep docs concise; prefer bullet points over prose. Avoid duplicating logic—describe intent, invariants, and risks.

## Exclusions (currently none)
All `*.ts` / `*.tsx` under `src/` must be documented (except future generated `.d.ts`).
