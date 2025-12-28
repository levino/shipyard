---
title: '@levino/shipyard-docs'
sidebar_position: 4
description: Documentation plugin for shipyard with sidebar navigation, pagination, and git metadata
---

# @levino/shipyard-docs

The docs package provides documentation-specific features for shipyard including automatic sidebar generation, pagination between pages, git metadata display, and support for multiple documentation instances.

## Installation

```bash
npm install @levino/shipyard-docs
```

### Peer Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `astro` | ^5.15 | Astro framework |

The docs package also requires `@levino/shipyard-base` to be installed and configured.

## Quick Start

### 1. Configure Astro

Add the docs integration to your `astro.config.mjs`:

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

Your documentation content here...
```

---

## Integration Configuration

The `shipyardDocs()` integration accepts the following options:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `routeBasePath` | `string` | No | `'docs'` | Base URL path where docs are mounted |
| `collectionName` | `string` | No | Same as `routeBasePath` | Name of the content collection to use |
| `editUrl` | `string` | No | — | Base URL for "Edit this page" links |
| `showLastUpdateTime` | `boolean` | No | `false` | Show last update timestamp from git |
| `showLastUpdateAuthor` | `boolean` | No | `false` | Show last update author from git |

### Example with All Options

```javascript
shipyardDocs({
  routeBasePath: 'docs',
  collectionName: 'docs',
  editUrl: 'https://github.com/user/repo/edit/main/docs',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

### Routes Generated

The integration automatically generates routes:

| With i18n | Without i18n | Description |
|-----------|--------------|-------------|
| `/[locale]/docs/[...slug]` | `/docs/[...slug]` | Documentation pages |

---

## Frontmatter Schema

Documentation files support the following frontmatter options:

### Page Metadata

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | `string` | No | — | Page title |
| `description` | `string` | No | — | Page description for SEO |

### Sidebar Configuration

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `sidebar.render` | `boolean` | No | `true` | Whether to show in sidebar |
| `sidebar_position` | `number` | No | `Infinity` | Position in sidebar (lower = earlier) |
| `sidebar_label` | `string` | No | `title` | Custom label for sidebar |
| `sidebar_class_name` | `string` | No | — | CSS class for sidebar item |
| `sidebar_custom_props` | `object` | No | — | Custom properties for sidebar item |

### Pagination Control

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `pagination_next` | `string \| null` | No | Auto | Next page doc ID, or `null` to disable |
| `pagination_prev` | `string \| null` | No | Auto | Previous page doc ID, or `null` to disable |

### Git Metadata Overrides

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `last_update_author` | `string \| false` | No | From git | Override author, or `false` to hide |
| `last_update_time` | `Date \| false` | No | From git | Override timestamp, or `false` to hide |

### Edit Link

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `custom_edit_url` | `string \| null` | No | Auto | Custom edit URL, or `null` to disable |

### Complete Frontmatter Example

```yaml
---
title: Advanced Configuration
description: Learn about advanced configuration options
sidebar_position: 5
sidebar_label: Advanced
sidebar_class_name: advanced-docs
pagination_next: deployment.md
pagination_prev: basics.md
last_update_author: John Doe
last_update_time: 2025-01-15
custom_edit_url: https://github.com/user/repo/edit/main/docs/advanced.md
---
```

---

## Pagination

Pagination is automatically enabled for all documentation pages. The order follows the sidebar structure.

### Default Behavior

- **First page:** Shows only "Next"
- **Last page:** Shows only "Previous"
- **Middle pages:** Shows both "Previous" and "Next"

### Customizing Pagination

**Link to specific pages:**

```yaml
---
pagination_next: advanced/deployment.md
pagination_prev: introduction.md
---
```

**Disable next button:**

```yaml
---
pagination_next: null
---
```

**Disable all pagination:**

```yaml
---
pagination_next: null
pagination_prev: null
---
```

---

## Multiple Documentation Instances

You can have multiple documentation sections with different routes and collections.

### Configuration

```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    shipyard({ /* ... */ }),
    // User documentation at /docs
    shipyardDocs({
      routeBasePath: 'docs',
      collectionName: 'docs',
    }),
    // API documentation at /api
    shipyardDocs({
      routeBasePath: 'api',
      collectionName: 'api-docs',
    }),
    // Guides at /guides
    shipyardDocs({
      routeBasePath: 'guides',
      collectionName: 'guides',
    }),
  ],
})
```

### Content Collections

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))
const apiDocs = defineCollection(createDocsCollection('./api-docs'))
const guides = defineCollection(createDocsCollection('./guides'))

export const collections = { docs, 'api-docs': apiDocs, guides }
```

---

## Components

Import components from `@levino/shipyard-docs/astro`:

```javascript
import { DocsLayout, DocMetadata, DocsEntry } from '@levino/shipyard-docs/astro'
```

### DocsLayout

Main layout wrapper for documentation pages.

```astro
---
import { DocsLayout } from '@levino/shipyard-docs/astro'
---

<DocsLayout headings={headings} routeBasePath="docs">
  <Content />
</DocsLayout>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `headings` | `Heading[]` | No | `[]` | Headings for table of contents |
| `routeBasePath` | `string` | No | `'docs'` | Base path for generating URLs |
| `docsData` | `DocsData[]` | No | Auto-fetched | Pre-computed docs data for sidebar |
| `editUrl` | `string` | No | — | URL to edit this page |
| `lastUpdated` | `Date` | No | — | Last update timestamp |
| `lastAuthor` | `string` | No | — | Last update author |

**Heading object:**

```typescript
interface Heading {
  depth: number   // 1-6
  text: string    // Heading text
  slug: string    // Anchor slug
}
```

### DocMetadata

Displays edit link, last update time, and author.

```astro
<DocMetadata
  editUrl="https://github.com/user/repo/edit/main/docs/page.md"
  lastUpdated={new Date('2025-01-15')}
  lastAuthor="John Doe"
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `editUrl` | `string` | No | URL to edit this page |
| `lastUpdated` | `Date` | No | Last update timestamp |
| `lastAuthor` | `string` | No | Last update author name |

Only renders if at least one prop is provided.

### DocPagination

Renders previous/next navigation buttons.

```astro
<DocPagination
  prev={{ title: "Introduction", href: "/docs/intro" }}
  next={{ title: "Getting Started", href: "/docs/getting-started" }}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `prev` | `PaginationLink` | No | — | Previous page link |
| `next` | `PaginationLink` | No | — | Next page link |
| `prevLabel` | `string` | No | `'Previous'` | Label for previous button |
| `nextLabel` | `string` | No | `'Next'` | Label for next button |

**PaginationLink:**

```typescript
interface PaginationLink {
  title: string  // Page title
  href: string   // Page URL
}
```

---

## Helper Functions

### createDocsCollection

Creates a content collection configuration for documentation files.

```typescript
import { createDocsCollection } from '@levino/shipyard-docs'

// Basic usage
const docs = defineCollection(createDocsCollection('./docs'))

// With custom pattern
const guides = defineCollection(createDocsCollection('./guides', 'en/**/*.md'))
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `basePath` | `string` | Yes | — | Directory containing markdown files |
| `pattern` | `string` | No | `'**/*.md'` | Glob pattern to match files |

### getDocPath

Generates the full URL path for a documentation page.

```typescript
import { getDocPath } from '@levino/shipyard-docs'

// Without i18n
getDocPath('getting-started', 'docs', false)
// Returns: '/docs/getting-started'

// With i18n
getDocPath('en/getting-started', 'guides', true, 'en')
// Returns: '/en/guides/getting-started'
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | Yes | Document ID (file path) |
| `routeBasePath` | `string` | Yes | Base route path |
| `hasI18n` | `boolean` | Yes | Whether i18n is enabled |
| `currentLocale` | `string` | No | Current locale (required if hasI18n) |

### getRouteParams

Generates route parameters for `getStaticPaths`.

```typescript
import { getRouteParams } from '@levino/shipyard-docs'

// Without i18n
getRouteParams('getting-started', false)
// Returns: { slug: 'getting-started' }

// With i18n
getRouteParams('en/getting-started', true)
// Returns: { locale: 'en', slug: 'getting-started' }

// Root index
getRouteParams('', false)
// Returns: { slug: undefined }
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | `string` | Yes | Document slug |
| `hasI18n` | `boolean` | Yes | Whether i18n is enabled |

### getPaginationInfo

Computes previous/next links for a documentation page.

```typescript
import { getPaginationInfo, toSidebarEntries } from '@levino/shipyard-docs'

const sidebarEntries = toSidebarEntries(allDocs)
const pagination = getPaginationInfo(currentPath, sidebarEntries, allDocs)

// Returns:
// {
//   prev?: { title: string, href: string },
//   next?: { title: string, href: string }
// }
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `currentPath` | `string` | Yes | Current page path |
| `sidebarEntries` | `Entry` | Yes | Hierarchical sidebar structure |
| `allDocs` | `DocsData[]` | Yes | All documentation pages |

### toSidebarEntries

Converts flat docs array to hierarchical sidebar structure.

```typescript
import { toSidebarEntries } from '@levino/shipyard-docs'

const docs = [
  { id: 'intro.md', title: 'Introduction', path: '/docs/intro' },
  { id: 'guide/basics.md', title: 'Basics', path: '/docs/guide/basics' },
]

const sidebar = toSidebarEntries(docs)
// Returns hierarchical Entry structure for navigation
```

### getGitMetadata

Retrieves git metadata for a file.

```typescript
import { getGitMetadata } from '@levino/shipyard-docs'

const metadata = getGitMetadata('/absolute/path/to/file.md')
// Returns: { lastUpdated?: Date, lastAuthor?: string }
```

Returns empty object if git command fails.

### getEditUrl

Generates an edit URL for a documentation file.

```typescript
import { getEditUrl } from '@levino/shipyard-docs'

getEditUrl('https://github.com/user/repo/edit/main/docs', 'getting-started')
// Returns: 'https://github.com/user/repo/edit/main/docs/getting-started.md'
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `editUrlBase` | `string \| undefined` | No | Base edit URL |
| `docId` | `string` | Yes | Document ID |

---

## TypeScript Types

Import types from `@levino/shipyard-docs`:

```typescript
import type {
  DocsData,
  DocsRouteConfig,
  GitMetadata,
  PaginationInfo,
  PaginationLink,
} from '@levino/shipyard-docs'
```

### DocsData

Data structure for a documentation page:

```typescript
interface DocsData {
  id: string                     // Document ID (file path)
  title: string                  // Display title
  path: string                   // Full URL path
  link?: boolean                 // Show as link in sidebar
  sidebarPosition?: number       // Position in sidebar
  sidebarLabel?: string          // Custom sidebar label
  sidebarClassName?: string      // CSS class for sidebar item
  pagination_next?: string | null
  pagination_prev?: string | null
}
```

### DocsRouteConfig

Configuration for route generation:

```typescript
interface DocsRouteConfig {
  routeBasePath: string  // Base path for routes
  hasI18n: boolean       // Whether i18n is enabled
}
```

### GitMetadata

Git metadata for a file:

```typescript
interface GitMetadata {
  lastUpdated?: Date    // Last commit date
  lastAuthor?: string   // Last commit author
}
```

### PaginationInfo

Pagination navigation data:

```typescript
interface PaginationInfo {
  prev?: PaginationLink
  next?: PaginationLink
}
```

### PaginationLink

Single pagination link:

```typescript
interface PaginationLink {
  title: string  // Page title
  href: string   // Page URL
}
```

---

## Virtual Module

The docs package provides a virtual module with configuration:

```typescript
import { docsConfigs } from 'virtual:shipyard-docs-configs'

// Access config for specific route
const config = docsConfigs['docs']
// {
//   editUrl?: string
//   showLastUpdateTime: boolean
//   showLastUpdateAuthor: boolean
//   routeBasePath: string
//   collectionName: string
// }
```

---

## Advanced: Custom Route Files

For maximum flexibility, create custom route files using the exported components:

```astro
---
// src/pages/api/[...slug].astro
import { getCollection, render } from 'astro:content'
import { DocsLayout } from '@levino/shipyard-docs/astro'
import { getRouteParams, getDocPath, type DocsData } from '@levino/shipyard-docs'

export async function getStaticPaths() {
  const docs = await getCollection('api')
  return docs.map((entry) => ({
    params: getRouteParams(entry.id, false),
    props: { entry },
  }))
}

const { entry } = Astro.props
const { Content, headings } = await render(entry)

const allApiDocs = await getCollection('api')
const docsData: DocsData[] = allApiDocs.map((doc) => ({
  id: doc.id,
  path: getDocPath(doc.id, 'api', false),
  title: doc.data.title ?? doc.id,
  link: doc.data.sidebar?.render !== false,
  sidebarPosition: doc.data.sidebar_position,
  sidebarLabel: doc.data.sidebar_label,
  sidebarClassName: doc.data.sidebar_class_name,
}))
---

<DocsLayout headings={headings} routeBasePath="api" docsData={docsData}>
  <Content />
</DocsLayout>
```

---

## Internationalization

The docs package fully supports Astro's i18n features:

- Automatic locale prefix in routes
- Per-locale sidebars
- Locale-aware pagination
- Filtered content by locale

Organize your docs by locale:

```
docs/
├── en/
│   ├── getting-started.md
│   └── advanced.md
├── de/
│   ├── getting-started.md
│   └── advanced.md
```
