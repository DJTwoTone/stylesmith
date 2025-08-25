---
mode: "agent"
description: "Create a Feature PRD from an epic summary including user stories, requirements, and acceptance criteria."
---

# Feature PRD (Condensed)

## Goal

Transform an epic context into a complete feature-level PRD ready for design & implementation planning.

## Inputs

- Epic summary / PRD excerpt
- Business goals / target users (if available)
- Constraints & non-functional needs

## Output Sections

```markdown
# Feature: <Name>

## 1. Overview & Goal

## 2. Epic Reference

## 3. Target Users & Personas

## 4. User Stories

## 5. Functional Requirements

## 6. Non-Functional Requirements

## 7. Acceptance Criteria (Given/When/Then or checklist)

## 8. Out of Scope

## 9. Dependencies

## 10. Risks & Mitigations

## 11. Success Metrics

## 12. Open Questions
```

### User Stories Format

As a <persona>, I want <capability> so that <value>.

### Requirements Guidance

- Functional: observable behavior
- Non-Functional: performance, security, accessibility, reliability

### Acceptance Criteria Style

Given [context] When [action] Then [outcome]

## Instructions

1. Extract & normalize information from provided input.
2. Flag missing areas with TODO markers.
3. Do not assume implementation details unless explicitly required.
4. Keep language unambiguous & testable.

Source: Adapted from upstream awesome-copilot feature PRD prompt (MIT) – condensed.
