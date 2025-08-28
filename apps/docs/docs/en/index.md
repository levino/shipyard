---
title: Shipyard Documentation
slug: 'en'
---

# Shipyard

**Shipyard** is a general-purpose page builder for [Astro](https://astro.build) that provides a complete toolkit for building documentation sites, blogs, and other content-focused websites.

## What is Shipyard?

Shipyard is a modular collection of Astro integrations and components designed to make it easy to build beautiful, functional websites. It consists of several packages:

- **@levino/shipyard-base**: Core components, layouts, and styling
- **@levino/shipyard-docs**: Documentation-specific features and layouts
- **@levino/shipyard-blog**: Blog functionality and layouts

## Key Features

- **Modular Architecture**: Use only the packages you need
- **Built-in Navigation**: Configurable navigation menus and sidebar generation
- **Responsive Design**: Mobile-first design with Tailwind CSS and DaisyUI
- **Content Management**: Automated content collection and organization
- **Internationalization Ready**: Full i18n support with locale-based routing

## Requirements

### Internationalization (i18n)

**⚠️ Important: Shipyard requires i18n configuration to function properly.**

Shipyard cannot be used without Astro's i18n feature. You must configure at least one locale in your `astro.config.mjs`:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en'], // At least one locale is required
    routing: {
      prefixDefaultLocale: true,
    },
  },
  // ... other config
});
```

### Locale Requirements

- **At least one locale must be configured** in your Astro i18n settings
- **Only string-based locales are supported** (e.g., `'en'`, `'de'`, `'fr'`)
- Object-based locale configurations are not supported

Example of supported locale configuration:
```javascript
// ✅ Supported
locales: ['en', 'de', 'fr']

// ❌ Not supported
locales: [
  { path: 'en', codes: ['en'] },
  { path: 'de', codes: ['de'] }
]
```

## Quick Start

1. **Install Shipyard packages:**
   ```bash
   npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog
   ```

2. **Configure your `astro.config.mjs`:**
   ```javascript
   import { defineConfig } from 'astro/config';
   import tailwind from '@astrojs/tailwind';
   import shipyard from '@levino/shipyard-base';
   import shipyardDocs from '@levino/shipyard-docs';
   import shipyardBlog from '@levino/shipyard-blog';

   export default defineConfig({
     i18n: {
       defaultLocale: 'en',
       locales: ['en'],
       routing: {
         prefixDefaultLocale: true,
       },
     },
     integrations: [
       tailwind({ applyBaseStyles: false }),
       shipyard({
         navigation: {
           docs: { label: 'Documentation', href: '/docs' },
           blog: { label: 'Blog', href: '/blog' },
         },
         title: 'My Site',
         tagline: 'Built with Shipyard',
         brand: 'My Brand',
       }),
       shipyardDocs(['docs']),
       shipyardBlog(['blog']),
     ],
   });
   ```

3. **Start building your content** in the appropriate directories with proper locale structure.

## Demo

Check out the [live demo](https://shipyard-demo.levinkeller.de) to see Shipyard in action.

## Next Steps

- Learn about [configuring navigation and themes](./configuration)
- Explore [available components and layouts](./components)
- Set up your [content structure](./content-structure)