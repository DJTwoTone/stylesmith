---
mode: "agent"
description: "Generate GitHub issues for unmet requirements in a specification file."
tools:
  [
    "codebase",
    "search",
    "github",
    "create_issue",
    "search_issues",
    "update_issue",
  ]
---

# Create Issues From Unmet Spec Requirements (Condensed)

Steps: Parse `${file}` → enumerate REQ-\* → check implementation evidence → compare open issues → create missing one-per requirement.

Issue Body includes: Requirement text, Implementation guidance, Acceptance criteria link, Dependencies.

Source: Adapted from awesome-copilot (MIT) – condensed.
