---
title: About
description: About this versioned documentation demo
---

# About This Demo

This demo application showcases the **documentation versioning** feature in Docusaurus.

## Purpose

The versioned-docs demo demonstrates:

- How to configure multiple documentation versions
- How the version selector UI works
- How content is organized by version
- How deprecation banners guide users to newer versions

## Technical Details

### Directory Structure

```
docs/                      # Current version (v2)
├── index.md
├── installation.md
├── configuration.md
└── migration.md
versioned_docs/
└── version-1.0/          # Previous version (v1)
    ├── index.md
    ├── installation.md
    └── configuration.md
```

### Configuration

The version configuration in `docusaurus.config.ts`:

- `lastVersion`: The default version shown to users
- `versions`: Configuration for each version (label, banner, badge)
- `banner: 'unmaintained'`: Shows a deprecation warning

## Use Cases

Documentation versioning is essential for:

- **Library authors**: Maintain docs for multiple major versions
- **API providers**: Document each API version separately
- **SaaS products**: Support customers on different plans/releases

## Related

- [Home page](/)
- [v2 Documentation](/docs/)
- [v1 Documentation](/docs/1.0/)
