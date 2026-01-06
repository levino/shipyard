---
title: Sidebar Custom Props Example
sidebar:
  position: 80
  customProps:
    badge: New
    badgeType: success
description: Demonstration of using sidebar.customProps for badges and custom styling
pagination_label: Custom Props
---

# Sidebar Custom Props Example

This page demonstrates the `sidebar.customProps` frontmatter option which allows you to add custom properties to sidebar items, such as badges.

## How It Works

The `sidebar.customProps` field accepts an object with arbitrary key-value pairs. Shipyard supports special properties for common use cases:

### Badge Properties

- `badge` - Text to display in a badge next to the sidebar item
- `badgeType` - Style of the badge (info, success, warning, error, primary, secondary, accent)

## Usage

Add the `sidebar.customProps` property to your frontmatter:

```md
---
title: My New Feature
sidebar:
  customProps:
    badge: New
    badgeType: success
---
```

## This Page's Configuration

This page uses:

```yaml
sidebar:
  customProps:
    badge: New
    badgeType: success
```

Look at the sidebar - you'll see a green "New" badge next to this page's entry!

## Available Badge Types

| Type | Description |
|------|-------------|
| `info` | Blue badge (default) |
| `success` | Green badge |
| `warning` | Yellow/orange badge |
| `error` | Red badge |
| `primary` | Primary theme color |
| `secondary` | Secondary theme color |
| `accent` | Accent theme color |

## Use Cases

Custom props are useful for:

- **New features** - Mark new documentation with a "New" badge
- **Beta features** - Use a warning badge for beta/experimental features
- **Deprecated content** - Mark deprecated pages with an error badge
- **Popular pages** - Highlight frequently accessed pages

## Custom Properties

You can also add any custom property you need:

```yaml
sidebar:
  customProps:
    badge: Beta
    badgeType: warning
    version: "2.0"
    experimental: true
```

Custom properties beyond `badge` and `badgeType` are available in the sidebar entry for custom rendering components.
