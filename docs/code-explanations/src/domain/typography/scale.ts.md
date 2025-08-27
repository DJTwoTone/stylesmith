# src/domain/typography/scale.ts
<!-- source-hash: 3264c535149d06a1ceb60ca71c5920e60f3aaab35ef5827afa00312765bad7f9 -->

## Purpose
Generate a modular type scale (or accept explicit presets) and provide heading level → token mapping utilities with validation.

## High-Level Role
- Core typography computation input to virtual font size tokens.
- Supplies default headings map & validation logic consumed by UI.

## Imports
_None_

## Exports
- Types: `TypeScaleConfig`, `TypeScaleStep`, `HeadingLevel`, `HeadingsMap`, `HeadingsValidationResult`.
- Constants: internal `DEFAULT_INDEX_RANGE` (not exported) shapes generated steps.
- Functions: `generateTypeScale`, `defaultHeadingsMap`, `validateHeadingsMap`.

## Key Functions
### generateTypeScale(config)
If `presets` provided → map directly to steps; else compute powers of `ratio` across `DEFAULT_INDEX_RANGE` offsets multiplied by `base`.

### defaultHeadingsMap(steps)
Sorts steps descending by px value; assigns top 6 to h1..h6; reuses smallest available if fewer than six steps.

### validateHeadingsMap(map, availableTokenNames)
Confirms all references exist; returns structured error list per missing level.

## Determinism Strategy
- Index range constant ensures stable token naming (`font-size-{index}` sequential in generation order, not size order).
- Rounding to 4 decimals prevents floating drift affecting rem conversion strings.

## Edge Cases
- Invalid or empty presets array treated as absence (handled by caller).
- Large ratios produce larger numbers but rounding maintains stable string forms.

## Change Risk
Low: deterministic; changes to rounding precision or index range are breaking and must update tests.

## Future Ideas
- Allow configurable index range length.
- Provide semantic naming (e.g., `font-size-xs`) alongside numeric indices.
- Offer baseline shift alignment metadata for line-height suggestions.
