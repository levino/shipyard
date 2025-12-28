---
title: '@levino/shipyard-base'
sidebar_position: 3
description: Core package providing layouts, components, and configuration for shipyard
---

# @levino/shipyard-base

The base package is the foundation of shipyard. It provides the core configuration system, layouts, components, and utilities that all other shipyard packages build upon.

## Installation

```bash
npm install @levino/shipyard-base
```

### Peer Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `astro` | ^5.7 | Astro framework |
| `tailwindcss` | ^3 | Utility-first CSS framework |
| `daisyui` | ^4 | Tailwind CSS component library |
| `@tailwindcss/typography` | ^0.5.10 | Typography plugin for prose styling |

Install peer dependencies:

```bash
npm install tailwindcss daisyui @tailwindcss/typography
```

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
      tagline: 'Built with shipyard',
      navigation: {
        docs: { label: 'Documentation', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
  ],
})
```

### Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `brand` | `string` | Yes | — | Brand name displayed in navigation bar and sidebar |
| `title` | `string` | Yes | — | Site title used in the HTML `<title>` tag |
| `tagline` | `string` | Yes | — | Short description of your site |
| `navigation` | `NavigationTree` | Yes | — | Global navigation structure (see below) |
| `scripts` | `Script[]` | No | `[]` | Scripts to include in the page head |

### Navigation Structure

The `navigation` option accepts a `NavigationTree` object where each key maps to a `NavigationEntry`:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | No | Key name | Display text in navigation |
| `href` | `string` | No | — | Link destination URL |
| `subEntry` | `NavigationTree` | No | — | Nested navigation entries for dropdown menus |
| `active` | `boolean` | No | `false` | Whether entry is currently active (set automatically) |

**Simple navigation:**

```javascript
navigation: {
  docs: { label: 'Docs', href: '/docs' },
  blog: { label: 'Blog', href: '/blog' },
  about: { label: 'About', href: '/about' },
}
```

**Nested navigation with dropdowns:**

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
}
```

### Scripts Configuration

Add custom scripts to every page:

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

---

## Layouts

Import layouts from `@levino/shipyard-base/layouts`:

```javascript
import { Page, Splash, Footer } from '@levino/shipyard-base/layouts'
```

### Page Layout

The main layout for content pages. Includes navigation bar, optional sidebar, and footer.

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

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | No | — | Page title (combined with site title) |
| `description` | `string` | No | — | Page description for SEO |
| `sidebarNavigation` | `NavigationTree` | No | — | Sidebar navigation for documentation-style pages |

**Features:**
- Responsive drawer navigation for mobile
- Global desktop navigation bar
- Optional sidebar navigation (when `sidebarNavigation` is provided)
- Footer with configurable links
- Automatic locale prefix for i18n
- OpenGraph meta tags

### Splash Layout

A simplified layout that wraps content in a prose container. Ideal for markdown pages and landing pages.

```astro
---
import { Splash } from '@levino/shipyard-base/layouts'
---

<Splash title="Welcome">
  <h1>Welcome to My Site</h1>
  <p>This content is centered and styled with typography.</p>
</Splash>
```

**Props:** Same as Page layout.

The Splash layout extends Page but adds a `prose mx-auto` wrapper for optimal typography.

### Footer Layout

A pre-configured footer component with copyright and links.

```astro
---
import { Footer } from '@levino/shipyard-base/layouts'
---

<Footer />
```

The default footer includes copyright information and an imprint link.

---

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
<Breadcrumbs navigation={sidebarNavigation} />
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `navigation` | `Entry` | Yes | — | Navigation tree to traverse |
| `currentPath` | `string` | No | `Astro.url.pathname` | Current page path |

### TableOfContents

Displays a table of contents from page headings. Only shows h2 and h3 headings.

```astro
---
const { headings } = await render(entry)
---

<TableOfContents links={headings} />
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `links` | `Link[]` | Yes | — | Array of headings with `depth`, `text`, and `slug` |
| `label` | `string` | No | `"On this page"` | Label text for the section |
| `class` | `string` | No | — | Additional CSS classes |
| `desktopOnly` | `boolean` | No | `false` | Only show on desktop screens |

**Link object structure:**

```typescript
interface Link {
  depth: number   // Heading level (2 or 3)
  text: string    // Heading text
  slug: string    // Anchor slug for the link
}
```

### GlobalDesktopNavigation

The main navigation bar component. Typically used internally by Page layout.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `brand` | `string` | Yes | — | Brand name to display |
| `navigation` | `NavigationTree` | Yes | — | Navigation entries |
| `showBrand` | `boolean` | Yes | — | Whether to show brand on desktop |

### SidebarNavigation

Sidebar with brand, global menu, and local navigation. Used internally by Page layout.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `brand` | `string` | Yes | — | Brand name for logo |
| `global` | `Entry` | Yes | — | Global navigation entries |
| `local` | `Entry \| undefined` | Yes | — | Local/section navigation entries |

### SidebarElement

Recursive component for rendering hierarchical navigation menus.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entry` | `Entry` | Yes | — | Navigation entry to render |
| `currentPath` | `string` | No | `Astro.url.pathname` | Current page path |

### Footer (Component)

Customizable footer component with links and copyright.

```astro
<Footer
  links={[
    { label: 'Privacy', href: '/privacy' },
    { label: 'Imprint', href: '/imprint' },
  ]}
  copyright={{
    label: 'Your Company',
    href: 'https://yourcompany.com',
    year: 2025,
  }}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `links` | `FooterLink[]` | Yes | Footer links array |
| `copyright` | `CopyrightInfo` | Yes | Copyright information |

**FooterLink:**

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Link text |
| `href` | `string` | Link URL |

**CopyrightInfo:**

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Copyright holder name |
| `href` | `string` | Link to copyright holder |
| `year` | `number` | Copyright year |

---

## Utility Functions

### getTitle

Combines site title with page title for the HTML `<title>` tag.

```typescript
import { getTitle } from '@levino/shipyard-base'

getTitle('My Site', 'About')     // "My Site - About"
getTitle('My Site', null)        // "My Site"
getTitle('My Site', 'My Site')   // "My Site" (no duplication)
getTitle('My Site', '  ')        // "My Site" (trims whitespace)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `siteTitle` | `string` | The main site title |
| `pageTitle` | `string \| null \| undefined` | Optional page-specific title |

**Returns:** Combined title string.

### cn

Utility for merging CSS class names with Tailwind CSS conflict resolution.

```typescript
import { cn } from '@levino/shipyard-base'

cn('px-4', 'px-8')                    // "px-8" (later wins)
cn('px-4', { 'pl-8': isNested })      // Conditional classes
cn('text-red-500', 'text-blue-500')   // "text-blue-500"
```

Uses `clsx` and `tailwind-merge` for intelligent class merging.

---

## TypeScript Types

Import types from `@levino/shipyard-base`:

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

### Config

Complete configuration interface:

```typescript
interface Config {
  brand: string
  title: string
  tagline: string
  navigation: NavigationTree
  scripts?: Script[]
}
```

### NavigationEntry

Single navigation item:

```typescript
interface NavigationEntry {
  label?: string
  href?: string
  subEntry?: NavigationTree
  active?: boolean
}
```

### NavigationTree

Collection of navigation entries:

```typescript
type NavigationTree = Record<string, NavigationEntry>
```

### Entry

Used for component navigation structures:

```typescript
type Entry = Record<string, {
  label?: string
  href?: string
  subEntry?: Entry
  active?: boolean
  className?: string
}>
```

### LinkData

Simple link data structure:

```typescript
interface LinkData {
  href: string
  label: string
  active: boolean
}
```

### Script

Script configuration:

```typescript
type Script = string | {
  src?: string
  async?: boolean
  defer?: boolean
  // ... other script attributes
}
```

---

## Virtual Module

The base package provides a virtual module with your configuration:

```typescript
import config from 'virtual:shipyard/config'

console.log(config.brand)      // Your brand name
console.log(config.title)      // Your site title
console.log(config.navigation) // Your navigation tree
```

This is used internally by layouts and components but can be accessed directly when needed.

---

## Internationalization

The base package automatically supports Astro's i18n features. When i18n is configured, navigation links are automatically prefixed with the current locale.

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

All navigation hrefs will automatically receive the appropriate locale prefix.

---

## Constants

The package exports month name arrays for i18n purposes:

```typescript
import { MONTHS_EN, MONTHS_DE } from '@levino/shipyard-base'

// MONTHS_EN = ['january', 'february', 'march', ...]
// MONTHS_DE = ['Januar', 'Februar', 'März', ...]
```
