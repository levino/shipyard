---
title: Multiple Documentation Instances
sidebar_position: 3
---

# Multiple Documentation Instances

shipyard supports mounting documentation at custom route paths, allowing you to have multiple documentation instances in your site.

## Basic Usage

By default, `shipyardDocs()` mounts documentation at `/docs`. You can customize this:

```typescript
// astro.config.mjs
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    // Mount docs at /guides instead of /docs
    shipyardDocs({ routeBasePath: 'guides' }),
  ],
})
```

This will make your documentation available at:
- Without i18n: `/guides/[...slug]`
- With i18n: `/[locale]/guides/[...slug]`

## Configuration Options

### DocsConfig

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routeBasePath` | `string` | `'docs'` | The base path where docs routes will be mounted |

## Helper Functions

### createDocsCollection

A helper function for defining content collections in your `content.config.ts`:

```typescript
// content.config.ts
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))

export const collections = { docs }
```

Parameters:
- `basePath` (string): The directory path where markdown files are located
- `pattern` (string, optional): Glob pattern to match files (defaults to `**/*.md`)

### getDocPath

Generate the full URL path for a doc entry:

```typescript
import { getDocPath } from '@levino/shipyard-docs'

// Without i18n
const path = getDocPath('getting-started', 'docs', false)
// Returns: '/docs/getting-started'

// With i18n
const path = getDocPath('en/getting-started', 'guides', true, 'en')
// Returns: '/en/guides/getting-started'
```

### getRouteParams

Generate route parameters for use in `getStaticPaths`:

```typescript
import { getRouteParams } from '@levino/shipyard-docs'

// Without i18n
const params = getRouteParams('getting-started', false)
// Returns: { slug: 'getting-started' }

// With i18n
const params = getRouteParams('en/getting-started', true)
// Returns: { locale: 'en', slug: 'getting-started' }
```

## Advanced: Multiple Documentation Sets

For sites with multiple separate documentation areas (e.g., user docs and API docs), you can use the exported utilities to create custom routes.

### Step 1: Define Content Collections

```typescript
// content.config.ts
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))
const api = defineCollection(createDocsCollection('./api-docs'))

export const collections = { docs, api }
```

### Step 2: Create Custom Route Files

For advanced multi-docs setups, you can create your own route files using the exported `DocsLayout` component:

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

// Build sidebar data for api docs
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

### Step 3: Register the Integration

You still need to register the integration for any docs instance that uses the default entrypoint:

```typescript
// astro.config.mjs
export default defineConfig({
  integrations: [
    // Default docs at /docs (uses default collection 'docs')
    shipyardDocs(),
    // Note: Custom route files don't need integration registration
  ],
})
```

## Exported Types

### DocsData

The data structure used for sidebar entries:

```typescript
interface DocsData {
  id: string
  title: string
  path: string
  link?: boolean
  sidebarPosition?: number
  sidebarLabel?: string
  sidebarClassName?: string
}
```

### DocsRouteConfig

Configuration for route generation:

```typescript
interface DocsRouteConfig {
  routeBasePath: string
  hasI18n: boolean
}
```

## Layout Props

The `DocsLayout` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headings` | `{ depth: number; text: string; slug: string }[]` | `[]` | Headings for table of contents |
| `routeBasePath` | `string` | `'docs'` | Base path for generating URLs |
| `docsData` | `DocsData[]` | (fetched from 'docs' collection) | Pre-computed docs data for sidebar |
