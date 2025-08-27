# src/domain/tokens/derived.ts
<!-- source-hash: 66eaac6ae06bbffc1d29bfeb548a0e61380a74cdfcee0e02a52d66b1e815ce01 -->

## Purpose
Expose virtual (derived) token entries—currently modular type scale font-size tokens—and aggregate a unified list of physical + virtual tokens deterministically.

## High-Level Role
- Bridges typography scale outputs to token consumers without persisting duplicate data.
- Supplies a single sorted list (`listAllTokenEntries`) for hashing, export previews, or UI tables.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| generateTypeScale | `../typography/scale` | Produce scale steps for virtual font sizes. |
| Project (type) | `../../state/store` | Access project token structures. |

## Exports
- Types: `VirtualTokenEntry`, `AllTokenEntry`.
- Functions: `getFontSizeVirtualTokens`, `listAllTokenEntries`.

## Key Functions
### getFontSizeVirtualTokens(project)
Defensively reads `project.typography.scaleConfig`; falls back to defaults (16px base, 1.25 ratio) if absent (supports legacy states). Returns array of `{ name, value (rem), px }` entries.

### listAllTokenEntries(project)
Collects physical token categories (colors, spacing, radii, shadows) then appends virtual font size tokens. Final array is sorted by `category` then `name` (lexicographic) ensuring stable ordering.

## Determinism Strategy
- Category collection order explicit.
- Final sort comparator stable; ties only if identical category & name (impossible duplicates avoided).

## Edge Cases
- Missing typography slice: uses default base & ratio; still deterministic.
- Empty token categories: simply contributes zero entries.

## Change Risk
Low/Medium: Adding new virtual token families requires ensuring comparator remains stable and categories have predictable naming patterns.

## Future Ideas
- Derived aliases (e.g., `spacing-multiplier-*`).
- Themed/dark variant overlays included with `virtual: true` metadata.
- Caching layer keyed by shallow hash of contributing inputs.
