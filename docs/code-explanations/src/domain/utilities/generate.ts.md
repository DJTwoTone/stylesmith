# src/domain/utilities/generate.ts
<!-- source-hash: f2146bc8b38c491ad15f313884dd8acc9ce5c96cf13bb490c997c0d5fce3b9f8 -->

## Purpose
Generate CSS utility class segments deterministically from project tokens.

## High-Level Role
- Iterates `UTILITY_FAMILIES` in canonical order producing per-family segments.
- Aggregates segments into a concatenated CSS string with class counts for size metrics.
- Provides a single function (`generateUtilities`) returning structured output.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| Project (type) | `../../state/store` | Type safety for project structure. |
| getFontSizeVirtualTokens | `../tokens/derived` | Access derived virtual font-size tokens. |
| UTILITY_FAMILIES | `./constants` | Canonical iteration order. |

## Exports
- `GeneratedUtilitySegment` interface: shape of each segment `{ family, css, classCount }`.
- `UtilitiesOutput` interface: `{ segments, concatenated, totalClasses }` aggregate.
- `generateUtilities(project: Project)` main generator.

## Internal Elements
Three builder helpers (currently internal functions):
- `buildFontSizeUtilities`: Maps virtual font-size tokens to `.text-{index}` classes.
- `buildSpacingUtilities`: Creates margin/padding base, axis, and side shorthands from spacing tokens.
- `buildColorUtilities`: Emits text/background/border color classes from color tokens.

## Determinism Strategy
- Families processed strictly in `UTILITY_FAMILIES` order.
- Token entries within families sorted lexicographically (spacing, color) before class emission.
- Virtual font-size tokens already deterministic via derivation logic.
- Output concatenation order is `segments.map(...).join('\n')` stable across runs.

## Algorithm (`generateUtilities`)
1. Initialize empty `segments` array.
2. For each family in `UTILITY_FAMILIES`, call its builder.
3. Push resulting segment.
4. Concatenate all CSS strings with newlines.
5. Sum class counts for `totalClasses`.
6. Return structured output.

## Edge Cases & Assumptions
- Missing token categories default to empty objects (guarded by project shape); builders will emit zero classes gracefully.
- No variant (responsive/state) handling yet—will wrap segments later without breaking base determinism.
- No prefix application yet; future integration must occur inside builders (preserving ordering) or via a post-pass (must be deterministic).

## Performance Considerations
Current implementation is linear in number of tokens. Even at thousands of tokens, string concatenation cost is minimal; future optimization may pool arrays per builder if scale grows.

## Change Risk
Medium—central to artifact output; modifications can affect determinism and tests. New families must append to `UTILITY_FAMILIES` and add a corresponding builder branch.

## Future Ideas
- Introduce variant expansion layer (responsive/state) producing grouped media/pseudo blocks.
- Accept options for including/excluding families (while preserving canonical ordering of those enabled).
- Support prefix injection parameter.
- Return additional metadata (e.g., bytes, hash per segment) for incremental hashing & caching.
