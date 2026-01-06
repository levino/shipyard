---
title: Always Open Section
sidebar:
  position: 1
  label: Always Open
  collapsible: false
  collapsed: false
---

# Always Open Category

This category demonstrates the `collapsible: false` setting.

## Configuration

```yaml
sidebar:
  position: 1
  label: Always Open
  collapsible: false
  collapsed: false
```

## Behavior

When `collapsible: false`:
- The category cannot be collapsed by the user
- Children are always visible in the sidebar
- No toggle control is shown

This is useful for important sections that should always be visible to users.
