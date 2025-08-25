---
mode: "agent"
description: "Analyze repository & docs to produce a project workflow blueprint (dev, review, release, quality gates)."
tools: ["codebase", "search"]
---

# Project Workflow Analysis Blueprint (Condensed)

## Goal

Derive an explicit, optimized development workflow model from existing repository structure & documentation.

## Inputs

- Repo structure & notable dirs (src/, tests/, docs/)
- Existing docs (README, CONTRIBUTING, PRD/specs)
- Branching / CI hints (if any)

## Analysis Dimensions

1. Branching & Versioning
2. Work Item Lifecycle (idea → issue → implementation → review → release)
3. Code Review Standards
4. Testing Strategy & Quality Gates
5. Release / Deployment Signals
6. Documentation & Knowledge Capture
7. Tooling & Automation Opportunities

## Output Structure

```markdown
# Project Workflow Blueprint

## 1. Overview

## 2. Current Observations

## 3. Standardized Workflow Stages

## 4. Roles & Responsibilities

## 5. Branch & Commit Conventions

## 6. Quality Gates & Checks

## 7. Automation & Tooling Recommendations

## 8. Risks & Bottlenecks

## 9. Improvement Roadmap (Phased)
```

### Quality Gates Example

| Stage | Required Artifacts | Criteria |

## Instructions

1. Infer patterns from filenames, directory layout, existing prompt inventory
2. List assumptions where evidence absent
3. Recommend incremental improvements (low → high effort)
4. Avoid speculative tech choices without hints

Source: Custom local blueprint generator.
