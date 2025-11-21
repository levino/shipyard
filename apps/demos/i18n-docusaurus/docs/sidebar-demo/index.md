---
title: Sidebar Demo Section
sidebar_position: 0
---

# Sidebar Demo

Welcome to the sidebar demo section. This section demonstrates the Docusaurus sidebar frontmatter options.

## Reordering Demo

Notice that the sidebar items below appear in this order:

1. **Custom Class** (position 10) - alphabetically second, displayed first
2. **Fancy Label** (position 30) - alphabetically first, displayed second

This demonstrates that `sidebar_position` controls the order, regardless of file names!

## Available Frontmatter Options

- `sidebar_position` - Control the order of items in the sidebar
- `sidebar_label` - Override the display label in the sidebar
- `sidebar_class_name` - Add custom CSS classes to the sidebar item

## Why No `sidebar_custom_props`?

Unlike Docusaurus, Shipyard does not currently support `sidebar_custom_props`. In Docusaurus, custom props are used for features like badges ("New", "Beta", "Deprecated") or other metadata that can be rendered by custom sidebar components.

Since Shipyard uses a standard sidebar component that doesn't consume custom props, supporting this feature would require users to create their own sidebar component. We may add this feature in a future version when we have a clearer use case and implementation plan.

For now, you can achieve similar visual effects using `sidebar_class_name` with Tailwind/DaisyUI utility classes.
