---
title: About
description: About this versioned documentation demo
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# About This Demo

This demo application showcases the **documentation versioning** feature in shipyard.

## Purpose

The versioned-docs demo demonstrates:

- How to configure multiple documentation versions
- How the version selector UI works
- How content is organized by version
- How deprecation banners guide users to newer versions

## Technical Details

### Directory Structure

```
docs/
├── v1/
│   ├── index.md
│   ├── installation.md
│   └── configuration.md
└── v2/
    ├── index.md
    ├── installation.md
    ├── configuration.md
    └── migration.md
```

### Configuration

The version configuration in `astro.config.mjs`:

- `current`: The default version shown to users
- `available`: All versions with their labels and banners
- `deprecated`: Versions that show a deprecation warning
- `stable`: The officially stable release

## Use Cases

Documentation versioning is essential for:

- **Library authors**: Maintain docs for multiple major versions
- **API providers**: Document each API version separately
- **SaaS products**: Support customers on different plans/releases

## Related

- [Home page](/)
- [v2 Documentation](/docs/v2/index)
- [v1 Documentation](/docs/v1/index)
