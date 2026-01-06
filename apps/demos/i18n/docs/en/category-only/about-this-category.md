---
title: About This Category
sidebar:
  position: 1
---

# About This Category

This page is inside a category where the index.md has `render: false`.

## What does render: false mean?

- The category **appears in the sidebar** as a grouping label
- The category label is **not clickable** (no href)
- **No page is generated** at the category URL (returns 404)
- This is useful for organizing content without requiring a landing page

## Parent Category Configuration

The parent index.md has:

```yaml
render: false
sidebar:
  position: 2
  label: Category Only
  collapsible: true
  collapsed: true
```

Note: Files with `render: false` must not contain any content below the frontmatter.
