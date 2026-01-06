---
title: Manual Last Update Example
description: Demonstrating the last_update frontmatter option for manual overrides
sidebar:
  position: 64
last_update:
  date: 2025-01-01
  author: Documentation Team
---

# Manual Last Update Example

This page demonstrates how to manually specify the last update date and author using the `last_update` frontmatter option.

## Configuration

Instead of relying on git metadata, you can manually specify when a page was last updated:

```yaml
last_update:
  date: 2025-01-01
  author: Documentation Team
```

## Use Cases

Manual last update is useful when:

- The git history doesn't reflect meaningful content changes
- You want to show a specific review date
- The content was migrated from another system
- You want to attribute updates to a team rather than an individual

## Priority

The `last_update` object has lower priority than the individual override fields:

1. `last_update_time` (highest priority)
2. `last_update.date`
3. Git metadata (fallback)

Similarly for authors:

1. `last_update_author` (highest priority)
2. `last_update.author`
3. Git metadata (fallback)

## Visibility

The last update information will only be visible if you have enabled:

- `showLastUpdateTime: true` in your docs configuration
- `showLastUpdateAuthor: true` in your docs configuration
