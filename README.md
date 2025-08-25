# StyleSmith

Local-first deterministic CSS design system generator. Define tokens visually, toggle a constrained utility layer, optionally include minimal component recipes, and export stable, byte-for-byte reproducible CSS artifacts (tokens, utilities, components, reset, docs, bundle) with hashing for CI validation.

## Vision
Bridge design <> engineering in minutes: rapid token iteration, immediate preview, selective export, deterministic ordering + hashing, size transparency, and accessibility baked in. No accounts, no server, data stays local.

## Key Pillars
Determinism · Fast Feedback (<100ms UI) · Minimal Surface · Accessibility & Privacy First · Size Transparency · Progressive Extensibility.

## High-Level Architecture
Front-end only (React + TypeScript + Vite).

Layers:
- UI (pages: Landing, Editor, DocsPreview, ExportDialog)
- State (Zustand store slices)
- Domain modules: tokens, utilitiesEngine, componentsRecipes, sizeEstimator, exportManager, hashing, parser, persistence (IndexedDB), migrations, analytics (opt-in), theming (Blueprint Mode), accessibility helpers
- Pure generation functions ensure stable ordering → stable hashes.

## Data Model (Schema v1 excerpt)
Project: id, name, schemaVersion, tokens (colors/spacing/radii/shadows/typography/prefix/darkVariant), utilitiesConfig (enabledFamilies, variants, darkModeStrategy), componentsSelection, exportOptions, sizeThresholds, analytics, preferences, timestamps.

## Quick Start (Dev)
```bash
npm install
npm run dev
```
Open http://localhost:5173 (default Vite port).

## Scripts
- dev: Vite dev server
- build: Type check + production build
- test / test:watch: Vitest unit/integration
- lint / typecheck / format

## Early Module Stubs
Implemented: stableStringify + sha256 hashing utilities (foundation for deterministic artifact hashing).

## Planned Artifacts
tokens.css · utilities.css · components/*.css (or aggregated) · reset.css (optional) · style.css (imports orchestrator) · style.bundle.css (minified bundle) · docs/ site · HASHES.txt.

## Roadmap Snapshot (Phases)
1. Core tokens + utilities + hashing/export + persistence + basic size indicator
2. Components + docs + demo JS + token prefix namespace
3. Purge simulation + migrations + thresholds + Blueprint Mode
4. Accessibility hardening + performance instrumentation + analytics opt-in
5. Hardening & release readiness

Refer to `docs/PRD.md` & `docs/DevelopmentPlan.md` for full product & engineering detail.

## Contributing
1. Create/confirm issue (story/work package) with labels.
2. Branch naming: `feature/GH-00x-*`.
3. Ensure: types clean, lint passes, tests (add at least one), determinism unaffected unless intentional.

## Determinism Strategy
Sorted token keys, canonical utility family ordering, stable variant ordering, locked dependency versions, stable minification config, `stableStringify` + SHA-256 for artifact hashes.

## License
Proprietary. All rights reserved. Not open source. See `LICENSE`.

---
Scaffold WIP – expanding per work packages.
