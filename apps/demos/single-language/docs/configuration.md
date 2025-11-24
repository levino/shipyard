---
title: Configuration Guide  
description: Detailed configuration options for single-language Shipyard sites
---

# Configuration Guide

This guide covers all configuration options for **single-language Shipyard sites**.

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

## Shipyard Configuration Options

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

### Blog Configuration

```javascript
shipyardBlog(['blog'], {
  // Optional blog settings
  postsPerPage: 10,     // Pagination
  showAuthor: true,     // Show post authors
  showDate: true,       // Show publication dates
  showTags: true,       // Show tag lists
})
```

### Documentation Configuration

```javascript
shipyardDocs(['docs'], {
  // Optional docs settings
  sidebar: true,        // Show sidebar navigation
  breadcrumbs: true,    // Show breadcrumb navigation
  editLinks: true,      // Show "edit this page" links
})
```

## Content Collections

Configure your content in `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { docsSchema, blogSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'

// Blog collection
const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ 
    pattern: '**/*.md', 
    base: './blog'        // No language subdirectories!
  }),
})

// Docs collection
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ 
    pattern: '**/*.md', 
    base: './docs'        // No language subdirectories!
  }),
})

export const collections = { blog, docs }
```

## Styling Configuration

### Tailwind CSS

```javascript
// astro.config.mjs
integrations: [
  tailwind({
    applyBaseStyles: false,  // Let Shipyard handle base styles
    config: {
      // Custom Tailwind config
      theme: {
        extend: {
          colors: {
            primary: '#your-color',
          },
        },
      },
    },
  }),
]
```

### DaisyUI Themes

Shipyard uses DaisyUI for components. Configure themes in `tailwind.config.js`:

```javascript
module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'light',
      'dark', 
      'cupcake',
      // ... or create custom themes
    ],
  },
}
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

## Environment Variables

Set environment-specific configuration:

```bash
# .env
PUBLIC_SITE_URL=https://mysite.com
PUBLIC_ANALYTICS_ID=GA_MEASUREMENT_ID
```

Access in configuration:

```javascript
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_URL,
  integrations: [
    shipyard({
      title: 'My Site',
      // Use env vars for dynamic config
    }),
  ],
})
```

## Migration to Multi-Language

If you later need internationalization:

1. **Add i18n config** to `astro.config.mjs`
2. **Reorganize content** into language directories:
   ```
   blog/en/post.md
   blog/de/post.md
   docs/en/page.md  
   docs/de/page.md
   ```
3. **Update content loaders** to handle language paths
4. **Update internal links** to include language prefixes

The framework will handle the rest automatically!

## Advanced Options

### Custom Components

Override built-in components:

```javascript
shipyard({
  components: {
    Header: './src/components/CustomHeader.astro',
    Footer: './src/components/CustomFooter.astro',
  },
})
```

### Performance Optimization

```javascript
export default defineConfig({
  build: {
    inlineStylesheets: 'always',  // Inline small CSS
    split: true,                  // Code splitting
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro', 'react', 'vue'],
          },
        },
      },
    },
  },
})
```

That covers the essential configuration options! For more advanced use cases, check the official Astro and Shipyard documentation.