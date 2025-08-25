---
mode: "agent"
description: "Generate a curated blueprint of code exemplars categorized for reuse and standards enforcement."
---

# Code Exemplars Blueprint Generator (Condensed)

## Goal

Create a categorized set of high-quality, idiomatic code exemplars to guide consistent implementation.

## Inputs

- Repository structure / key domains
- Target languages / frameworks
- Quality or architectural standards (if provided)

## Categories (example)

- API Routes / Controllers
- Data Models / ORM Entities
- Services / Use Cases
- Utilities & Helpers
- Validation / Error Handling
- Configuration / Bootstrapping
- Tests (unit, integration, E2E)

## Process

1. Discover representative files (search for patterns, naming conventions)
2. Evaluate candidates (clarity, cohesion, adherence to standards)
3. Extract minimal illustrative snippets (avoid confidential / large blocks)
4. Annotate rationale & usage guidance
5. Identify gaps → recommend exemplar to author

## Output Structure

````markdown
# Code Exemplars Blueprint

## 1. Overview & Goals

## 2. Selection Criteria

## 3. Category Index

## 4. Exemplars

### <Category>

#### <Exemplar Name>

Snippet:

```lang
[Representative snippet]
```
````

Usage Guidance: ...
Anti-Patterns Avoided: ...

#### Quality Notes

## 5. Gaps & Recommendations

## 6. Maintenance Guidelines

```

## Quality Criteria
- Idiomatic, concise, domain-representative
- Demonstrates error handling & boundary cases where relevant
- Free of secrets / proprietary business logic

## Maintenance Guidelines
- Version with date & commit hash
- Replace outdated patterns proactively

Source: Adapted from upstream awesome-copilot blueprint prompt (MIT) – condensed.
```
