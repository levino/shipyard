---
title: '@levino/shipyard-base'
sidebar_position: 3
description: Core package providing layouts and configuration for shipyard
---

# @levino/shipyard-base

The base package is the foundation of shipyard. It provides the core configuration system and layouts that power your site.

## Installation

```bash
npm install @levino/shipyard-base
```

### Peer Dependencies

```bash
npm install tailwindcss daisyui @tailwindcss/typography
```

| Package | Version |
|---------|---------|
| `astro` | ^5.7 |
| `tailwindcss` | ^3 |
| `daisyui` | ^4 |
| `@tailwindcss/typography` | ^0.5.10 |

## Configuration

Add the shipyard integration to your `astro.config.mjs`:

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

The `navigation` option defines your site's main navigation. Each entry can have:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `label` | `string` | No | Key name | Display text in navigation |
| `href` | `string` | No | — | Link destination URL |
| `subEntry` | `NavigationTree` | No | — | Nested entries for dropdown menus |

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

### Adding Scripts

Add analytics or other scripts to every page:

```javascript
shipyard({
  // ... other options
  scripts: [
    'https://example.com/analytics.js',
    { src: 'https://example.com/script.js', async: true },
  ],
})
```

---

## Layouts

shipyard provides layouts for your pages.

### Page Layout

The main layout for content pages. Includes navigation bar, optional sidebar, and footer.

**Usage in Astro:**

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="My Page" description="Page description">
  <h1>Page Content</h1>
</Page>
```

**Usage in Markdown:**

```markdown
---
layout: '@levino/shipyard-base/layouts/Page.astro'
title: My Page
---

# Page Content
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title (combined with site title) |
| `description` | `string` | Page description for SEO |

### Splash Layout

A layout with centered prose styling. Ideal for landing pages.

```markdown
---
layout: '@levino/shipyard-base/layouts/Splash.astro'
title: Welcome
---

# Welcome to My Site
```

---

## Internationalization

Navigation links automatically receive locale prefixes when Astro's i18n is configured:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: true },
  },
  integrations: [shipyard({ /* ... */ })],
})
```
