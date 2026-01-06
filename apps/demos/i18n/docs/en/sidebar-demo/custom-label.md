---
title: Custom Label Demo
sidebar:
  label: Fancy Label
  position: 30
---

# Custom Label

This item has a custom sidebar label defined in frontmatter.

Despite being alphabetically first (`custom-label.md`), this page appears **second** in the sidebar because it has a higher `sidebar.position` value (30) than Custom Class (10).

```yaml
sidebar:
  label: Fancy Label
  position: 30
```
