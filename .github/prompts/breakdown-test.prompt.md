---
mode: "agent"
description: "Generate comprehensive test strategy, issues, and quality gates for a feature or epic."
---

# Test Planning & Quality Assurance (Condensed)

## Goal

Create a structured test strategy & related issue checklist for the provided scope (feature/epic/spec) covering functional, non-functional, and quality metrics.

## Inputs

- Scope description or spec content
- Tech stack (if provided)
- Risk areas / constraints (optional)

## Process

1. Classify scope & risk (complexity, criticality)
2. Identify test types needed (unit, integration, E2E, performance, security, accessibility, regression)
3. Map requirements → test objectives → acceptance criteria
4. Define quality gates (entry/exit) & metrics
5. Produce issue templates & labeling plan
6. Provide coverage matrix & prioritization

## Output Structure

```markdown
## Test Strategy Overview

## Requirements → Test Objectives Mapping

## Test Types & Rationale

## Test Issues Checklist

## Quality Gates

## Metrics & Targets

## Risk & Mitigation Table

## Tooling & Environment

## Issue Templates
```

### Test Issues Checklist (sample)

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E workflow tests
- [ ] Performance baseline
- [ ] Security & vulnerability scan
- [ ] Accessibility audit
- [ ] Regression suite update

### Quality Gates (examples)

| Gate         | Entry Criteria             | Exit Criteria                  |
| ------------ | -------------------------- | ------------------------------ |
| Dev Complete | All unit tests implemented | 95%+ pass & coverage threshold |
| Pre-Release  | Integration env stable     | No Sev1/Sev2 defects           |

### Metrics

- Line coverage: target % (justify if lower)
- Branch coverage: critical paths >= target
- Defect escape rate
- Performance: P95 latency, throughput
- Security: zero critical vulns

### Issue Template Snippet

```markdown
# Test: <Area>

## Objective

## Scope

## Test Design Techniques

## Test Data

## Execution Steps

## Acceptance Criteria
```

## Instructions

Return ONLY the structured plan; do not invent domain requirements—derive from provided scope. Flag missing info as assumptions.

Source: Adapted from upstream awesome-copilot test breakdown prompt (MIT) – shortened.
