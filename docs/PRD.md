## PRD: StyleSmith

## 1. Product overview

### 1.1 Document title and version

* PRD: StyleSmith
* Version: 1.2.0 (Draft)
* Owner: Benjamin W. Slater
* Last updated: 2025-08-25

### 1.2 Product summary

StyleSmith is a local‑first web application for defining a tokenized design system visually and exporting deterministic, production‑ready CSS artifacts (tokens, utilities, optional reset, component recipes, style sheet docs). It bridges design and engineering by letting any designer work with any developer in minutes while guaranteeing reproducible outputs.

Unlike broad utility frameworks (e.g., Tailwind) or heavy design system platforms, StyleSmith focuses on a tightly token‑bound, constrained utility layer, minimal optional component recipes, and zero required backend—prioritizing speed to first export and deterministic CI‑friendly outputs.

The experience includes a landing/start screen, an editor (tokens, utilities, component selection, docs preview, export tooling), and a live style sheet/documentation view that updates in real time. All data is stored locally; analytics are strictly opt‑in and non‑content aware.

## 2. Goals

### 2.1 Business goals

* Reduce time from concept to consistent CSS foundation (TTFE ≤ 5 min p50) for new projects.
* Provide deterministic export artifacts to lower integration friction and support CI hash validation.
* Establish a foundation for future paid collaboration/cloud offerings by building trusted local‑first adoption.
* Encourage adoption through low setup friction (no account) and approachable visual editing.
* Differentiate via precision (ordering determinism, size transparency, accessibility baked in).

### 2.2 User goals

* Visually create and adjust design tokens with immediate preview feedback.
* Export only the needed CSS (tokens, selected utilities, selected components) quickly and confidently.
* Maintain a lean bundle (visibility into size, ability to prune unused families/components).
* Produce shareable printable style sheet/docs when needed.
* Reopen projects later and get byte‑identical outputs for unchanged configurations.
* Ensure accessibility (color contrast, focus states) from the start.

### 2.3 Non-goals

* Real‑time multi-user collaboration (presence, shared cursors) in v1.
* Arbitrary value utilities or negative value generation (future consideration).
* Full component library or JS framework bindings (React/Vue wrappers) in v1.
* Advanced semantic versioning/version history UI (basic schema version only in v1).
* Server storage, user accounts, cloud sync.

## 3. User personas

### 3.1 Key user types

* Design systems / design ops lead
* Front-end engineer / tech lead
* Product designer
* Solo builder (designer-developer hybrid)

### 3.2 Basic persona details

* **Design systems lead**: Owns consistency, sets the token source of truth, wants governance and determinism.
* **Front-end engineer**: Integrates CSS artifacts into the build, cares about size, determinism, and maintainability.
* **Product designer**: Iterates on visual scale, colors, spacing; wants immediate visual validation and accessible defaults.
* **Solo builder**: Needs a quick, reliable baseline without over-configuration.

### 3.3 Role-based access

* All personas have identical in-app capabilities in v1 (no auth). Future: role-based constraints (edit vs view) once accounts are introduced.

## 4. Functional requirements

* **Token management** (Priority: P0)
  * Create, edit, delete tokens across all listed categories with inline validation.
  * Type scale generator with adjustable ratio/base; heading mapping auto-updates.
  * Color editor with contrast evaluation (WCAG 2.2 AA / AAA indicators).
  * Paste-import of :root variable blocks; parse ≥95% success; report errors.
  * Optional dark ("Blueprint Mode") token set generation via media query and class strategy.
* **Utility system generation** (Priority: P0)
  * Toggle utility families; generate only selected tokens & families.
  * Responsive breakpoint-driven variants; state variants only for selected families.
  * Deterministic ordering: tokens → utilities → variants sequence fixed.
  * Real-time size indicator (class count, unminified/minified byte estimate, gzip estimate).
  * Purge/treeshake preview: shows potential savings if unused families deselected (no content scanning in v1; simulation only).
* **Component recipe generation (Docs-first MVP)** (Priority: P1)
  * Buttons, Forms, Modals, Tabs, Tables available as opt-in components.
  * Component CSS only exported if the component is selected (and if docs export chosen, appears in docs examples).
  * Optional demo JS (≤ 2 KB gz) only for interactive specimens (Modals/Tabs) when both docs and those components are selected.
* **Documentation & style sheet** (Priority: P1)
  * Live-updating style sheet view synchronized within 100ms of token edit.
  * Printable style sheet and utilities reference (optional in export).
  * Blueprint Mode toggle displayed; respects system preference unless user overrides (override persisted locally).
* **Export system** (Priority: P0)
  * Generate style.css (imports), tokens.css, utilities.css, optional reset.css, optional style.bundle.css, optional docs/ directory.
  * Include only selected components and their styles (omit unselected).
  * Bundle option produces minified, import-inlined style.bundle.css.
  * ZIP packaging + per-file copy-to-clipboard; byte-for-byte parity.
  * README generation with usage guidance & reset license notes.
* **Size & performance insight** (Priority: P1)
  * Running size indicator updates on each selection change (<150ms update budget).
  * Warnings when utilities.css exceeds configurable thresholds (e.g., >25KB minified, >8K classes).
* **Persistence & schema versioning** (Priority: P0)
  * IndexedDB project records with schemaVersion; migration layer for forward compatibility.
  * Migrations auto-run when opening older projects; log summary of migrated fields.
* **Analytics (opt-in)** (Priority: P2)
  * Events (names only, no token or CSS content): app_launch, project_created, project_exported, token_batch_edit, utilities_family_toggled, component_selected, analytics_opt_in/out.
  * No PII, no token values, no CSS payloads; hashed anonymous device id (resettable) only after opt-in.
* **Accessibility compliance** (Priority: P0)
  * App UI meets WCAG 2.2 AA; target AAA for body text where possible.
  * Focus states visible and ≥3:1 contrast; keyboard navigation across all interactive controls.
* **App-only visuals policy enforcement** (Priority: P1)
  * Gridlines/sketch borders excluded from exports; export hash unaffected by toggling them.

## 5. User experience

### 5.1 Entry points & first-time user flow

* Landing: create new project, open existing, learn basics (short primer).
* First export guidance tooltip after first token edit (dismissible).
* Analytics opt-in modal on first run (before any event emission).
* Optional sample project template.

### 5.2 Core experience

* **Token editing**: Inline editable tables with immediate preview region.
  * Ensures rapid iteration and trust in outputs.
* **Utility selection**: Checklist/family toggles with live size indicator.
  * Reinforces minimalism and cost awareness.
* **Component selection**: Toggle list; disabled if docs export not selected (unless component CSS is explicitly enabled for production export—MVP requires docs for component examples; CSS can still export without docs if selected).
* **Export dialog**: Clear file list preview + size estimates.
  * Builds confidence prior to download.

### 5.3 Advanced features & edge cases

* Import malformed tokens: present structured error list with line references.
* Duplicate naming conflict resolution suggestions (auto-suffix or rename inline).
* Dark/Blueprint override persists until user reverts to system preference.
* Schema migration banner when project upgraded.
* Size threshold warnings with suggestions (disable families, reduce variants).

### 5.4 UI/UX highlights

* Blueprint Mode toggle with accessible label.
* Deterministic ordering badges (e.g., “Stable Output”).
* Real-time contrast badges next to color tokens.
* Animated diff highlights after bulk scale changes (subtle, respects reduced motion).

## 6. Narrative

A designer opens StyleSmith, creates a project, and adjusts spacing and color tokens while watching components and the style sheet update instantly. An engineer toggles only necessary utility families, observing bundle size and class count shrink. They select Buttons and Forms components, choose a reset, and export a deterministic ZIP. Weeks later the engineer reopens the project; the regenerated CSS hashes match their prior CI baseline. Confidence in consistency accelerates adoption and reduces churn on manual style refactoring.

## 7. Success metrics

### 7.1 User-centric metrics

* Time to first export (TTFE) ≤ 5 min p50 / ≤ 10 min p90.
* Token edit → preview latency <100ms p95.
* Project reopen determinism success ≥ 95% (hash match for unchanged project) by month 2.
* ≥ 50% of active projects perform at least one docs export.
* Bundle size reduction actions (family deselection) occur in ≥ 30% of projects (indicates size awareness value).

### 7.2 Business metrics

* Net promoter intent (survey) ≥ 40 within first quarter.
* Monthly returning project reopen rate ≥ 60%.
* Opt-in analytics rate ≥ 25% of unique devices.

### 7.3 Technical metrics

* utilities.css generation time ≤ 300ms at 8K classes (mid-tier laptop baseline).
* Memory footprint for editor idle < 150MB.
* No blocking main thread tasks > 50ms (Long Task API) during routine edits.
* Lighthouse performance ≥ 90 for desktop (no network blocking of main features).

## 8. Technical considerations

### 8.1 Integration points

* LocalForage (IndexedDB) for project persistence.
* Optional analytics endpoint (future) gated strictly by opt-in flag.
* Clipboard API for copy actions.
* FileSaver / JSZip (or equivalent) for ZIP packaging.

### 8.2 Data storage & privacy

* Project schema includes: id, name, schemaVersion, tokens, utilitiesConfig, componentsSelection, exportOptions, createdAt, updatedAt.
* No token or CSS data transmitted externally unless future sync feature introduced.
* Analytics payload excludes token names/values and component CSS details.

### 8.3 Scalability & performance

* Token + utilities generation functions are pure/stateless for deterministic hashing.
* Incremental recompute: only affected utility families regenerate on changes.
* Hashing strategy: stable JSON stringify with key sorting → SHA-256 for determinism check.
* Virtualization for large token tables if counts exceed threshold (future optimization trigger > 300 tokens).

### 8.4 Potential challenges

* Ensuring parsing robustness for pasted CSS (various formatting quirks).
* Balancing size indicator accuracy without full AST-level minification cost on each keystroke.
* Schema migrations reliability as new token categories appear.
* Maintaining deterministic order with user-defined custom naming patterns.

## 9. Milestones & sequencing

### 9.1 Project estimate

* Medium-Large: ~10–12 developer weeks (1–2 devs) for v1.2 scope.

### 9.2 Team size & composition

* 1–2 Front-end engineers, 1 Product/Design (shared), optional part-time Accessibility QA.

### 9.3 Suggested phases

* **Phase 1**: Core tokens + utilities generation + determinism + export (4 weeks)
  * Deliver: token editor, utilities toggles, base export, hashing, size indicator (basic).
* **Phase 2**: Component recipes + docs export + demo JS (2 weeks)
  * Deliver: Buttons, Forms, Modals, Tabs, Tables; docs pages; optional demo JS.
* **Phase 3**: Size optimization & advanced indicators + schema versioning + migrations (2 weeks)
  * Deliver: class/byte estimator, threshold warnings, schemaVersion, migration layer.
* **Phase 4**: Accessibility hardening + visual design polish + app-only visuals enforcement (1–2 weeks)
  * Deliver: WCAG audit fixes, Blueprint Mode finalization, app-only visuals exclusions.
* **Phase 5**: Analytics opt-in pipeline + refinements + performance tuning (1–2 weeks)
  * Deliver: event dispatcher (post-opt-in), performance instrumentation, polish.

## 10. User stories

### 10.1 Manage tokens

* **ID**: GH-001
* **Description**: As a user I can create, edit, and delete tokens in any category with validation feedback so that I maintain a clean, usable token set.
* **Acceptance criteria**:
  * Creating a token with a duplicate name shows inline error and prevents save.
  * Editing updates preview within 100ms (p95).
  * Deleting removes usages from utilities generation on next build cycle.

### 10.2 Type scale generation

* **ID**: GH-002
* **Description**: As a user I can set a base size and ratio to auto-generate a modular type scale and mapped heading levels.
* **Acceptance criteria**:
  * Changing ratio updates all mapped heading tokens immediately.
  * Preset ratio selection (1.2, 1.25, 1.333, 1.414, 1.5) applies without manual input.
  * Custom ratio persisted per project.

### 10.3 Color contrast feedback

* **ID**: GH-003
* **Description**: As a user I receive WCAG AA/AAA contrast indicators when adjusting color tokens to ensure accessibility.
* **Acceptance criteria**:
  * Contrast badges show pass/fail for AA normal text, AA large, AAA normal.
  * Updating either foreground or background recalculates within 100ms.

### 10.4 Paste import of tokens

* **ID**: GH-004
* **Description**: As a user I can paste :root CSS variables to import tokens rapidly.
* **Acceptance criteria**:
  * ≥95% of well-formed tokens parse; unparsed list includes line/variable name and reason.
  * User can confirm import or cancel.

### 10.5 Toggle utility families

* **ID**: GH-005
* **Description**: As a user I can toggle utility families on/off to include only needed classes.
* **Acceptance criteria**:
  * utilities.css reflects toggles instantly.
  * Unselected families produce zero classes.
  * Size indicator updates class count and byte estimates.

### 10.6 Responsive & state variants

* **ID**: GH-006
* **Description**: As a user I can enable responsive and state variants only where needed to control bundle size.
* **Acceptance criteria**:
  * Variant counts reflected in size indicator.
  * Disabling a variant family removes related classes.

### 10.7 Deterministic ordering

* **ID**: GH-007
* **Description**: As a user I can rely on identical outputs for unchanged configurations across sessions.
* **Acceptance criteria**:
  * Regenerating without edits yields identical SHA-256 hash for each artifact.
  * Changing a token changes hash.

### 10.8 Component selection

* **ID**: GH-008
* **Description**: As a user I can select individual components to export only their CSS recipes.
* **Acceptance criteria**:
  * Unselected components produce no CSS in exports.
  * Selected components appear in docs if docs export chosen.

### 10.9 Documentation export

* **ID**: GH-009
* **Description**: As a user I can export style sheet and utilities reference documentation.
* **Acceptance criteria**:
  * Docs include live tokens snapshot at export time.
  * Export omitted when toggle off.

### 10.10 Demo JS inclusion

* **ID**: GH-010
* **Description**: As a user I can optionally include small demo JS for interactive component specimens.
* **Acceptance criteria**:
  * Toggle only visible if Modals or Tabs selected and docs export enabled.
  * JS file ≤ 2 KB gz.

### 10.11 Export packaging

* **ID**: GH-011
* **Description**: As a user I can download a ZIP containing only selected files with correct structure.
* **Acceptance criteria**:
  * Reset included only if chosen; import commented otherwise.
  * bundle file present only if bundling selected.
  * README generated.

### 10.12 Copy to clipboard

* **ID**: GH-012
* **Description**: As a user I can copy each generated file’s contents to clipboard.
* **Acceptance criteria**:
  * Copied text matches ZIP version byte-for-byte.

### 10.13 Size indicator & warnings

* **ID**: GH-013
* **Description**: As a user I see real-time size stats and warnings if thresholds exceeded.
* **Acceptance criteria**:
  * Displays class count, estimated raw, minified, gzip sizes.
  * Warning state triggers when exceeding configurable thresholds.

### 10.14 Purge/treeshake simulation

* **ID**: GH-014
* **Description**: As a user I can view potential size savings from deselecting families.
* **Acceptance criteria**:
  * Simulation panel lists families with removable size estimate.

### 10.15 Project persistence

* **ID**: GH-015
* **Description**: As a user I can create, rename, duplicate, delete, and reopen projects.
* **Acceptance criteria**:
  * Operations reflected immediately in project list.
  * Reopened project regenerates identical hashes (if unchanged schema).

### 10.16 Schema migration

* **ID**: GH-016
* **Description**: As a user opening an old project, it migrates forward seamlessly.
* **Acceptance criteria**:
  * Migration summary displayed (fields changed count).
  * Backup of original retained until user confirms (in memory or temp object, not exported).

### 10.17 Analytics opt-in

* **ID**: GH-017
* **Description**: As a user I can opt-in or out of anonymous analytics at any time.
* **Acceptance criteria**:
  * No events sent before opt-in.
  * Toggling off stops future events immediately.

### 10.18 Accessibility compliance

* **ID**: GH-018
* **Description**: As a keyboard-only user I can fully navigate and receive visible focus cues.
* **Acceptance criteria**:
  * Every interactive element reachable via Tab/Shift+Tab in logical order.
  * Focus ring contrast ≥3:1.

### 10.19 Blueprint Mode (dark mode) handling

* **ID**: GH-019
* **Description**: As a user I can toggle Blueprint Mode, persisting my preference over system defaults.
* **Acceptance criteria**:
  * User override stored locally and supersedes system until reset.

### 10.20 App-only visuals exclusion

* **ID**: GH-020
* **Description**: As a user the exported CSS never includes app-only gridlines or sketch borders.
* **Acceptance criteria**:
  * Export hash unaffected by toggling app-only visuals.

### 10.21 Error feedback on invalid tokens

* **ID**: GH-021
* **Description**: As a user I get actionable messages when token values are invalid.
* **Acceptance criteria**:
  * Error specifies token name, invalid value, and expected pattern.

### 10.22 Performance budget adherence

* **ID**: GH-022
* **Description**: As a user I experience a responsive UI even with large configurations.
* **Acceptance criteria**:
  * No interaction > 100ms blocking (p95) during token edit.

### 10.23 Security / privacy baseline

* **ID**: GH-023
* **Description**: As a security-conscious user I trust that my design data stays local.
* **Acceptance criteria**:
  * No network requests referencing token values when analytics disabled.

### 10.24 Unicode & naming flexibility

* **ID**: GH-024
* **Description**: As a user I can use hyphenated and semantic token names within validation constraints.
* **Acceptance criteria**:
  * Names validated to CSS custom property compatible regex.

### 10.25 Reset selection

* **ID**: GH-025
* **Description**: As a user I can choose a reset or none and have the export reflect that choice.
* **Acceptance criteria**:
  * reset.css omitted and import commented when none selected.

### 10.26 Heading mapping overrides

* **ID**: GH-026
* **Description**: As a user I can override default heading-token mappings.
* **Acceptance criteria**:
  * Overrides persist and survive ratio/base changes (unless user opts to re-sync).

### 10.27 Token prefix/namespace option

* **ID**: GH-027
* **Description**: As a user I can set an optional token prefix applied consistently.
* **Acceptance criteria**:
  * Changing prefix regenerates tokens & utilities with deterministic order.

### 10.28 Copy deterministic hash

* **ID**: GH-028
* **Description**: As a user I can copy a hash summary to integrate in CI.
* **Acceptance criteria**:
  * Hash summary includes artifact names + SHA-256 short forms.

### 10.29 Reduced motion respect

* **ID**: GH-029
* **Description**: As a user with reduced motion preference I see minimal animation.
* **Acceptance criteria**:
  * Non-essential transitions disabled when prefers-reduced-motion: reduce.

### 10.30 Size threshold configuration

* **ID**: GH-030
* **Description**: As a user I can adjust bundle size warning thresholds.
* **Acceptance criteria**:
  * Threshold settings persisted per project or globally (decide: global default, project override).

## 11. Final checklist

All user stories have unique IDs, clear acceptance criteria, and cover token management, utilities, components, docs, exports, performance, accessibility, determinism, privacy, and size governance. Blueprint Mode behaves as dark mode; component exports are strictly opt-in; only selected components and utilities ship. Size indicator, purge simulation, and schema versioning support future extensibility.

## 12. Open questions / assumptions

* Component CSS without docs: assumed allowed when component selected even if docs not exported (confirm). If not, enforce dependency.
* Threshold defaults: assume 25KB minified utilities.css and 8K classes; need empirical adjustment after measuring real output density.
* Migration persistence of backups: stored transiently (not user accessible) — confirm acceptable.
* Gzip size estimation: using heuristic ratio (e.g., 0.28–0.35) until optional web worker compression implemented—confirm acceptable.

Please confirm assumptions or provide adjustments; upon confirmation I can generate GitHub issues for all user stories if desired. Would you like to proceed with issue creation next?
