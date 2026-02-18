---
title: '@levino/shipyard-base'
sidebar:
  position: 3
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
| `tailwindcss` | ^4 |
| `daisyui` | ^5 |
| `@tailwindcss/typography` | ^0.5.10 |

### Tailwind Configuration

shipyard uses Tailwind CSS 4, which uses a CSS-based configuration approach. For detailed setup instructions, see the [Tailwind CSS Setup guide](../guides/tailwind-setup).

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
| `footer` | `FooterConfig` | No | — | Footer configuration (links, copyright, style) |
| `hideBranding` | `boolean` | No | `false` | Hide the "Built with Shipyard" branding |
| `onBrokenLinks` | `'ignore' \| 'log' \| 'warn' \| 'throw'` | No | `'warn'` | Behavior when broken internal links are detected during build |

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

### Footer Configuration

Customize your site's footer with links, copyright notice, and styling. Shipyard supports both simple (single row) and multi-column footer layouts, similar to Docusaurus.

#### Simple Footer

A simple footer displays links in a horizontal row:

```javascript
shipyard({
  // ... other options
  footer: {
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'Blog', to: '/blog' },
      { label: 'GitHub', href: 'https://github.com/myorg/myrepo' },
    ],
    copyright: 'Copyright © 2025 My Company. All rights reserved.',
  },
})
```

#### Multi-Column Footer

For a multi-column layout, use objects with `title` and `items`:

```javascript
shipyard({
  // ... other options
  footer: {
    style: 'dark',
    links: [
      {
        title: 'Docs',
        items: [
          { label: 'Getting Started', to: '/docs' },
          { label: 'API Reference', to: '/docs/api' },
        ],
      },
      {
        title: 'Community',
        items: [
          { label: 'Blog', to: '/blog' },
          { label: 'GitHub', href: 'https://github.com/myorg/myrepo' },
        ],
      },
    ],
    copyright: 'Copyright © 2025 My Company.',
  },
})
```

#### Footer Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `style` | `'light' \| 'dark'` | `'light'` | Footer color theme |
| `links` | `(FooterLink \| FooterLinkColumn)[]` | `[]` | Footer links or columns |
| `copyright` | `string` | — | Copyright notice (supports HTML) |
| `logo` | `FooterLogo` | — | Optional footer logo |

#### FooterLink Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | Yes | Display text for the link |
| `to` | `string` | One of `to`/`href` | Internal link path (locale prefix added automatically) |
| `href` | `string` | One of `to`/`href` | External URL (opens in new tab) |

#### FooterLinkColumn Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | Yes | Column header text |
| `items` | `FooterLink[]` | Yes | Links within this column |

#### FooterLogo Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `alt` | `string` | Yes | Alt text for the logo |
| `src` | `string` | Yes | Logo image source URL |
| `srcDark` | `string` | No | Optional dark mode logo |
| `href` | `string` | No | Link URL when clicking the logo |
| `width` | `number` | No | Logo width in pixels |
| `height` | `number` | No | Logo height in pixels |

#### Shipyard Branding

By default, the footer displays a "Built with Shipyard" link. To hide this branding:

```javascript
shipyard({
  // ... other options
  hideBranding: true,
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

#### Named Slots

| Slot | Description |
|------|-------------|
| (default) | Page body content |
| `head` | Custom elements injected into the HTML `<head>` |
| `navbarExtra` | Extra content in the navigation bar |
| `sidebarExtra` | Extra content in the sidebar |

#### Injecting Custom Head Elements

Use the `head` slot to inject custom meta tags, Open Graph data, canonical URLs, or structured data (JSON-LD) into the `<head>` without building a custom layout:

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="My Event" description="A community event">
  <meta slot="head" property="og:type" content="event" />
  <meta slot="head" property="og:image" content="/images/event.jpg" />
  <link slot="head" rel="canonical" href="https://example.com/my-event" />
  <script slot="head" type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "My Event"
  })} />

  <h1>My Event</h1>
</Page>
```

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

## Broken Link Detection

Shipyard automatically checks for broken internal links during production builds. This helps you catch issues before deploying your site.

### Configuration

Use the `onBrokenLinks` option to control what happens when broken links are detected:

| Value | Behavior |
|-------|----------|
| `'ignore'` | Don't check for broken links |
| `'log'` | Log broken links but continue build |
| `'warn'` | Log warnings for broken links (default) |
| `'throw'` | Fail the build on broken links |

**Example - Fail build on broken links:**

```javascript
shipyard({
  brand: 'My Site',
  title: 'My Site',
  tagline: 'Built with shipyard',
  navigation: { /* ... */ },
  onBrokenLinks: 'throw',
})
```

### What Gets Checked

- Internal links starting with `/` (e.g., `/docs/getting-started`)
- Links with query strings and hash fragments (the base path is validated)
- Links to HTML pages, directories with `index.html`, and asset files

### What Gets Ignored

- External URLs (`https://`, `http://`)
- Anchor links (`#section`)
- Special protocols (`mailto:`, `tel:`, `javascript:`, `data:`)

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
