---
title: Sidebar Demo Section
sidebar:
  position: 0
  label: Sidebar Demo
  collapsible: true
  collapsed: false
---

# Sidebar Demo

Welcome to the sidebar demo section. This section demonstrates the category metadata features using frontmatter in index.md files.

## Category Configuration

This category is configured with:
- `sidebar.position: 0` - Appears first in the sidebar
- `sidebar.label: "Sidebar Demo"` - Custom label in sidebar
- `sidebar.collapsible: true` - Can be collapsed/expanded
- `sidebar.collapsed: false` - Starts expanded

## Reordering Demo

Notice that the sidebar items below appear in this order:

1. **Custom Class** (position 10) - alphabetically second, displayed first
2. **Fancy Label** (position 30) - alphabetically first, displayed second

This demonstrates that `sidebar.position` controls the order, regardless of file names!

## Available Frontmatter Options

All sidebar-related fields are now grouped under the `sidebar` object:

- `sidebar.position` - Control the order of items in the sidebar
- `sidebar.label` - Override the display label in the sidebar
- `sidebar.className` - Add custom CSS classes to the sidebar item
- `sidebar.collapsible` - Whether the category can be collapsed (default: true)
- `sidebar.collapsed` - Initial collapsed state (default: true)
- `sidebar.customProps` - Arbitrary metadata for custom components
