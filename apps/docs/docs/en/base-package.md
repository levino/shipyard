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

### Tailwind Configuration

For Tailwind to correctly pick up the classes used in shipyard components, you need to add the package paths to the `content` array in your `tailwind.config.mjs`:

```javascript
const path = require('node:path')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // Add this to include shipyard-base component styles
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../astro/**/*.astro',
    ),
  ],
  // ... rest of your config
}
```

This ensures that Tailwind scans the shipyard component files and includes all necessary CSS classes in your build.

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

The base layout for all pages. Includes navigation bar, optional sidebar, and footer. Use this when building custom Astro components.

**Usage in Astro:**

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="My Page" description="Page description">
  <h1>Page Content</h1>
</Page>
```

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Page title (combined with site title) |
| `description` | `string` | Page description for SEO |

### Markdown Layout

A layout with Tailwind Typography (prose) styling. Use this for standalone markdown pages.

```markdown
---
layout: '@levino/shipyard-base/layouts/Markdown.astro'
title: My Page
---

# My Page

Your markdown content with nice typography...
```

### Splash Layout

A layout with centered content but without prose styling. Ideal for landing pages with custom styling.

```markdown
---
layout: '@levino/shipyard-base/layouts/Splash.astro'
title: Welcome
---

<div class="hero">
  <h1>Welcome to My Site</h1>
</div>
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
