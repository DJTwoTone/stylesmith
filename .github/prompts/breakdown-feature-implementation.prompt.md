---
mode: "agent"
description: "Generate an implementation plan for a feature including tasks, architecture touchpoints, and risk mitigation."
---

# Feature Implementation Plan (Condensed)

## Goal

Convert a feature PRD or description into a sequenced, dependency-aware implementation plan.

## Inputs

- Feature PRD (stories, requirements, acceptance criteria)
- Tech stack / repo structure (if given)
- Constraints (performance, security, compliance)

## Output Sections

```markdown
## 1. Summary

## 2. Scope In / Out

## 3. Architecture Impact (modules, services, data models)

## 4. Data & Interfaces (new/changed contracts)

## 5. Task Breakdown

| Task | Description | Files/Areas | Dependencies | Est | Risk |

## 6. Sequence & Dependencies (graph or ordered list)

## 7. Testing Strategy Mapping (req → test type)

## 8. Risk & Mitigation Table

## 9. Open Questions / Assumptions

## 10. Completion Definition (DoD)
```

### Task Granularity

- Aim for 0.5–2 day tasks
- Each task has clear acceptance notes

### Risk Categories

Performance | Security | Data Integrity | Compliance | UX | Operational

### Testing Mapping Example

| Requirement | Risk | Test Type | Notes |

## Instructions

1. Derive minimal viable path first (MVP subset).
2. Identify enabling tasks (schema changes, infra) before dependent tasks.
3. Highlight parallelizable work streams.
4. Mark assumptions explicitly; do not fabricate domain logic.
5. Provide clear DoD including code review, tests, docs updated.

Source: Adapted from upstream awesome-copilot feature implementation prompt (MIT) – condensed.
