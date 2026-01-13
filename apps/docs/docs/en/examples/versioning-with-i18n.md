---
title: Versioning with i18n
sidebar_position: 2
description: Combine documentation versioning with internationalization
---

# Versioning with i18n Example

Combine versioned documentation with multiple languages. Each version can have content in all supported languages.

## What You'll Get

- Two versions: v1 (deprecated) and v2 (current)
- Two languages: English (default) and German
- Version selector and language switcher in navbar
- URLs like `/en/docs/v2/installation` and `/de/docs/v1/configuration`
- Deprecation warning banner on v1 pages in all languages

## Files to Create/Modify

### 1. astro.config.mjs

```javascript
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  site: 'https://your-site.com',
  redirects: {
    '/': {
      status: 302,
      destination: 'en',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs/v2/',
        },
      },
      title: 'My Project',
      brand: 'My Brand',
    }),
    shipyardDocs({
      // Version configuration
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

### 2. src/content.config.ts

```typescript
import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2'],
    fallbackVersion: 'v2',
  }),
)

export const collections = { docs }
```

### 3. Directory Structure

The key insight is that **version comes before locale** in the directory structure:

```
your-project/
├── astro.config.mjs
├── src/
│   ├── content.config.ts
│   └── pages/
│       ├── en/
│       │   ├── index.astro    # English homepage
│       │   └── about.astro    # English about page
│       └── de/
│           ├── index.astro    # German homepage
│           └── about.astro    # German about page
└── docs/
    ├── v2/
    │   ├── en/
    │   │   ├── index.md
    │   │   ├── installation.md
    │   │   └── configuration.md
    │   └── de/
    │       ├── index.md
    │       ├── installation.md
    │       └── configuration.md
    └── v1/
        ├── en/
        │   ├── index.md
        │   └── installation.md
        └── de/
            ├── index.md
            └── installation.md
```

### 4. Sample Content Files

**docs/v2/en/index.md**
```markdown
---
title: Welcome
sidebar_position: 1
---

# Welcome to Version 2.0

This is the latest version of the documentation.

## What's New in v2

- New feature A
- Improved feature B
- Better internationalization support

## Getting Started

See [Installation](./installation) to get started.
```

**docs/v2/de/index.md**
```markdown
---
title: Willkommen
sidebar_position: 1
---

# Willkommen bei Version 2.0

Dies ist die neueste Version der Dokumentation.

## Was ist neu in v2

- Neue Funktion A
- Verbesserte Funktion B
- Bessere Internationalisierungsunterstützung

## Erste Schritte

Siehe [Installation](./installation) für die ersten Schritte.
```

**docs/v2/en/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Requirements

- Node.js 18+
- npm or yarn

## Install

\`\`\`bash
npm install your-package@latest
\`\`\`
```

**docs/v2/de/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Voraussetzungen

- Node.js 18+
- npm oder yarn

## Installieren

\`\`\`bash
npm install your-package@latest
\`\`\`
```

**docs/v1/en/index.md**
```markdown
---
title: Welcome
sidebar_position: 1
---

# Welcome to Version 1.0

This documentation covers version 1.0.

## Getting Started

See [Installation](./installation) to get started.
```

**docs/v1/de/index.md**
```markdown
---
title: Willkommen
sidebar_position: 1
---

# Willkommen bei Version 1.0

Diese Dokumentation behandelt Version 1.0.

## Erste Schritte

Siehe [Installation](./installation) für die ersten Schritte.
```

## URL Patterns

The URL structure combines locale, docs path, and version:

```
/[locale]/docs/[version]/[...slug]
```

### URLs Generated

After building, you'll have these URL patterns:

| URL | Content |
|-----|---------|
| `/en/docs/` | Redirects to `/en/docs/v2/` |
| `/de/docs/` | Redirects to `/de/docs/v2/` |
| `/en/docs/v2/` | English v2 welcome page |
| `/de/docs/v2/` | German v2 welcome page |
| `/en/docs/v2/installation` | English v2 installation guide |
| `/de/docs/v2/installation` | German v2 installation guide |
| `/en/docs/v1/` | English v1 welcome page (deprecated banner) |
| `/de/docs/v1/` | German v1 welcome page (deprecated banner) |
| `/en/docs/latest/` | Alias for `/en/docs/v2/` |
| `/de/docs/latest/` | Alias for `/de/docs/v2/` |

## UI Behavior

### Language Switcher

The language switcher appears in the navbar. When switching languages:
- The version is preserved
- The page slug is preserved
- Example: `/en/docs/v2/installation` -> `/de/docs/v2/installation`

### Version Selector

The version selector appears in the navbar. When switching versions:
- The language is preserved
- The page slug is preserved (if it exists in the target version)
- Example: `/de/docs/v2/installation` -> `/de/docs/v1/installation`

### Combined Switching

Both controls work independently. Users can:
1. Switch language: `/en/docs/v2/installation` -> `/de/docs/v2/installation`
2. Then switch version: `/de/docs/v2/installation` -> `/de/docs/v1/installation`

## Important Notes

1. **Directory order matters**: The structure is `docs/[version]/[locale]/[...slug]`, not `docs/[locale]/[version]/[...slug]`

2. **Content in all locales**: Each version should have content in all supported languages. The deprecation banner appears in all languages for deprecated versions.

3. **Navigation links**: The `href` values in navigation should not include the locale prefix - shipyard handles this automatically.

4. **i18n fallback**: If using Astro's i18n fallback feature, note that it may conflict with explicitly generated redirect pages. Consider disabling fallback if all locales have complete content.

## Next Steps

- See [Basic Versioning](./basic-versioning) for a simpler setup without i18n
- See [Documentation Versioning Guide](../guides/versioning) for advanced configuration options
- See [Migrating to Versioned Docs](../guides/migration-to-versioned) if you have existing documentation
