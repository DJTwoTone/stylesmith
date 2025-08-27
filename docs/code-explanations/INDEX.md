# Code Explanations Index

Canonical list of documented source files (auto-maintained manually until script generation added). Each entry links to its explanation doc.

## Root / Entry
- [src/main.tsx](src/main.tsx.md)

## State
- [src/state/store.ts](src/state/store.ts.md)

## Domain / Hash
- [src/domain/hash/hash.ts](src/domain/hash/hash.ts.md)
- [src/domain/hash/stableStringify.ts](src/domain/hash/stableStringify.ts.md)

## Domain / Tokens
- [src/domain/tokens/validation.ts](src/domain/tokens/validation.ts.md)
- [src/domain/tokens/derived.ts](src/domain/tokens/derived.ts.md)
 - [Validation & Error Codes](../../ValidationErrors.md)

## Domain / Typography
- [src/domain/typography/scale.ts](src/domain/typography/scale.ts.md)

## Domain / Utilities
- [src/domain/utilities/constants.ts](src/domain/utilities/constants.ts.md)
- [src/domain/utilities/generate.ts](src/domain/utilities/generate.ts.md)

## UI
- [src/ui/App.tsx](src/ui/App.tsx.md)
- [src/ui/components/TokenTable.tsx](src/ui/components/TokenTable.tsx.md)
- [src/ui/components/TypographyEditor.tsx](src/ui/components/TypographyEditor.tsx.md)

## Coverage
All current TypeScript / TSX files under `src/` have corresponding explanation docs. Run `npm run doc:check` to verify after changes.

## Future Automation
Planned script will auto-generate this index and inject primary test file links.
