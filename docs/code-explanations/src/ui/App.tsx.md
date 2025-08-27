# src/ui/App.tsx
<!-- source-hash: 00b424b7d5c545ad6951e147c5558ae03b4a1f151cabc48d8664fe0e71ccc535 -->

## Purpose
Top-level component orchestrating project creation, token tables for all categories, and typography editor.

## High-Level Role
- Gate UI on project existence.
- Render four token categories (colors, spacing, radii, shadows).
- Include `TypographyEditor` for scale + headings mapping.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| React | react | JSX. |
| useStore | ../state/store | Access project state. |
| TokenTable | ./components/TokenTable | CRUD per category. |
| TypographyEditor | ./components/TypographyEditor | Configure type scale + headings. |

## Exports
- `App` component.

## Control Flow
If no project → show create button; else list token tables and typography editor.

## Edge Cases
Repeated create overwrites current project (no prompt yet).

## Change Risk
Low.

## Future Ideas
- Add routing / tabs.
- Project rename & delete.
- Project persistence once WP-14 lands.
