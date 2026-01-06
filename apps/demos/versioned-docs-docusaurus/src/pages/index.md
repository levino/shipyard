---
title: Versioned Docs Demo
description: Demonstration of documentation versioning with Docusaurus
---

# Versioned Docs Demo

Welcome to the **Versioned Documentation Demo**! This demo showcases Docusaurus's documentation versioning feature.

## What is Documentation Versioning?

Documentation versioning allows you to maintain multiple versions of your documentation alongside your software releases. Users can switch between versions to view documentation relevant to their installed version.

## Features Demonstrated

- **Version Selector**: Use the dropdown in the navigation to switch between documentation versions
- **Version Badges**: Stable, deprecated, and unreleased versions are clearly marked
- **Deprecation Notices**: Old versions display warnings encouraging users to upgrade
- **Clean URLs**: Version-specific URLs like `/docs/1.0/installation`

## Available Versions

| Version | Status | Description |
|---------|--------|-------------|
| [v2](/docs/) | **Current** | Latest stable release with all new features |
| [v1](/docs/1.0/) | Deprecated | Previous release, maintenance mode only |

## Getting Started

1. **Browse the docs**: Click on a version above to explore its documentation
2. **Switch versions**: Use the version selector in the navigation bar
3. **Notice the differences**: Each version has its own content and structure

## Implementation

This demo uses Docusaurus's built-in versioning system:

```javascript
// docusaurus.config.ts
{
  docs: {
    versions: {
      current: {
        label: 'Version 2.0 (Latest)',
        badge: true,
      },
      '1.0': {
        label: 'Version 1.0',
        banner: 'unmaintained',
      },
    },
    lastVersion: 'current',
  },
}
```

## Learn More

Check the [v2 documentation](/docs/) for comprehensive guides on using shipyard.
