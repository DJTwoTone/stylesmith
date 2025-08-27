# src/ui/components/TokenTable.tsx
<!-- source-hash: 68a72bb2cca921903556b84d27e0abcb9b346ac34d9435934fc5102bd1082664 -->

## Purpose
Editable table for a single token category (list, add, update, rename via edit form, delete).

## High-Level Role
- Display sorted tokens.
- Provide form to add/update.
- Supports rename when original name differs on save.
- Surface validation errors.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| React, useState | react | Component & local state. |
| useStore | ../../state/store | Token actions & data. |

## Props
`category: 'colors' | 'spacing' | 'radii' | 'shadows'`

## Exports
- `TokenTable` React component.

## Internal State
`name`, `value`, `originalName`, `errors`.

## Flow
1. Derive sorted entries.
2. Form submit path:
	- If editing (originalName set) and name changed → rename then update value.
	- Else if name exists → update; else add.
3. On success reset form; on failure list errors.

## Edge Cases
Rename supported through edit workflow. Deleting currently edited token not guarded (possible stale form state but harmless). No batch ops.

## Change Risk
Low–Medium (depends on store contract).

## Future Ideas
- Inline row editing.
- Color preview swatches.
- Batch paste import integration (WP-04).
- Value validation inline feedback (per-field) instead of submit-only.
