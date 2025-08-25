---
mode: "agent"
description: "Update an existing specification with new or changed requirements while preserving structure."
tools: ["changes", "codebase", "search", "editFiles"]
---

# Update Specification (Condensed)

## Goal

Amend `${file}` incorporating new requirements / changes while maintaining consistency & traceability.

## Process

1. Parse existing spec sections
2. Identify diff inputs (added, modified, deprecated requirements)
3. Update IDs (never reuse removed IDs; mark deprecated)
4. Sync acceptance criteria & test strategy
5. Update dependencies & rationale
6. Append changelog summary

## Output

Provide updated spec content (only changed sections if large; else full file) plus a concise change log:

```markdown
## Changelog (YYYY-MM-DD)

- Added: REQ-010 ...
- Modified: REQ-004 (clarified latency requirement)
- Deprecated: REQ-002 (replaced by REQ-009)
```

## Validation Checklist

- All new requirements have ACs
- No orphan ACs
- Consistent terminology

Source: Adapted from awesome-copilot (MIT) – condensed.
