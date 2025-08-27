# src/domain/hash/hash.ts
<!-- source-hash: 805aa7aa1cb3943b9b074d2671af6af0eff1ecc2d4e766f2d41c030b6e4ff5ca -->

## Purpose
Environment-agnostic SHA-256 hashing for deterministic artifact generation.

## High-Level Role
- Prefer Web Crypto (browser).
- Fallback to Node `crypto` dynamically.
- Return lowercase hex digest.

## Imports
| Import | Source | Why |
| ------ | ------ | --- |
| createHash (dynamic) | crypto | Node fallback hashing. |

## Exports
- `sha256(input: string): Promise<string>`: Hashes UTF-8 string → hex digest.

## Internal Elements
Web path uses `TextEncoder` then `crypto.subtle.digest`.

## Algorithm
1. If `window.crypto.subtle` available → digest.
2. Else dynamic import Node `crypto`.
3. Convert buffer → hex.

## Edge Cases
Empty string returns known hash; always async for uniform API.

## Change Risk
Low (pure, small).

## Future Ideas
- Stream / incremental hashing.
- Support `Uint8Array` input.
