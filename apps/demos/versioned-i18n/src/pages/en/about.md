---
title: About
description: About this versioned i18n documentation demo
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# About This Demo

This demo application showcases **documentation versioning combined with internationalization** in shipyard.

## Purpose

The versioned-i18n demo demonstrates:

- How to configure multiple documentation versions with i18n
- How the version selector and language switcher work together
- How content is organized by version and language
- The URL structure for versioned, localized documentation

## Technical Details

### Directory Structure

```
docs/
├── v1/
│   ├── en/
│   │   ├── index.md
│   │   ├── installation.md
│   │   └── configuration.md
│   └── de/
│       ├── index.md
│       ├── installation.md
│       └── configuration.md
└── v2/
    ├── en/
    │   ├── index.md
    │   ├── installation.md
    │   ├── configuration.md
    │   └── migration.md
    └── de/
        ├── index.md
        ├── installation.md
        ├── configuration.md
        └── migration.md
```

### Configuration

The configuration combines Astro's i18n with shipyard's versioning:

- `i18n.locales`: Available languages (en, de)
- `versions.current`: The default version shown
- `versions.available`: All versions with labels

## Use Cases

Versioned i18n documentation is ideal for:

- **Global software products**: Different versions in multiple languages
- **International APIs**: Versioned API docs for worldwide developers
- **Enterprise solutions**: Region-specific versioned documentation

## Related

- [Home page](/en/)
- [v2 Documentation](/en/docs/v2/)
- [v1 Documentation](/en/docs/v1/)
- [German version of this page](/de/about)
