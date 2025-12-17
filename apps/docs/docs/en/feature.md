---
title: Getting Started
sidebar_position: 2
description: Learn how to install and configure Shipyard for your Astro project
---

# Getting Started with Shipyard

This guide will help you set up Shipyard in your Astro project. By the end, you'll have a fully configured site with documentation, blog, and beautiful styling.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18 or later
- **npm** (comes with Node.js)
- An existing Astro project, or you can create one with `npm create astro@latest`

## Installation

Install the Shipyard packages you need:

```bash
# Install all three packages for a full-featured site
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog

# Or install only what you need
npm install @levino/shipyard-base                    # Core components only
npm install @levino/shipyard-base @levino/shipyard-docs   # Docs site
npm install @levino/shipyard-base @levino/shipyard-blog   # Blog site
```

### Peer Dependencies

Shipyard requires the following peer dependencies:

```bash
npm install tailwindcss daisyui @tailwindcss/typography
```

## Configuration

### 1. Configure Astro

Update your `astro.config.mjs`:

```javascript
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      title: 'My Site',
      tagline: 'Built with Shipyard',
      brand: 'My Brand',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(),
    shipyardBlog(),
  ],
})
```

### 2. Configure Tailwind

Create or update your `tailwind.config.mjs`:

```javascript
import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './docs/**/*.md',
    './blog/**/*.md',
    'node_modules/@levino/shipyard-*/**/*.{astro,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
}
```

### 3. Set Up Content Collections

Create `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'
import { createBlogCollection } from '@levino/shipyard-blog'

const docs = defineCollection(createDocsCollection('./docs'))
const blog = defineCollection(createBlogCollection('./blog'))

export const collections = { docs, blog }
```

## Project Structure

After setup, your project structure should look like this:

```
my-site/
├── docs/                    # Documentation markdown files
│   └── getting-started.md
├── blog/                    # Blog post markdown files
│   └── 2024-01-01-first-post.md
├── src/
│   ├── content.config.ts    # Content collection config
│   └── pages/               # Additional pages
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Creating Content

### Documentation

Create markdown files in the `docs/` directory:

```markdown
---
title: My First Doc
sidebar_position: 1
---

# Welcome to the Docs

Your documentation content here...
```

### Blog Posts

Create markdown files in the `blog/` directory with dates in the filename:

```markdown
---
title: My First Post
description: A brief description
date: 2024-01-01
---

# Hello World

Your blog post content here...
```

## Configuration Options

### Shipyard Base Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Site title used in metadata |
| `tagline` | `string` | Short description for the site |
| `brand` | `string` | Brand name shown in navigation |
| `navigation` | `object` | Navigation links configuration |

### Shipyard Docs Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routeBasePath` | `string` | `'docs'` | Base URL path for documentation |

### Shipyard Blog Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routeBasePath` | `string` | `'blog'` | Base URL path for blog |

## Adding Internationalization

Shipyard supports i18n out of the box. Update your Astro config:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  // ... rest of config
})
```

Then organize your content by locale:

```
docs/
├── en/
│   └── getting-started.md
├── de/
│   └── getting-started.md
└── fr/
    └── getting-started.md
```

## Next Steps

Now that you have Shipyard set up, explore these topics:

- **[Multiple Documentation Instances](./multi-docs)** - Set up multiple doc sections
- **[Documentation Pagination](./pagination)** - Customize navigation between pages
- **[Feature Roadmap](./roadmap)** - See what features are coming next

## Need Help?

- Check the [GitHub repository](https://github.com/levino/shipyard) for issues and discussions
- Explore the [live demo](https://shipyard-demo.levinkeller.de) for examples
