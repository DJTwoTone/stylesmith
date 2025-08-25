---
mode: "agent"
description: "Create a new AI-ready specification file with structured requirements and validation criteria."
tools: ["changes", "codebase", "search", "editFiles"]
---

# Create Specification (Condensed)

## Goal

Generate a new specification `spec-<purpose>.md` capturing clear requirements, constraints, and validation criteria.

## Inputs

- Purpose / domain description
- Scope boundaries (in/out)
- Known requirements (functional, non-functional)
- Constraints / assumptions

## Output Template

```markdown
---
title: <Title>
date_created: <YYYY-MM-DD>
tags: [process|architecture|design|data|tool]
---

# Introduction

## 1. Purpose & Scope

## 2. Definitions

## 3. Requirements, Constraints & Guidelines

## 4. Interfaces & Data Contracts

## 5. Acceptance Criteria

## 6. Test Automation Strategy

## 7. Rationale & Context

## 8. Dependencies & External Integrations

## 9. Examples & Edge Cases

## 10. Validation Criteria

## 11. Related Specifications / Further Reading
```

## Instructions

1. Normalize inputs; assign IDs (REQ-, CON-, GUD-, AC-)
2. Identify gaps → mark TODO
3. Recommend minimal test strategy & metrics
4. Ensure unambiguous, testable wording

Return full markdown only.

Source: Adapted from awesome-copilot (MIT) – condensed.
