---
title: Versioned Docs Demo
description: Demonstration of shipyard's documentation versioning feature
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Versioned Docs Demo

Welcome to the **Versioned Documentation Demo**! This demo showcases shipyard's documentation versioning feature.

## What is Documentation Versioning?

Documentation versioning allows you to maintain multiple versions of your documentation alongside your software releases. Users can switch between versions to view documentation relevant to their installed version.

## Features Demonstrated

- **Version Selector**: Use the dropdown in the navigation to switch between documentation versions
- **Version Badges**: Stable, deprecated, and unreleased versions are clearly marked
- **Deprecation Notices**: Old versions display warnings encouraging users to upgrade
- **Clean URLs**: Version-specific URLs like `/docs/v2/installation`

## Available Versions

| Version | Status | Description |
|---------|--------|-------------|
| [v2](/docs/v2/index) | **Current** | Latest stable release with all new features |
| [v1](/docs/v1/index) | Deprecated | Previous release, maintenance mode only |

## Getting Started

1. **Browse the docs**: Click on a version above to explore its documentation
2. **Switch versions**: Use the version selector in the navigation bar
3. **Notice the differences**: Each version has its own content and structure

## Implementation

This demo uses:

```javascript
shipyardDocs({
  versions: {
    current: 'v2',
    available: [
      { version: 'v2', label: 'Version 2.0 (Latest)' },
      { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
    ],
    deprecated: ['v1'],
    stable: 'v2',
  },
})
```

## Learn More

Check the [v2 documentation](/docs/v2/index) for comprehensive guides on using shipyard.
