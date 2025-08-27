# src/domain/hash/stableStringify.ts
<!-- source-hash: 317e3179d430fe622a317df85433072f46dbd098579c47bbc8ff3f83790de49f -->

## Purpose
Deterministically stringify values by sorting plain object keys recursively.

## High-Level Role
- Normalizes object key ordering for stable hashing.
- Avoids external dependency.

## Imports
_None_

## Exports
- `stableStringify(value: unknown): string`

## Internal Elements
`sortValue` recursively rebuilds plain objects with sorted keys; arrays preserved.

## Algorithm
1. If array → map recursively.
2. If plain object → sorted keys → new object.
3. Else return value.
4. `JSON.stringify` normalized structure.

## Edge Cases
No cycle detection (throws if cyclic). Non-plain objects (Date, Map) pass through.

## Change Risk
Low.

## Future Ideas
- Optional cycle handling.
- Stable ordering for Maps/Sets.
