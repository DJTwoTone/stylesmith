---
mode: "agent"
description: "Generate an Epic PRD including personas, journeys, business requirements, metrics, and scope boundaries."
---

# Epic PRD (Condensed)

## Goal

Produce a strategic, testable Epic-level PRD to guide downstream feature specs.

## Inputs

- Business problem / vision
- Stakeholders & target user segments
- Constraints / strategic goals

## Output Sections

```markdown
# Epic: <Name>

## 1. Executive Summary

## 2. Problem Statement & Opportunity

## 3. Goals & Non-Goals

## 4. Personas & Segments

## 5. Primary User Journeys (happy path + edge cases)

## 6. Business Requirements

## 7. Functional Scope (In / Out)

## 8. Non-Functional Requirements

## 9. Success Metrics (baseline → target)

## 10. Risks & Mitigations

## 11. Dependencies

## 12. Assumptions & Open Questions

## 13. Glossary
```

### Business Requirements Style

- BR-001: [Concise requirement] (Rationale)

### Metrics Examples

- Activation rate, Retention %, Time-to-complete, Error rate

## Instructions

1. Normalize inputs → structured sections.
2. Avoid implementation detail; focus on outcomes & constraints.
3. Surface ambiguity via TODO markers.
4. Ensure each requirement is testable & mapped to a metric where possible.

Source: Adapted from upstream awesome-copilot epic PRD prompt (MIT) – condensed.
