---
mode: "agent"
description: "Draft a pull request from a specification aligning changes to documented requirements."
tools:
  [
    "codebase",
    "search",
    "github",
    "create_pull_request",
    "get_pull_request_diff",
    "update_pull_request",
  ]
---

# Create Pull Request From Spec (Condensed)

Ensures title, summary mapping requirements → changes, and links spec file. Avoid duplicate PRs.

Source: Adapted from awesome-copilot (MIT) – condensed.
