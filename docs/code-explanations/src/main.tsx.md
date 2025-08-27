# src/main.tsx
<!-- source-hash: b94d0572cd89bed1daa9786d755b5ca2c17566f762d6cdb0bfd0b90b2bde1d9b -->

## Purpose
Entry point that boots the React application and mounts `<App />`.

## High-Level Role
- Acquire root DOM node.
- Create React 18 concurrent root.
- Render application shell.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| React | react | TSX reference (compat). |
| createRoot | react-dom/client | React 18 root API. |
| App | ./ui/App | Top-level UI component. |

## Exports
None (side-effect module).

## Internal Elements
Non-null assertion on `#root` presumes HTML contains `<div id="root">`.

## Control Flow
1. Resolve root.
2. Create root.
3. Render `<App />`.

## Edge Cases
Missing `#root` causes runtime error.

## Change Risk
Low.

## Future Ideas
- Add `<StrictMode>`.
- Wrap in error boundary / suspense fallback.
