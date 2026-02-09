---
title: Announcement Bar
sidebar:
  position: 5
description: Add a dismissible announcement banner to the top of your site
---

# Announcement Bar

shipyard supports a configurable announcement bar that displays at the top of every page. Users can dismiss it, and the dismissed state is remembered via `localStorage`.

## Configuration

Add the `announcementBar` option to your shipyard config:

```javascript
shipyard({
  // ... other options
  announcementBar: {
    id: 'new-release',
    content: 'shipyard v1.0 is out! <a href="https://example.com/blog/v1-release">Read the announcement</a>',
    backgroundColor: '#4f46e5',
    textColor: '#ffffff',
    isCloseable: true,
  },
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | `'announcement-bar'` | Optional unique identifier used for localStorage persistence. Default is `'announcement-bar'`. |
| `content` | `string` | Required | HTML content to display |
| `backgroundColor` | `string` | — | Custom background color |
| `textColor` | `string` | — | Custom text color |
| `isCloseable` | `boolean` | `true` | Whether users can dismiss the bar |

## Behavior

- When a user dismisses the announcement bar, it stays hidden across page loads using `localStorage`.
- Changing the `id` resets the dismissed state, so users see the new announcement.
- The announcement bar appears above the navigation bar on all pages.
- HTML is supported in the `content` field, allowing you to include links.

## Example

```javascript
shipyard({
  brand: 'My Site',
  title: 'My Site',
  tagline: 'Built with shipyard',
  navigation: { /* ... */ },
  announcementBar: {
    id: 'conference-2026',
    content: 'Join us at DevConf 2026! <a href="https://example.com">Register now</a>',
    backgroundColor: '#059669',
    textColor: '#ffffff',
  },
})
```
