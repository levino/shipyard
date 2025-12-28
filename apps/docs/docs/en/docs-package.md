---
title: '@levino/shipyard-docs'
sidebar_position: 4
description: Documentation plugin for shipyard with automatic sidebar and pagination
---

# @levino/shipyard-docs

The docs package provides documentation features for shipyard including automatic sidebar generation, pagination between pages, and git metadata display.

## Installation

```bash
npm install @levino/shipyard-docs
```

Requires `@levino/shipyard-base` to be installed and configured.

## Quick Start

### 1. Configure Astro

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    shipyard({
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
sidebar_position: 1
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

### Example

```javascript
shipyardDocs({
  routeBasePath: 'docs',
  editUrl: 'https://github.com/user/repo/edit/main/docs',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

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
| `sidebar_position` | `number` | `Infinity` | Position in sidebar (lower = earlier) |
| `sidebar_label` | `string` | `title` | Custom label for sidebar |
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

When enabled, two files are automatically generated at build time:

| File | Description |
|------|-------------|
| `/llms.txt` | Index file with links and descriptions of each documentation page |
| `/llms-full.txt` | Complete file with full content of all documentation pages |

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

- [Getting Started](https://example.com/docs/getting-started): Installation and setup guide
- [Configuration](https://example.com/docs/configuration): Configuration options reference
```

This makes your documentation easily accessible to AI coding assistants like Claude, Cursor, and others that support the llms.txt standard.
