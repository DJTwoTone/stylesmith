# src/domain/utilities/constants.ts
<!-- source-hash: f682677951d4c56c78a2fc368fb6e42f4c3123f86d0122d7612ea7c3c9a26ae1 -->

## Purpose
Define the canonical ordered list of utility families for deterministic generation.

## High-Level Role
- Centralizes which utility families exist (and their ordering contract).
- Guarantees stable iteration order for utilities output hashing & tests.
- Exposes a strict union type (`UtilityFamily`) derived from the array.

## Imports
_None_

## Exports
- `UTILITY_FAMILIES`: readonly tuple of family identifiers in canonical order.
- `UtilityFamily`: union type of the tuple elements.

## Internal Elements
The array is defined `as const` so TypeScript preserves literal types and enables `typeof UTILITY_FAMILIES[number]` pattern.

## Determinism Strategy
Changing order here would be a breaking determinism change; future families must append (or require a major version / explicit migration note).

## Edge Cases
None at runtime (pure static data). Consumers should guard when a family is disabled (future toggle logic) rather than mutating this array.

## Change Risk
Low—edits directly impact output ordering; must be accompanied by test snapshot updates.

## Future Ideas
- Move to dynamic enable/disable map while preserving canonical master list.
- Attach metadata per family (e.g., dependsOnTokens, variantSupport) for incremental rebuild heuristics.
