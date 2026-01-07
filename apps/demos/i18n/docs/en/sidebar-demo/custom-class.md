---
title: Custom Class Demo
sidebar:
  className: font-bold text-warning
  position: 10
---

# Custom Class

This item has custom sidebar classes `font-bold text-warning` applied to it.

Despite being alphabetically second (`custom-class.md`), this page appears **first** in the sidebar because `sidebar.position: 10` is the lowest value.

The sidebar item should appear **bold** with a **warning color** (typically yellow/orange depending on theme).

```yaml
sidebar:
  className: font-bold text-warning
  position: 10
```
