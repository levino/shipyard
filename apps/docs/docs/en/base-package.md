---
title: Base Package Reference
sidebar_position: 3
---

# @levino/shipyard-base

The base package is the foundation of Shipyard. It provides the core configuration system, layouts, and components that all other Shipyard packages build upon.

## Installation

```bash
npm install @levino/shipyard-base
```

### Peer Dependencies

The base package requires the following peer dependencies:

- `astro` ^5.7
- `tailwindcss` ^3
- `daisyui` ^4
- `@tailwindcss/typography` ^0.5.10

## Configuration

The base package exports an Astro integration that configures your site. Add it to your `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    shipyard({
      brand: 'My Site',
      title: 'My Awesome Site',
      tagline: 'Built with Shipyard',
      navigation: {
        docs: { label: 'Documentation', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
  ],
})
```

### Configuration Options

The `Config` interface defines all available configuration options:

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `brand` | `string` | Yes | The brand name displayed in the navigation bar and sidebar |
| `title` | `string` | Yes | The site title used in the HTML `<title>` tag |
| `tagline` | `string` | Yes | A short description of your site |
| `navigation` | `NavigationTree` | Yes | The global navigation structure |
| `scripts` | `Script[]` | No | Optional scripts to include in the page head |

### Navigation Structure

The `navigation` option accepts a `NavigationTree` object. Each entry can have:

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Display text (defaults to the key name) |
| `href` | `string` | Link destination |
| `subEntry` | `NavigationTree` | Nested navigation entries for dropdowns |
| `active` | `boolean` | Whether this entry is currently active (set automatically) |

**Example with nested navigation:**

```javascript
navigation: {
  docs: {
    label: 'Documentation',
    subEntry: {
      'getting-started': { label: 'Getting Started', href: '/docs/getting-started' },
      'api-reference': { label: 'API Reference', href: '/docs/api' },
    },
  },
  blog: { label: 'Blog', href: '/blog' },
  about: { label: 'About', href: '/about' },
}
```

### Scripts Configuration

You can add custom scripts to every page using the `scripts` option:

```javascript
shipyard({
  // ... other options
  scripts: [
    // Simple URL string
    'https://example.com/analytics.js',
    // Full script object with attributes
    {
      src: 'https://example.com/script.js',
      async: true,
      defer: true,
    },
  ],
})
```

## Layouts

The base package provides three layouts that you can use directly or extend.

### Page Layout

The main layout for content pages. It includes the navigation bar, sidebar support, and footer.

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="My Page" description="Page description">
  <h1>Page Content</h1>
  <p>Your content goes here.</p>
</Page>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title (combined with site title) |
| `description` | `string` | Page description for SEO |
| `sidebarNavigation` | `NavigationTree` | Optional sidebar navigation for documentation-style pages |

When `sidebarNavigation` is provided, a left sidebar will appear on larger screens with local navigation.

### Splash Layout

A simplified layout that wraps content in a prose container. Ideal for markdown content pages.

```astro
---
import { Splash } from '@levino/shipyard-base/layouts'
---

<Splash title="Welcome">
  <h1>Welcome to My Site</h1>
  <p>This content is centered and styled with typography.</p>
</Splash>
```

The Splash layout extends the Page layout but adds a `prose` class for optimal typography.

### Footer Layout

A pre-configured footer component with copyright and links.

```astro
---
import { Footer } from '@levino/shipyard-base/layouts'
---

<Footer />
```

The default footer includes:
- Copyright information linking to the author
- An "Impressum" (imprint) link

## Components

Import components from `@levino/shipyard-base/components`:

```javascript
import {
  Breadcrumbs,
  Footer,
  GlobalDesktopNavigation,
  LocalNavigation,
  SidebarElement,
  SidebarNavigation,
  TableOfContents
} from '@levino/shipyard-base/components'
```

### Breadcrumbs

Displays a breadcrumb trail based on the navigation tree.

```astro
---
import { Breadcrumbs } from '@levino/shipyard-base/components'
---

<Breadcrumbs navigation={sidebarNavigation} />
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `navigation` | `Entry` | The navigation tree to traverse |
| `currentPath` | `string` | Current page path (defaults to `Astro.url.pathname`) |

### TableOfContents

Displays a table of contents based on page headings.

```astro
---
import { TableOfContents } from '@levino/shipyard-base/components'

const headings = await Astro.glob('./*.md').then(posts =>
  posts[0].getHeadings()
)
---

<TableOfContents links={headings} />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `links` | `Link[]` | - | Array of heading objects with `depth`, `text`, and `slug` |
| `label` | `string` | `"On this page"` | Label text for the table of contents |
| `class` | `string` | - | Additional CSS classes |
| `desktopOnly` | `boolean` | `false` | Only show on desktop (hide mobile collapsible) |

The component automatically filters to show only h2 and h3 headings (depth 2 and 3).

### GlobalDesktopNavigation

The main navigation bar component. This is typically used internally by the Page layout.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `brand` | `string` | Brand name to display |
| `navigation` | `NavigationTree` | Navigation entries |
| `showBrand` | `boolean` | Whether to show the brand on desktop |

### SidebarNavigation

The sidebar component that combines global and local navigation. Used internally by the Page layout.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `brand` | `string` | Brand name to display |
| `global` | `Entry` | Global navigation entries |
| `local` | `Entry` | Local/sidebar navigation entries |

### Footer (Component)

A customizable footer component (separate from the Footer layout).

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `links` | `{ label: string, href: string }[]` | Footer links |
| `copyright` | `{ label: string, href: string, year: number }` | Copyright information |

## Utility Functions

### getTitle

Combines the site title with a page title:

```typescript
import { getTitle } from '@levino/shipyard-base'

getTitle('My Site', 'About')  // Returns: "My Site - About"
getTitle('My Site', null)     // Returns: "My Site"
```

## TypeScript Types

The package exports several TypeScript types for use in your application:

```typescript
import type {
  Config,
  NavigationEntry,
  NavigationTree,
  Script,
  Entry,
  LinkData
} from '@levino/shipyard-base'
```

### Entry Type

Used for navigation structures in components:

```typescript
type Entry = Record<string, {
  label?: string
  href?: string
  subEntry?: Entry
  active?: boolean
  className?: string
}>
```

### LinkData Type

Used for simple link data:

```typescript
interface LinkData {
  href: string
  label: string
  active: boolean
}
```

## Internationalization

The base package automatically supports Astro's i18n features. When i18n is configured in your Astro config, navigation links are automatically prefixed with the current locale.

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [shipyard({ /* ... */ })],
})
```

## Virtual Module

The base package provides a virtual module `virtual:shipyard/config` that contains your Shipyard configuration. This is used internally by the layouts and components, but you can also access it directly:

```typescript
import config from 'virtual:shipyard/config'

console.log(config.brand)  // Your brand name
console.log(config.title)  // Your site title
```

For TypeScript support, ensure you have the types declaration in your project. The package includes a `virtual.d.ts` file that provides type definitions for the virtual module.
