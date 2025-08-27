# src/domain/tokens/validation.ts
<!-- source-hash: 9888d9124b2b73a0de1183ecb1ed3c9e3742c6053bf76d0169899c3b368eb790 -->

## Purpose
Provide comprehensive token validation, normalization, heuristics, and insertion preparation utilities.

## High-Level Role
- Enforce naming & value rules per token category.
- Offer user-facing structured reports (errors vs warnings by field).
- Supply normalization & name suggestion helpers.
- Prepare tokens for insertion (auto-fix flows) deterministically.

## Imports
_None_

## Exports (Primary)
- Types: `TokenCategory`, `ValidationError`, `ValidationResult`, `TokenValidationReport`, `ValidationErrorCode`, `ValidationSeverity`, option/result interfaces.
- Constants: `TOKEN_NAME_REGEX`.
- Validators: `validateTokenName`, `validateTokenValue`, `validateBatch`, `validateTokenFull`.
- Aggregators/Helpers: `combineErrors`, `summarizeValidation`.
- Normalization & Suggestion: `normalizeTokenValue`, `suggestTokenName`, `ensureUniqueTokenName`.
- Pipeline: `prepareTokenInsertion`.

## Internal Elements
- `valueValidators`: category → regex + help text.
- `CATEGORY_KEY_MAP`: plural project categories → singular validator key.
- Heuristic warnings (length, consecutive hyphens, trailing hyphen).
- Normalization functions for colors (hex expansion / lowercase, rgb/rgba casing) and numeric units.

## Key Functions
### validateTokenFull
Returns a rich report with per-field grouping, optional heuristics & normalization snapshot.

### suggestTokenName
Lowercases, replaces invalid chars with hyphens, collapses repeats, enforces leading letter, final fallback to ensure regex compliance.

### normalizeTokenValue
- Colors: lowercase + expand short hex (#abc → #aabbcc) / rgba() lowercase.
- Spacing/Radii: collapse numeric formatting (strip trailing .0).

### ensureUniqueTokenName
Adds numeric suffix -2, -3... after stripping existing numeric suffix, ensuring deterministic uniqueness.

### prepareTokenInsertion
Orchestrates (optional) suggest → uniqueness → normalization → validation producing final name/value and report plus change flags.

## Determinism Strategy
Normalization + uniqueness steps are pure & order-fixed. Suggestion algorithm stable for identical inputs.

## Edge Cases
- Empty/invalid names: suggestion falls back to `t` or `t-*` forms.
- Cyclic references not applicable.
- Batch duplicates flagged as `batch_conflict`.

## Change Risk
Medium: surface area large; modifications affect UI and tests. Add tests for new heuristics before shipping.

## Future Ideas
- Category-specific advanced validation (contrast thresholds for colors, unit ranges).
- Async validation hooks (e.g., reserved names lookup).
- Pluggable rule registry.
