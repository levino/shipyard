---
title: Configuration Guide
description: Detailed configuration options for single-language shipyard sites
sidebar_position: 3
---

# Configuration Guide

This guide covers all configuration options for **single-language shipyard sites**.

## Basic Configuration

The key difference from multi-language sites is the **absence of i18n configuration**:

```javascript
// astro.config.mjs
export default defineConfig({
  // ✅ Single-language: No i18n section needed
  integrations: [
    shipyard({
      title: 'My Site',
      tagline: 'My awesome site',
      brand: 'My Brand',
    }),
  ],
})
```

Compare with multi-language configuration:

```javascript
// Multi-language sites need this:
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    // ... more i18n config
  },
  // ...
})
```

## shipyard Configuration Options

### Core Settings

```javascript
shipyard({
  // Site identity
  title: 'Your Site Name',           // Page titles and meta
  tagline: 'Your site description',  // Homepage tagline
  brand: 'Your Brand',               // Navbar brand text

  // Navigation menu
  navigation: {
    docs: {
      label: 'Documentation',
      href: '/docs',
    },
    blog: {
      label: 'Blog',
      href: '/blog',
    },
    about: {
      label: 'About',
      href: '/about',
    },
  },

  // External scripts (optional)
  scripts: [
    'https://example.com/script.js',
    {
      src: 'https://example.com/async-script.js',
      async: true,
    },
  ],
})
```

## URL Structure

Single-language sites use clean URLs:

| Content Type | Single-Language | Multi-Language |
|--------------|----------------|----------------|
| Homepage | `/` | `/en/`, `/de/` |
| Blog index | `/blog` | `/en/blog`, `/de/blog` |
| Blog post | `/blog/post-slug` | `/en/blog/post-slug` |
| Docs page | `/docs/page-slug` | `/en/docs/page-slug` |
| About page | `/about` | `/en/about`, `/de/about` |

## Migration to Multi-Language

If you later need internationalization:

1. **Add i18n config** to `astro.config.mjs`
2. **Reorganize content** into language directories
3. **Update content loaders** to handle language paths
4. **Update internal links** to include language prefixes

The framework will handle the rest automatically!

That covers the essential configuration options! For more advanced use cases, check the official Astro and shipyard documentation.
