description: 'ReactJS development standards and best practices'
applyTo: '**/\*.jsx, **/_.tsx, \*\*/_.js, **/\*.ts, **/_.css, \*\*/_.scss'

# StyleSmith Engineering Instructions (React + TypeScript)

These instructions extend general React best practices with StyleSmith's product requirements (see PRD v1.2.0). They are the authoritative guide for implementation priorities, acceptance criteria alignment, determinism guarantees, performance budgets, accessibility, and privacy constraints. All contributors MUST read this before shipping changes that affect token generation, utilities, exports, hashing, or size indicators.

## Priority Legend

We adopt PRD priority tiers:

- P0: Must exist & meet acceptance criteria before a release can be tagged.
- P1: Important for v1 experience; can follow immediately after all related P0s stabilize.
- P2: Nice-to-have / forward-looking; never blocks earlier priority QA.

When conflicts arise, lower priority work cannot regress a shipped P0 acceptance metric.

## Core Product Tenets

1. Deterministic outputs (byte-identical given unchanged config & schema) – foundation for CI hash validation.
2. Local-first & privacy-safe (no network I/O unless explicit analytics opt-in; never transmit token values / CSS).
3. Accessibility baked-in (WCAG 2.2 AA minimum across UI + generated color contrast indicators).
4. Performance transparency (live size metrics, thresholds, warnings, purge simulation) without compromising determinism.
5. Minimal, intentional surface (only selected utilities/components exported; no hidden generation).

Non‑negotiables: ordering determinism, performance budgets, accessibility focus states, exclusion of app-only visuals from exports.

## Project Context

- Latest React version (React 19+)
- TypeScript for type safety (when applicable)
- Functional components with hooks as default
- Follow React's official style guide and best practices
- Use modern build tools (Vite, Create React App, or custom Webpack setup)
- Implement proper component composition and reusability patterns
- Local-first persistence via IndexedDB (LocalForage) only
- Pure/stateless core generation functions for tokens/utilities/components to enable hashing & incremental recompute
- Deterministic stable JSON stringify (sorted keys) + SHA-256 hashing for artifact verification

## StyleSmith-Specific Functional Domains & Guidelines

### 1. Token Management (P0)

Responsibilities: create/edit/delete, validation, type scale generation, color contrast, paste import, prefix/namespace, heading mapping overrides, optional dark (Blueprint) variant.
Implementation guidelines:

- Store tokens in a structured, schema-versioned object: `{ meta, color, spacing, typography, radius, shadow, ... }` (extensible). Avoid arrays for deterministic ordering—use ordered arrays only if their order is stable & enforced; otherwise normalize into key-sorted maps before generation.
- Provide pure helpers: `generateTypeScale(base:number, ratio:number, steps:Range)`, `evaluateContrast(fg, bg): ContrastResult`.
- Paste import: parse `:root { --foo-bar: value; }` blocks with ≥95% success. Return structured result: `{ imported: Token[], errors: { line:number; name:string; reason:string }[] }`.
- Validation: enforce CSS custom property naming regex `^--[a-z0-9]([a-z0-9-]*[a-z0-9])?$` after applying optional prefix.
- Heading mapping overrides persist separate from computed scale; supply `resyncHeadings()` to intentionally reapply.
- Blueprint Mode tokens allow dual-set strategy: either `@media (prefers-color-scheme: dark)` or `.blueprint &` variant class strategy (configurable later). Keep layering deterministic.

### 2. Utilities Generation (P0)

Responsibilities: toggle families, responsive & state variants, deterministic ordering, size stats, purge simulation.
Guidelines:

- Core generation order: tokens -> base utilities -> variant-expanded utilities (breakpoints first, then states) -> component recipes -> docs extras.
- Deterministic sort keys: `[familyName, baseClass, variantKind, variantValue]`.
- Only generate selected families; produce zero classes for deselected ones (verified in tests).
- Size estimator: incremental update only for changed families (avoid full regen). Provide metrics: `classCount`, `rawBytes`, `minBytesEst`, `gzipBytesEst` (heuristic ratio 0.28–0.35; keep ratio constant per session for consistency).
- Purge simulation lists each currently selected family with removable estimated bytes if deselected.

### 3. Component Recipes (P1)

Minimal CSS recipes (Buttons, Forms, Modals, Tabs, Tables). Only output selected components. JS demo (≤2KB gz) loaded conditionally and tree-shake friendly (dynamic import) only if docs + interactive components are selected.

### 4. Documentation & Style Sheet (P1)

- Live documentation view updates within 100ms token edit budget.
- Printable export: ensure print styles exclude interactive-only or gridline visuals.
- Blueprint toggle sync: system preference default, user override persisted.

### 5. Export System (P0)

Artifacts (conditional): `style.css` (imports), `tokens.css`, `utilities.css`, `reset.css` (optional), `style.bundle.css` (optional minified inlined), `docs/` directory (optional), README, hash summary.
Rules:

- Omit unselected components & families entirely.
- Keep import order fixed. Example baseline: tokens -> reset? -> utilities -> components -> docs extras.
- Bundle minifier must preserve ordering & avoid reformatting that destabilizes hashing beyond whitespace normalization strategy (document any canonicalization). Hashing performed pre-zip and revalidated after zip creation.
- Copy-to-clipboard operations must use same in-memory string used for zip packaging.

### 6. Determinism & Hashing (P0)

- Provide single function `computeArtifactHashes(artifacts: Record<string,string>): HashSummary` that sorts artifact names lexicographically before hash aggregation.
- Hash algorithm: SHA-256; display 8–12 char short forms for UI, store full digest for CI.
- No non-deterministic inputs (timestamps, random IDs) inside exported CSS; capture createdAt/updatedAt only in project metadata, not in artifacts.
- Unit test: regenerating with unchanged config yields identical digests.

### 7. Persistence & Schema Versioning (P0)

- Schema shape: `{ id, name, schemaVersion, tokens, utilitiesConfig, componentsSelection, exportOptions, createdAt, updatedAt }`.
- Migration pipeline: `migrateProject(project, currentVersion): { project:New; summary:{changed:number} }`.
- Show migration summary UI; keep transient backup until user confirms.

### 8. Performance Budgets (P0/P1)

Budgets to assert via tests / perf harness:

- Token edit -> preview regen < 100ms p95.
- utilities.css generation at 8K classes ≤ 300ms (mid-tier baseline). CI perf test may emulate by synthetic generation; enforce upper bound with threshold test (allow slack margin +10%).
- Size indicator update < 150ms after toggle.
- No main thread blocking task > 50ms in routine interactions (monitor Long Task API in dev build & surface warnings in console behind flag).

### 9. Accessibility (P0)

- WCAG 2.2 AA: focus rings with ≥3:1 contrast, keyboard traversal order logical, Blueprint Mode contrast validated.
- Color token editor shows AA/AAA indicators for normal & large text; recompute in <100ms.
- Respect `prefers-reduced-motion: reduce` – disable non-essential animations.

### 10. Size Governance (P1)

- Default warning thresholds: utilities.css > 25KB minified OR > 8K classes. Configurable threshold (global default + per project override). Persist overrides.
- Display: class count, raw, minified est, gzip est. Warning state triggers accessible status alert.

### 11. Privacy & Analytics (P2)

- No analytics events emitted before explicit opt-in.
- Event payload MUST exclude token names/values and CSS content; only high-level event names + hashed anonymous device id (resettable) post opt-in.
- Provide audit helper that enumerates attempted outbound network calls in dev to ensure compliance.

### 12. Blueprint Mode (Dark Mode) (P0 for token dual-set, UI toggle P1)

- Implementation supports user override storage (localStorage or IndexedDB key). Override supersedes system preference until reset.
- Generated CSS: ensure dark tokens scoping strategy does not alter ordering determinism (choose one strategy and document).

### 13. App-Only Visuals Exclusion (P1)

- Any scaffolding styles (gridlines, sketch borders) namespaced under `.app-only` or `[data-app-visual]` and excluded from export pipelines.
- Export tests assert absence of those selectors.

### 14. Reduced Motion (P0)

- Gate animations with `@media (prefers-reduced-motion: no-preference)` or runtime `if (!reducedMotion)` checks.

### 15. Error Handling & Validation (P0)

- Token validation errors: include token name, invalid value, expected pattern; displayed inline; blocks save.
- Paste import errors: aggregated list with line references.

### 16. Naming & Unicode (P0)

- Enforce standardized lower-case hyphenated custom property names (after prefix) to avoid cross-platform inconsistencies.
- Provide sanitization & conflict resolution (auto-suffix strategy) suggestions before save.

### 17. Hash Summary Copy (P1)

- Provide copy action output sample:

```
tokens.css  a1b2c3d4
utilities.css e5f67890
style.bundle.css 11223344
```

### 18. Configuration Surfaces

- Keep user-facing config minimal; advanced flags behind internal feature guard until validated.

## Modern React & TypeScript Practices (Retained Baseline)

The following general guidelines (original content retained & extended) still apply:

## Development Standards

### Architecture

- Use functional components with hooks as the primary pattern
- Implement component composition over inheritance
- Organize components by feature or domain for scalability
- Separate presentational and container components clearly
- Use custom hooks for reusable stateful logic
- Implement proper component hierarchies with clear data flow

### TypeScript Integration

- Use TypeScript interfaces for props, state, and component definitions
- Define proper types for event handlers and refs
- Implement generic components where appropriate
- Use strict mode in `tsconfig.json` for type safety
- Leverage React's built-in types (`React.FC`, `React.ComponentProps`, etc.)
- Create union types for component variants and states

### Component Design

- Follow the single responsibility principle for components
- Use descriptive and consistent naming conventions
- Implement proper prop validation with TypeScript or PropTypes
- Design components to be testable and reusable
- Keep components small and focused on a single concern
- Use composition patterns (render props, children as functions)

### State Management

- Use `useState` for local component state
- Implement `useReducer` for complex state logic
- Leverage `useContext` for sharing state across component trees
- Consider external state management (Redux Toolkit, Zustand) for complex applications
- Implement proper state normalization and data structures
- Use React Query or SWR for server state management

### Hooks and Effects

- Use `useEffect` with proper dependency arrays to avoid infinite loops
- Implement cleanup functions in effects to prevent memory leaks
- Use `useMemo` and `useCallback` for performance optimization when needed
- Create custom hooks for reusable stateful logic
- Follow the rules of hooks (only call at the top level)
- Use `useRef` for accessing DOM elements and storing mutable values

### Styling

- Use CSS Modules, Styled Components, or modern CSS-in-JS solutions
- Implement responsive design with mobile-first approach
- Follow BEM methodology or similar naming conventions for CSS classes
- Use CSS custom properties (variables) for theming
- Implement consistent spacing, typography, and color systems
- Ensure accessibility with proper ARIA attributes and semantic HTML

### Performance Optimization

- Use `React.memo` for component memoization when appropriate
- Implement code splitting with `React.lazy` and `Suspense`
- Optimize bundle size with tree shaking and dynamic imports
- Use `useMemo` and `useCallback` judiciously to prevent unnecessary re-renders
- Implement virtual scrolling for large lists
- Profile components with React DevTools to identify performance bottlenecks
- Maintain deterministic output functions free of Date/Math.random side effects.
- Prefer structural sharing & diff-based regeneration (only regenerate affected utility families).

### Data Fetching

- Use modern data fetching libraries (React Query, SWR, Apollo Client)
- Implement proper loading, error, and success states
- Handle race conditions and request cancellation
- Use optimistic updates for better user experience
- Implement proper caching strategies
- Handle offline scenarios and network errors gracefully
- StyleSmith note: initial versions have minimal remote data; ensure data layer abstractions keep analytics (opt-in) isolated.

### Error Handling

- Implement Error Boundaries for component-level error handling
- Use proper error states in data fetching
- Implement fallback UI for error scenarios
- Log errors appropriately for debugging
- Handle async errors in effects and event handlers
- Provide meaningful error messages to users

### Forms and Validation

- Use controlled components for form inputs
- Implement proper form validation with libraries like Formik, React Hook Form
- Handle form submission and error states appropriately
- Implement accessibility features for forms (labels, ARIA attributes)
- Use debounced validation for better user experience
- Handle file uploads and complex form scenarios

### Routing

- Use React Router for client-side routing
- Implement nested routes and route protection
- Handle route parameters and query strings properly
- Implement lazy loading for route-based code splitting
- Use proper navigation patterns and back button handling
- Implement breadcrumbs and navigation state management

### Testing

- Write unit tests for components using React Testing Library
- Test component behavior, not implementation details
- Use Jest for test runner and assertion library
- Implement integration tests for complex component interactions
- Mock external dependencies and API calls appropriately
- Test accessibility features and keyboard navigation
- Add determinism tests: repeated generation yields identical hashes for unchanged config.
- Add performance budget tests (synthetic) that fail fast if generation time thresholds exceeded.
- Add snapshot tests only for stable artifacts (tokens.css, utilities.css) after determinism harness validated.
- Include contrast evaluation unit tests for representative color pairs (AA / AAA pass/fail cases).
- Add export pipeline test verifying exclusion of app-only visuals.

### Security

- Sanitize user inputs to prevent XSS attacks
- Validate and escape data before rendering
- Use HTTPS for all external API calls
- Implement proper authentication and authorization patterns
- Avoid storing sensitive data in localStorage or sessionStorage
- Use Content Security Policy (CSP) headers

### Accessibility

- Use semantic HTML elements appropriately
- Implement proper ARIA attributes and roles
- Ensure keyboard navigation works for all interactive elements
- Provide alt text for images and descriptive text for icons
- Implement proper color contrast ratios
- Test with screen readers and accessibility tools
- Provide focus outlines that meet ≥3:1 contrast; never suppress default outline without replacement.
- Respect reduced motion; test by forcing media query in unit/e2e tests.

## Implementation Process

1. Plan component architecture and data flow
2. Set up project structure with proper folder organization
3. Define TypeScript interfaces and types
4. Implement core components with proper styling
5. Add state management and data fetching logic
6. Implement routing and navigation
7. Add form handling and validation
8. Implement error handling and loading states
9. Add testing coverage for components and functionality
10. Optimize performance and bundle size
11. Ensure accessibility compliance
12. Add documentation and code comments
13. Validate determinism & performance budgets (hash & timing tests)
14. Verify size indicator accuracy (class & byte estimates within ±5% target)
15. Confirm privacy constraints (no unsolicited network calls) prior to release

## Additional Guidelines

- Follow React's naming conventions (PascalCase for components, camelCase for functions)
- Use meaningful commit messages and maintain clean git history
- Implement proper code splitting and lazy loading strategies
- Document complex components and custom hooks with JSDoc
- Use ESLint and Prettier for consistent code formatting
- Keep dependencies up to date and audit for security vulnerabilities
- Implement proper environment configuration for different deployment stages
- Use React Developer Tools for debugging and performance analysis
- Keep generation logic side-effect free; orchestrators compose pure functions.
- Document schema version changes & provide migration tests.
- Maintain a CHANGELOG with sections: Added, Changed, Fixed, Performance, Security.

## Common Patterns

- Higher-Order Components (HOCs) for cross-cutting concerns
- Render props pattern for component composition
- Compound components for related functionality
- Provider pattern for context-based state sharing
- Container/Presentational component separation
- Custom hooks for reusable logic extraction
- Deterministic build pipeline pattern: pure generation hooks (`useTokens()`, `useUtilities()`) feeding memoized selectors.

## Release Readiness Checklist (Derivable from PRD)

P0 Gate Items:

- [ ] Token CRUD + validation + type scale + contrast badges
- [ ] Utilities generation toggles + variants + deterministic ordering
- [ ] Export system (artifacts, hashing, copy) deterministic
- [ ] Performance budgets met (latency, generation times)
- [ ] Accessibility WCAG 2.2 AA baseline
- [ ] Local persistence + schema versioning + migrations
- [ ] App-only visuals excluded from exports
- [ ] Reduced motion respected

P1 (post-stable P0): Components, Docs export, Size warning thresholds & simulation, Hash summary copy, Blueprint Mode UI refinements.

P2: Analytics opt-in pipeline.

Any regression of a satisfied P0 acceptance criterion blocks release tagging.

## Security & Privacy Notes

- Strict Content-Security-Policy recommended (no remote script sources outside allowed list when analytics added).
- All analytics code must be dynamically loaded only after opt-in.

## Future-Proofing

- Virtualization strategy placeholder for token tables > 300 entries.
- Worker offloading candidate: gzip estimation (future). Current heuristic stable constant for determinism.

## Glossary

- Deterministic: same inputs (config + schema version) → identical artifact bytes & hash.
- Artifact: any exported file (tokens.css, utilities.css, etc.).
- Family: set of related utility classes (e.g., spacing, color, typography).
- Variant: responsive or state prefix addition (e.g., `md:`, `hover:`).

End of StyleSmith-specific instructions.

## Documentation Coverage (Code Explanations)

All `src/**/*.{ts,tsx}` files require a mirrored markdown explanation in `docs/code-explanations/src/...<file>.md` containing: Purpose, High-Level Role, Imports, Exports, Edge Cases, Change Risk (minimum). Each doc must include a `<!-- source-hash: <sha256> -->` comment reflecting the current source file content. Use `npm run doc:stubs` to create missing stubs, `npm run doc:hash:update` after code changes, and `npm run doc:check` (CI-enforced) to validate coverage & hash consistency. Any code change altering behavior/API without matching doc update should block merge.
