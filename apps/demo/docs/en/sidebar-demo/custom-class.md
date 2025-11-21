---
title: Custom Class Demo
sidebar_class_name: font-bold text-warning
sidebar_position: 10
---

# Custom Class

This item has custom sidebar classes `font-bold text-warning` applied to it.

Despite being alphabetically second (`custom-class.md`), this page appears **first** in the sidebar because `sidebar_position: 10` is the lowest value.

The sidebar item should appear **bold** with a **warning color** (typically yellow/orange depending on theme).

```yaml
sidebar_class_name: font-bold text-warning
sidebar_position: 10
```
