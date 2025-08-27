# Validation & Error Codes

Comprehensive reference for token validation (GH-001 Token CRUD, GH-021 Invalid Token Error Feedback).

## Overview
Validation ensures token sets remain consistent, accessible for UI feedback, and deterministic for exports. Each validation produces structured `ValidationError` objects with optional `details` for actionable UI messaging.

## Error Object Shape
```
interface ValidationError {
  code: 'invalid_name' | 'invalid_value' | 'duplicate_name' | 'not_found' | 'batch_conflict' | 'style_warning';
  field?: 'name' | 'value' | 'general';
  message: string;                // Human readable, user-facing
  severity?: 'error' | 'warning'; // Defaults to error if omitted
  details?: {                     // Optional actionable metadata
    name?: string;                // Token name involved
    value?: string;               // Offending value
    expected?: string;            // Human friendly expectation
    pattern?: string;             // Regex source (when relevant)
  };
}
```

## Codes
| Code | Severity | Field | Description | Typical Fix |
|------|----------|-------|-------------|-------------|
| invalid_name | error | name | Token name violates naming pattern (`^[a-z][a-z0-9-]*$`). | Convert to kebab-case, start with lowercase (use Suggest button). |
| invalid_value | error | value | Value doesn't match category pattern (hex / rgb(a) / unit). | Correct format; check regex or apply normalization. |
| duplicate_name | error | name | Name already exists in current category. | Rename or remove existing. |
| not_found | error | general | Target token not present for update/rename/delete. | Refresh list; ensure correct name. |
| batch_conflict | error | name | Same token name repeated in a pasted batch. | Remove duplicates; keep first unique instance. |
| style_warning | warning | name/value | Heuristic quality issue (length, multiple hyphens, trailing hyphen). | Optional cleanup; does not block save. |

## Category Value Patterns
| Category | Pattern (Regex simplified) | Examples Accepted | Notes |
|----------|---------------------------|-------------------|-------|
| colors | `#rgb(a)? / #rrggbb(aa)? | rgb()/rgba()` | `#fff`, `#fffa`, `#112233`, `rgba(0,0,0,0.5)` | Hex normalized lowercase; short hex expanded. |
| spacing | `number + (px|rem|em|%)` | `4px`, `1.25rem`, `50%` | Decimal collapsed (4.0px → 4px). |
| radii | `number + (px|rem|%)` | `4px`, `0.5rem`, `50%` | Same as spacing; `%` common for circles. |
| shadows | any non-empty string | `0 1px 2px rgba(0,0,0,.2)` | Minimal validation (future: structured parse). |

## Heuristics (Non-blocking)
- Length > 30 chars → consider shorter alias.
- Consecutive hyphens `--` discouraged.
- Trailing hyphen `-` discouraged.

## Normalization Rules
| Aspect | Rule | Example In | Example Out |
|--------|------|------------|-------------|
| Hex case | Lowercase | `#ABCDEF` | `#abcdef` |
| Short hex | Expand 3/4 char to 6/8 | `#abc` | `#aabbcc` |
| rgba()/rgb() | Lowercase function, collapse spaces | `RGBA(0, 0, 0, 0.5)` | `rgba(0,0,0,0.5)` |
| Numeric units | Strip trailing .0 | `4.0px` | `4px` |

## UI Behaviors
| Behavior | Trigger | Result |
|----------|---------|--------|
| Inline validation | Debounced (180ms) name/value change | Field errors/warnings list updates. |
| Suggestion button | invalid_name present | Button applies suggested normalized name. |
| Normalize button | Computed normalized != input & no value errors | Button replaces current value. |
| Batch add preview | Paste into batch textarea | Table lists line, parsed name/value, status. |
| Batch apply | Valid entries > 0 & no blocking errors/duplicates | `batchAddTokens` invoked atomically. |

## Accessibility
- Errors are listed under inputs with `aria-describedby` linking for screen readers.
- `aria-invalid` applied when errors present.
- Live regions broadcast error list changes without page reflow.

## Determinism & Hashing Impact
Normalization ensures semantically identical values produce identical serialized output, preserving deterministic hashes. Name suggestion only applied on user action (not implicit) to avoid surprising hash changes.

## Extensibility Guidelines
1. Add new error codes to `ValidationErrorCode` union.
2. Provide regex + help text inside `valueValidators` (or create a category-specific validator).
3. Update tests: granular value test + full validation report test.
4. Document new code here (table append) and increment doc hash scripts if necessary.

## Related Source
- `src/domain/tokens/validation.ts`
- `src/domain/tokens/parse.ts`
- UI integration: `src/ui/components/TokenTable.tsx`

## Traceability
- GH-001 Token CRUD & Validation
- GH-021 Invalid Token Error Feedback

