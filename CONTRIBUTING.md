# Contributing to StyleSmith

## Workflow
1. Find / create issue (story/work package). Label with: `type`, `epic:E#`, `priority:P#`, `story:GH-0XX`, `status:ready`.
2. Branch: `feature/GH-0XX-short-desc` (or `chore/`, `fix/`).
3. Implement with tests + types + determinism preserved.
4. Run locally: `npm run lint && npm run typecheck && npm test`.
5. Open PR: reference story ID(s); describe determinism/hash impact if any.
6. Ensure CI green. Reviewer checklist: tests, a11y (if UI), performance budget, determinism.

## Commit Conventions
Format: `<type>(scope?): message`
Types: feat, fix, chore, refactor, docs, test, perf, build, ci.

## Determinism Guard
Any change that affects artifact content must mention: `Determinism: affected` with rationale. Add/update snapshot/hash tests.

## Testing
- Unit: domain logic (tokens validation, hashing, size estimation)
- Integration: cross-module flows (token edit → regenerated utilities)
- E2E (Playwright): core user journeys (later phase)

## Accessibility
Keyboard focus, contrast, reduced motion. Use semantic HTML. Prefer ARIA only when necessary.

## Performance
Avoid long synchronous loops in render paths. Debounce heavy generation ≤50ms.

## Privacy
No network calls unless analytics opt-in flag true (future). Keep tokens local.

## Code Style
ESLint + Prettier enforced. No disabled rules without justification.
