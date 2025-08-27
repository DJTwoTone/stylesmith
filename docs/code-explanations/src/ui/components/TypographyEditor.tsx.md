# src/ui/components/TypographyEditor.tsx
<!-- source-hash: e3c5fec85416eeb5e65ab8f83bf20cb072cb05dd1a913e0b39b2c071135ac530 -->

## Purpose
Provide an interactive UI to configure the modular type scale and map heading levels to generated font-size tokens with accessible feedback.

## High-Level Role
- Lets users adjust base, ratio, and optional presets.
- Previews computed scale (px + rem) deterministically.
- Manages heading level → token mapping with validation feedback.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| React hooks | react | Component state & memoization. |
| useStore | `../../state/store` | Access project + update actions. |
| generateTypeScale, defaultHeadingsMap | `../../domain/typography/scale` | Compute scale & defaults. |

## Exports
- `TypographyEditor` React component.

## Internal Elements
- Local controlled inputs for base/ratio/presets (blank string = defer to stored config).
- Derived effective values compute preview without mutating state until Apply.
- `Field` helper component encapsulates label + hint semantics.
- Local heading map state synced to store on mount / changes.

## Key Behaviors
### applyScale
Validates numbers > 0 and invokes `updateTypeScale`, clearing heading errors.

### resetHeadingsToDefault
Uses `defaultHeadingsMap` over current preview steps; attempts to persist with `setHeadingsMap`, capturing validation errors.

### saveHeadings
Persists current local mapping to store with validation.

## Determinism Strategy
- Scale preview recomputed via `useMemo` based solely on effective inputs → stable ordering of steps.
- Heading mapping tokens always drawn from deterministic `steps.map` names.

## Accessibility Considerations
- Labels associated via `htmlFor`.
- Hint text has id referenced indirectly (could later add `aria-describedby`).
- `aria-live="polite"` region announces heading mapping errors.
- Table has `aria-label` for context.

## Edge Cases
- If project or scale slice missing, component returns null (defensive early return).
- Empty presets input resets to using generated scale.

## Change Risk
Low/Medium: UI-only; logic interacts with store actions. Changing state shape or headings validation requires updates here.

## Future Ideas
- Inline validation on blur for numeric fields.
- Live diff indicators (old vs new scale comparison highlighting changed steps).
- Persisted user preference for showing/hiding advanced fields.
