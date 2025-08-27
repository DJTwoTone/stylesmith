# src/ui/components/TokenTable.tsx
<!-- source-hash: b39f30cb759255dde976dce705517be77636c0a5f7af5b14d0a1f08ce67e6cc5 -->

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
