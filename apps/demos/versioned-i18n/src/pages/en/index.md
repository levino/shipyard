---
title: Versioned i18n Demo
description: Demonstration of shipyard's documentation versioning with internationalization
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Versioned i18n Demo

Welcome to the **Versioned Internationalized Documentation Demo**! This demo showcases shipyard's versioning combined with i18n support.

## What is This Demo?

This demo combines two powerful shipyard features:

1. **Documentation Versioning**: Maintain multiple versions of documentation
2. **Internationalization (i18n)**: Provide documentation in multiple languages

## Features Demonstrated

- **Version Selector**: Switch between v1 and v2 documentation
- **Language Switcher**: Toggle between English and German
- **Combined URLs**: Routes like `/en/docs/v2/installation` or `/de/docs/v1/installation`
- **Localized Content**: Each version has translations for each language

## Available Versions

| Version | Status | Description |
|---------|--------|-------------|
| [v2](/en/docs/v2/) | **Current** | Latest stable release |
| [v1](/en/docs/v1/) | Deprecated | Previous release |

## Available Languages

- 🇬🇧 **English** (current)
- 🇩🇪 [Deutsch](/de/)

## URL Structure

The URL pattern is: `/{locale}/docs/{version}/{page}`

Examples:
- `/en/docs/v2/installation` - English, Version 2, Installation page
- `/de/docs/v1/configuration` - German, Version 1, Configuration page

## Getting Started

1. **Browse the docs**: [v2 Documentation](/en/docs/v2/)
2. **Switch versions**: Use the version selector in the navigation
3. **Change language**: Use the language switcher

## Implementation

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: true },
  },
  integrations: [
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
    }),
  ],
})
```
