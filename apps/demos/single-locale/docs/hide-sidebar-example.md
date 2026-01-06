---
title: Full-Width Page Example
description: This page demonstrates the hide_sidebar frontmatter option
sidebar:
  position: 63
hide_sidebar: true
pagination_label: Full Width Page
---

# Full-Width Page Example

This page uses `hide_sidebar: true` in its frontmatter, which removes the sidebar navigation and allows the content to span the full width of the page.

## Use Cases

The `hide_sidebar` option is useful for:

- Landing pages within the docs section
- Special content pages that need more horizontal space
- Pages with wide tables, diagrams, or code blocks
- Print-friendly documentation pages

## How It Works

When `hide_sidebar: true` is set:

1. The left sidebar navigation is hidden
2. The content area expands to use the full width
3. The page is still accessible via direct URL
4. The page still appears in pagination (prev/next links)

## Configuration

Add this to your frontmatter:

```yaml
hide_sidebar: true
```

The sidebar will be hidden for this page only. Other pages will still show the sidebar normally.

## Custom Pagination Label

This page also demonstrates `pagination_label`, which customizes how this page appears in pagination links. Instead of showing the full title "Full-Width Page Example", it shows "Full Width Page" when used as a pagination link.

```yaml
pagination_label: Full Width Page
```
