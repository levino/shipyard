---
title: '@levino/shipyard-docs'
sidebar:
  position: 4
description: Documentation plugin for shipyard with automatic sidebar and pagination
---

# @levino/shipyard-docs

The docs package provides documentation features for shipyard including automatic sidebar generation, pagination between pages, and git metadata display.

## Installation

```bash
npm install @levino/shipyard-docs
```

Requires `@levino/shipyard-base` to be installed and configured.

### Tailwind Configuration

shipyard uses Tailwind CSS 4, which uses a CSS-based configuration approach. For detailed setup instructions, see the [Tailwind CSS Setup guide](../guides/tailwind-setup).

## Quick Start

### 1. Configure Astro

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      brand: 'My Site',
      title: 'My Site',
      tagline: 'Documentation',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
      },
    }),
    shipyardDocs(),
  ],
})
```

### 2. Set Up Content Collection

Create `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))

export const collections = { docs }
```

### 3. Create Documentation

Add markdown files to the `docs/` directory:

```markdown
---
title: Getting Started
sidebar:
  position: 1
---

# Getting Started

Your documentation content...
```

That's it! Your documentation is now available at `/docs`.

---

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routeBasePath` | `string` | `'docs'` | Base URL path for documentation |
| `collectionName` | `string` | Same as `routeBasePath` | Name of the content collection |
| `editUrl` | `string` | — | Base URL for "Edit this page" links |
| `showLastUpdateTime` | `boolean` | `false` | Show last update timestamp from git |
| `showLastUpdateAuthor` | `boolean` | `false` | Show last update author from git |
| `versions` | `VersionConfig` | — | Enable multi-version documentation ([see Versioning](#versioning)) |
| `llmsTxt` | `LlmsTxtConfig` | — | Enable llms.txt generation ([see LLMs.txt](#llmstxt-support)) |
| `prerender` | `boolean` | `true` | Prerender docs at build time. Set to `false` for SSR sites with auth middleware |

### Example

```javascript
shipyardDocs({
  routeBasePath: 'docs',
  editUrl: 'https://github.com/user/repo/edit/main/docs',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

### SSR Mode with Authentication

If you're running an SSR site with authentication middleware that needs access to request headers or cookies, you may need to disable prerendering:

```javascript
shipyardDocs({
  routeBasePath: 'docs',
  prerender: false, // Required for SSR sites with auth middleware
})
```

When `prerender: false`, docs pages are rendered on-demand and have full access to `Astro.request.headers` and cookies.

---

## Frontmatter Options

### Basic

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Page title |
| `description` | `string` | Page description for SEO |

### Sidebar

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sidebar.position` | `number` | `Infinity` | Position in sidebar (lower = earlier) |
| `sidebar.label` | `string` | `title` | Custom label for sidebar |
| `sidebar.render` | `boolean` | `true` | Whether to show in sidebar |

### Pagination

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `pagination_next` | `string \| null` | Auto | Next page doc ID, or `null` to disable |
| `pagination_prev` | `string \| null` | Auto | Previous page doc ID, or `null` to disable |

### Git Metadata Overrides

| Field | Type | Description |
|-------|------|-------------|
| `last_update_author` | `string \| false` | Override author, or `false` to hide |
| `last_update_time` | `Date \| false` | Override timestamp, or `false` to hide |
| `custom_edit_url` | `string \| null` | Custom edit URL, or `null` to disable |

---

## Sidebar Auto-Generation

The sidebar is automatically generated from your docs folder structure.

### How It Works

| Concept | Behavior |
|---------|----------|
| **Folders** | Become collapsible categories in the sidebar |
| **`index.md`** | Acts as the category landing page; its title becomes the category label |
| **Files** | Appear as entries under their parent folder/category |
| **Ordering** | Controlled by `sidebar.position` (lower = earlier); defaults to `Infinity` (end) |
| **Labels** | Use `sidebar.label` to override the display name; defaults to `title` |

### Example Structure

```
docs/
├── index.md                  # → Docs landing page
├── getting-started.md        # → Top-level entry
├── guides/
│   ├── index.md              # → "Guides" category (uses title from this file)
│   ├── installation.md       # → Entry under Guides
│   └── configuration.md      # → Entry under Guides
└── api/
    ├── index.md              # → "API" category
    └── reference.md          # → Entry under API
```

### Controlling Order

Use `sidebar.position` in frontmatter:

```yaml
---
title: Installation
sidebar:
  position: 1    # Appears first in its category
---
```

Pages without `sidebar.position` appear at the end, sorted alphabetically by title.

### Hiding from Sidebar

To exclude a page from the sidebar while keeping it accessible via URL:

```yaml
---
title: Hidden Page
sidebar:
  render: false
---
```

---

## Pagination

Pagination is automatic based on sidebar order.

**Disable pagination:**

```yaml
---
pagination_next: null
pagination_prev: null
---
```

**Link to a specific page:**

```yaml
---
pagination_next: advanced/deployment.md
---
```

---

## Multiple Documentation Instances

```javascript
export default defineConfig({
  integrations: [
    shipyard({ /* ... */ }),
    shipyardDocs({ routeBasePath: 'docs', collectionName: 'docs' }),
    shipyardDocs({ routeBasePath: 'api', collectionName: 'api-docs' }),
  ],
})
```

With content collections:

```typescript
const docs = defineCollection(createDocsCollection('./docs'))
const apiDocs = defineCollection(createDocsCollection('./api-docs'))

export const collections = { docs, 'api-docs': apiDocs }
```

---

## Internationalization

Organize docs by locale:

```
docs/
├── en/
│   └── getting-started.md
├── de/
│   └── getting-started.md
```

Locale-based routing is automatic when Astro's i18n is configured.

### Redirects for i18n Sites

When using Astro's i18n with `prefixDefaultLocale: true`, documentation pages require the locale prefix (e.g., `/en/docs/` instead of `/docs/`). To improve user experience, add redirects in your `astro.config.mjs`:

```javascript
export default defineConfig({
  redirects: {
    '/': { status: 302, destination: '/en' },
    '/docs': { status: 302, destination: '/en/docs' },
    '/blog': { status: 302, destination: '/en/blog' },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: true },
  },
  // ...
})
```

Note: Astro's static redirects only work for exact paths. For wildcard redirects (e.g., `/docs/*` → `/en/docs/*`), configure your hosting provider's redirect rules or use SSR mode with middleware.

---

## LLMs.txt Support

shipyard-docs can automatically generate `llms.txt` and `llms-full.txt` files following the [llms.txt specification](https://llmstxt.org/). These files help Large Language Models efficiently parse and understand your documentation.

### Configuration

Enable llms.txt generation by adding the `llmsTxt` option:

```javascript
shipyardDocs({
  llmsTxt: {
    enabled: true,
    projectName: 'My Project',
    summary: 'A brief description of your project for LLMs',
    description: 'Optional additional context about your project.',
    sectionTitle: 'Documentation', // Optional, defaults to 'Documentation'
  },
})
```

### Generated Files

When enabled, several files are automatically generated at build time under the docs path:

| File | Description |
|------|-------------|
| `/{routeBasePath}/llms.txt` | Index file with links to plain text versions of each documentation page |
| `/{routeBasePath}/llms-full.txt` | Complete file with full content of all documentation pages |
| `/{routeBasePath}/_llms-txt/*.txt` | Individual plain text/markdown files for each documentation page |

For example, with the default `routeBasePath` of `docs`:
- `/docs/llms.txt` - Main index file linking to individual plain text pages
- `/docs/llms-full.txt` - All documentation content in one file
- `/docs/_llms-txt/getting-started.txt` - Plain text version of a single page

The `llms.txt` file links directly to `.txt` files (not HTML pages), following the approach used by [Astro's documentation](https://docs.astro.build/llms.txt).

### Sidebar Integration

When llms.txt is enabled, a link to `/docs/llms.txt` is automatically added to the sidebar. This link includes a copy-to-clipboard button, making it easy to copy the URL and paste it into AI assistant prompts.

### Internationalization

When Astro's i18n is configured, llms.txt only includes content from the **default locale**. This prevents mixing different languages in the same file, ensuring LLMs receive consistent, single-language documentation.

### LLMs.txt Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable llms.txt generation |
| `projectName` | `string` | `'Documentation'` | H1 heading in the generated file |
| `summary` | `string` | — | Brief project summary (displayed as blockquote) |
| `description` | `string` | — | Additional context paragraphs |
| `sectionTitle` | `string` | `'Documentation'` | Title for the links section |

### Example Output

The generated `llms.txt` follows this format:

```markdown
# My Project

> A brief description of your project for LLMs

Optional additional context about your project.

## Documentation

- [Getting Started](https://example.com/docs/_llms-txt/getting-started.txt): Installation and setup guide
- [Configuration](https://example.com/docs/_llms-txt/configuration.txt): Configuration options reference
```

Each linked `.txt` file contains the raw markdown content of that documentation page, making it easy for LLMs to parse the content directly without HTML overhead.

This makes your documentation easily accessible to AI coding assistants like Claude, Cursor, and others that support the llms.txt standard.

---

## Versioning

shipyard-docs supports multi-version documentation, allowing you to maintain separate content for different versions of your project.

### Quick Setup

**1. Configure version options:**

```javascript
shipyardDocs({
  routeBasePath: 'docs',
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

**2. Set up versioned content collection:**

```typescript
// content.config.ts
import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2'],
  })
)

export const collections = { docs }
```

**3. Organize content by version:**

```
docs/
├── v2/
│   ├── getting-started.md
│   ├── configuration.md
│   └── new-feature.md
└── v1/
    ├── getting-started.md
    └── configuration.md
```

### Version Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `current` | `string` | Yes | Default version shown to users |
| `available` | `SingleVersionConfig[]` | Yes | List of all available versions |
| `deprecated` | `string[]` | No | Versions to show deprecation warnings |
| `stable` | `string` | No | Stable version (defaults to `current`) |

### Single Version Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `version` | `string` | Yes | Version identifier (e.g., `'v2'`, `'2.0'`) |
| `label` | `string` | No | Display label in UI (defaults to version) |
| `path` | `string` | No | URL path segment (defaults to version) |
| `banner` | `'unreleased' \| 'unmaintained'` | No | Banner type to display |

### URL Structure

With versioning enabled, routes follow this pattern:

- **Without i18n:** `/docs/v2/getting-started`
- **With i18n:** `/en/docs/v2/getting-started`

Special routes:
- `/docs/` redirects to `/docs/[current-version]/`
- `/docs/latest/` is an alias for the current version

### Version Selector

When versioning is enabled with multiple versions, a version selector dropdown automatically appears in the navbar and sidebar. The selector shows:

- **Green "stable" badge** for the stable version
- **Yellow "deprecated" badge** for deprecated versions
- **Blue "unreleased" badge** for versions with `banner: 'unreleased'`

### Best Practices

**Content organization:**
- Keep common pages in all versions for discoverability
- Only add version-specific pages where functionality differs
- Use consistent page slugs across versions for easy switching

**Version naming:**
- Avoid dots in folder names (use `v1`, not `v1.0`)
- Use the `label` option for display-friendly names
- Use the `path` option if you need custom URL segments

**Deprecation workflow:**
1. Add `banner: 'unmaintained'` to the version config
2. Add the version to the `deprecated` array
3. Consider removing very old versions to reduce maintenance

For a complete guide, see the [Versioning Guide](/en/docs/guides/versioning).
