---
mode: "agent"
description: "Generate standardized Git branch names following Git Flow + semantic conventions."
---

# Git Flow Branch Creator (Condensed)

## Goal

Produce a recommended branch name (and alternates) based on task metadata using Git Flow + semantic patterns.

## Inputs

- Work type (feature / bugfix / hotfix / release / chore / docs / refactor)
- Short summary (kebab-case friendly)
- Issue / ticket ID (optional)
- Scope (module / component / domain)

## Naming Rules

Format: `<type>/<scope?>/<issue?>-<summary>` (omit empty segments)
Constraints:

- Lowercase letters, digits, hyphens only
- Max length 60 chars
- Collapse multiple hyphens
- No leading/trailing hyphen

Types:

- feature | bugfix | hotfix | release | chore | docs | refactor | test

## Validation Checklist

- Unique vs existing remote branches (if list provided)
- Avoid ambiguous abbreviations
- Summary starts with verb? (optional improvement)

## Output Example

```text
Primary: feature/auth/1234-password-reset
Alternates:
- feature/auth/password-reset
- feature/1234-password-reset
Rationale: Includes domain + issue traceability.
```

## Instructions

1. Normalize inputs (slugify scope & summary)
2. Assemble primary pattern with max context
3. Generate 2–3 alternates removing elements progressively
4. Provide rationale + any lint warnings

Return only branch suggestions section if all inputs present; else request missing fields.

Source: Local simplified generator.
