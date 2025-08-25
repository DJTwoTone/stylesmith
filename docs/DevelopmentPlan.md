# StyleSmith Comprehensive Development Plan

## 0. Overview
Local‑first deterministic CSS design system generator (tokens → utilities → optional components → docs/export). Anchors: determinism, minimal surface, <100ms feedback, transparency (size + ordering), accessibility by default, zero data egress without opt‑in.

---
## 1. Scope & Guiding Principles
Principles: Determinism; Fast Feedback; Minimal/Selective Export; Accessibility & Privacy First; Progressive Extensibility; Performance Budgets enforced.

Success Alignment:
- Business: TTFE ≤ 5m (p50); deterministic artifact hashes; adoption foundation.
- User: Rapid visual iteration; selective export; reproducible outputs; accessible baseline.
- Technical: utilities generation ≤300ms at 8K classes; no long task >50ms; hash stability ≥95% unchanged reopen.

---
## 2. High-Level Architecture
Front-end only (phase v1). Layers:
- UI Layer: (React + TS assumed) + lightweight state manager (Zustand/Redux Toolkit) with slices.
- Domain Modules: tokens, utilitiesEngine, componentsRecipes, sizeEstimator, exportManager, persistence (IndexedDB/LocalForage + migrations), analytics (opt-in), theming (Blueprint Mode), hashing, parser, accessibility helpers, settings.
- Data Flow: UI edit → domain mutation → incremental recomputation → updated artifacts & size stats → optional hash updates.
- Determinism Keys: Sorted token objects; fixed utility family & variant order; stable minifier config and version lock; stable JSON stringify for hashing.

---
## 3. Data Model (SchemaVersion: 1)
Project:
```ts
interface ProjectV1 {
  id: string; name: string; schemaVersion: 1;
  tokens: {
    colors: Record<string,string>;
    spacing: Record<string,string>;
    radii: Record<string,string>;
    shadows: Record<string,string>;
    typography: { scaleConfig: { base: number; ratio: number; presets?: number[] }; headingsMap: Record<string,string>; };
    prefix?: string;
    darkVariant?: { colors?: Record<string,string>; /* blueprint mode vars */ };
  };
  utilitiesConfig: {
    enabledFamilies: string[];
    variants: { breakpoints: { id:string; minWidth:number }[]; states: string[] };
    darkModeStrategy: 'media' | 'class';
  };
  componentsSelection: { buttons:boolean; forms:boolean; modals:boolean; tabs:boolean; tables:boolean };
  exportOptions: { includeReset:boolean; includeDocs:boolean; includeBundle:boolean; includeDemoJS:boolean; includeHashSummary:boolean };
  sizeThresholds: { bytesMinifiedWarn:number; classCountWarn:number };
  analytics: { optedIn:boolean; deviceHash?:string };
  preferences: { blueprintMode: 'auto'|'light'|'dark'; reducedMotionOverride?: boolean };
  createdAt: string; updatedAt: string;
}
```
Migrations: `Map<fromVersion, migrator>`; log `{from,to,changedFieldsCount}`; transient pre-migration snapshot retained until confirm.

---
## 4. Epics → User Stories Mapping
- E1 Tokens Core: GH-001, GH-002, GH-003, GH-004, GH-021, GH-024, GH-026, GH-027
- E2 Utilities System: GH-005, GH-006, GH-007, GH-013, GH-014, GH-030
- E3 Components & Docs: GH-008, GH-009, GH-010, GH-025
- E4 Export & Hashing: GH-011, GH-012, GH-028, GH-020 (+ GH-007 tie)
- E5 Persistence & Versioning: GH-015, GH-016
- E6 Accessibility & Theming: GH-018, GH-019, GH-029 (+ GH-003 contrast)
- E7 Analytics (Opt-In): GH-017, GH-023
- E8 Performance & Size Governance: GH-013, GH-014, GH-022, GH-030
- E9 Security/Privacy Baseline: GH-023
Cross-cutting: Determinism (GH-007), Hash summary (GH-028).

---
## 5. Dependency Graph (Simplified)
```
tokens
  ├─> utilitiesEngine ─> sizeEstimator ─> exportManager ─> hashing
  ├─> componentsRecipes ─┘
  └─> docs generation (needs utilities + components)

persistence ↔ migrations → all
analytics gated by preferences.analytics.optedIn
Blueprint Mode theming overlays token variable sets
```
Critical Path Phase 1: tokens → utilitiesEngine → hashing/export → persistence → size indicator.

---
## 6. Technical Strategies
### Deterministic Ordering
- Lexicographically sort token keys (stable comparator).
- Utility families enumerated in canonical array constant.
- Variants order: base → responsive (ascending minWidth) → states (alphabetical).
- Minification: cssnano preset (locked version); consistent newline handling.

### Hashing
- `stableStringify(projectSubset)` (sorted keys) → generate per-artifact SHA-256.
- `HASHES.txt`: lines `filename.css  <first12hash>` + final manifest hash.

### Size Estimation
- Raw = length.
- Minified: segment-level caching keyed by SHA of segment pre-minified.
- Gzip heuristic: `minifiedBytes * ratio (default 0.32, configurable)` with disclaimer; future worker for actual compression.

### Contrast Evaluation
- WCAG relative luminance; computed on relevant color mutations; memoized luminance results.

### Paste Import Parser
- Regex: `--([a-zA-Z0-9-_]+):\s*([^;]+);` parse; maintain error list; deduplicate; preview diff before merge.

### Incremental Utilities Generation
- Dependency map: family → token categories; changed token categories mark families dirty; rebuild only dirty; re-concatenate in fixed order.

### Variants Application
- Base classes first.
- Responsive: wrap in ordered `@media (min-width:{px})` blocks.
- States: pseudo-classes appended in canonical order `:hover,:focus,:active,:disabled`.

### Blueprint Mode
- Dual var sets; dark variant conditional: media strategy OR `.blueprint-dark` root override.

### Persistence & Migration
- On load: apply sequential migrations if schemaVersion < current; show summary banner; allow revert until user interaction (closing banner commits).

### Accessibility
- All interactive elements keyboard reachable; visible focus ring token(s) ensuring ≥3:1 contrast.
- Automated axe checks in CI; manual keyboard traversal script.

### Analytics (Opt-In)
- No-op publisher until optedIn.
- Device hash generated only after opt-in (SHA-256(random + UA subset)).
- Event whitelist: app_launch, project_created, project_exported, token_batch_edit, utilities_family_toggled, component_selected, analytics_opt_in, analytics_opt_out.

### Privacy/Security
- No network calls unless analytics enabled (and still payload-sanitized).
- CSP recommendation documented (future packaging).

### Performance
- Debounce expensive recomputations (≤50ms) except critical token edits.
- Potential future web worker for compression / heavy size analysis.
- Virtualize token tables >300 entries.

---
## 7. Module Inventory (Planned Structure)
```
src/state/store.ts
src/domain/tokens/*
src/domain/utilities/*
src/domain/components/*
src/domain/size/*
src/domain/export/*
src/domain/hash/*
src/domain/parser/*
src/domain/migrations/*
src/domain/analytics/*
src/lib/theming/*
src/lib/accessibility/*
src/ui/components/*
src/ui/pages/{Landing,Editor,DocsPreview,ExportDialog}
/tests/{unit,integration,e2e}/...
```

---
## 8. Work Packages (WP) & DoD
| WP | Summary | Stories |
|----|---------|---------|
| WP-01 | Token CRUD + Validation | GH-001, GH-021, GH-024 |
| WP-02 | Type Scale & Headings | GH-002, GH-026 |
| WP-03 | Color Contrast Engine | GH-003 |
| WP-04 | Token Import Parser | GH-004 |
| WP-05 | Utilities Core Engine | GH-005 |
| WP-06 | Variants System | GH-006, GH-030 (config) |
| WP-07 | Deterministic Ordering & Hashing | GH-007, GH-028 |
| WP-08 | Size Indicator Basic | GH-013 (basic) |
| WP-09 | Component Recipes | GH-008 |
| WP-10 | Docs Export Pipeline | GH-009, GH-020 |
| WP-11 | Demo JS Packaging | GH-010 |
| WP-12 | Export Packaging & ZIP | GH-011, GH-012, GH-025 |
| WP-13 | Purge Simulation | GH-014 |
| WP-14 | Persistence + Project Ops | GH-015 |
| WP-15 | Migration Layer | GH-016 |
| WP-16 | Accessibility Pass | GH-018 (+ contrast) |
| WP-17 | Blueprint Mode & Reduced Motion | GH-019, GH-029 |
| WP-18 | Analytics Opt-In System | GH-017, GH-023 |
| WP-19 | Size Threshold Warnings & Config | GH-013 (adv), GH-030 |
| WP-20 | Performance Instrumentation | GH-022 |
| WP-21 | Token Prefix Namespace | GH-027 |
| WP-22 | Security/Privacy Audit | GH-023 |
Definition of Done (per WP): Code + Types + Tests (≥1 unit + integration if applicable) + A11y review (UI) + Performance check (if generation) + Determinism test (if output) + Docs updated + No new lint/type errors.

---
## 9. Timeline / Phases (Indicative)
Phase 1 (Weeks 1–4): WP-01..03, 04, 05, 06, 07, 08, 12 (minimal export), 14.
Phase 2 (Weeks 5–6): WP-09, 10, 11, 21.
Phase 3 (Weeks 7–8): WP-13, 15, 19, 17.
Phase 4 (Weeks 9–10): WP-16, 20, 18, 22.
Buffer / Hardening: final polish & release readiness.
Critical Path: WP-01 → WP-05 → WP-07 → WP-12 → WP-14.

---
## 10. Estimation Summary (Story Points)
WP-01(5) 02(3) 03(3) 04(5) 05(8) 06(5) 07(5) 08(3) 09(5) 10(5) 11(2) 12(5) 13(5) 14(5) 15(5) 16(5) 17(3) 18(5) 19(5) 20(3) 21(2) 22(2) → Total ≈ 92 pts (~11–12 dev weeks solo).

---
## 11. Testing Strategy
- Unit: validation, contrast, parser, hashing, size estimator, utilities generation snapshots.
- Integration: project load/edit/regenerate determinism; import flow; export packaging integrity.
- E2E (Playwright/Cypress): TTFE scenario; accessibility tab order; Blueprint persistence; export determinism.
- Performance: benchmark utilities generation at 8K classes (<300ms) in CI gating.
- Determinism Regression: double-build diff (expected empty) in CI.

---
## 12. Tooling & Environment
Vite + TypeScript; ESLint (TS + a11y); Stylelint; Prettier; Vitest; Playwright; lint-staged + typecheck pre-commit; CI pipeline: install → build → unit/integration → determinism diff → E2E smoke → axe scan.
Version Pin Task: react, react-dom, typescript, vite, postcss, cssnano, localforage, jszip, axe-core, playwright, vitest.

---
## 13. Export Pipeline Design
Artifacts: tokens.css; utilities.css; components/*.css (or aggregated); reset.css (optional); style.css (orchestrator imports); style.bundle.css (minified + inlined); docs/ (HTML + static CSS + optional demo JS); HASHES.txt.
Ordering: stable filename sort; content concatenation in deterministic order (tokens → utilities → components → optional reset).
Clipboard copy uses same in-memory strings; test byte-for-byte equality with ZIP contents.

---
## 14. Size & Performance Governance
Metrics: classCount, rawBytes, minBytes, estGzipBytes.
Caching: segment-level minification cache.
Thresholds: defaults (25KB minified utilities, 8K classes) → configurable per project; severity levels with suggestions (disable families, reduce variants, adjust breakpoints).
Purge Simulation: compute hypothetical size removal per family using generated segment lengths.

---
## 15. Accessibility Implementation
Semantic structure; focus ring styles; token contrast badges; modals with focus trap + escape; reduced motion media query; automated axe; manual keyboard traversal check-list.

---
## 16. Analytics Architecture (Opt-In)
`publish(event)` noop until flag set; queue flush on idle/visibilitychange; whitelist enforcement; payload excludes token names/values & CSS content; device hash post opt-in.

---
## 17. Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Parser fragility | Fuzz tests + tolerant whitespace + incremental improvements |
| Determinism drift (lib upgrades) | Lock deps + CI double-build diff |
| Perf regressions | Budget tests + profiling script |
| Accessibility regressions | Automated axe + manual script per release |
| Gzip heuristic inaccuracy | Disclaimer + future worker slot |
| Migration errors | Versioned test fixtures + dry-run log |

---
## 18. Open Questions
1. Component CSS export without docs? (Assumed allowed). Action: Confirm by Phase 2 start.
2. Size threshold defaults finalization post sample corpus (collect during Phase 2). Action: Benchmark dataset.
3. Migration backup transient only acceptable? Action: Confirm before first migration (Phase 3 start).
4. Gzip heuristic acceptance until worker? Action: Confirm; create backlog item for real compression.

Will create issue label `open-question` with resolution deadlines.

---
## 19. Issue Labeling Scheme
Labels: `type:{feature|bug|tech-debt|docs|test|open-question}`; `epic:E#`; `priority:P0|P1|P2`; `story:GH-0XX`; `status:{ready|in-progress|blocked|review|done}`.

---
## 20. Definition of Done (Per WP)
- Code + Types
- Tests (unit + integration/E2E where appropriate)
- No new lint/type errors
- Determinism test (if output affects artifacts)
- Performance budget verified (if generation logic)
- Accessibility review (if UI)
- Docs / README or dev notes updated

---
## 21. Release Readiness Checklist
- All P0 stories closed & verified
- Determinism CI test green 3 consecutive runs
- Accessibility audit pass (axe + manual keyboard)
- Performance baseline recorded (utilities at scale)
- Hash reproducibility success (sample project) documented
- User docs: setup, usage, architecture, determinism, privacy/analytics

---
## 22. Post-v1 Backlog Seeds
Real gzip worker; Multi-user/cloud sync; Advanced component library; Content-aware purge; Theme presets marketplace.

---
## 23. Immediate Next Steps
1. Confirm open assumptions.
2. Scaffold repo (Vite + TS + lint/test configs) & pin dependencies.
3. Create issues from work packages + stories (labels applied).
4. Begin WP-01 implementation.

---
## 24. Traceability (Sample)
| Story | Work Package | Primary Test |
|-------|--------------|-------------|
| GH-007 | WP-07 | determinism.integration |
| GH-013 | WP-08/WP-19 | size.ui.integration |
| GH-016 | WP-15 | migration.integration |
(Full table to be auto-generated in an upcoming script.)

---
## 25. Actionability Validation & Gap Note
All major sections present (architecture, data model, epics, dependencies, milestones, estimation, testing, export design, size governance, accessibility, analytics, risks, open questions, labeling, DoD, readiness, next steps). Gaps: full traceability table + explicit version pin list (task recorded). Otherwise actionable.
