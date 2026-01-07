---
title: Installation Guide
description: How to install and set up shipyard for single-language sites
sidebar_position: 2
---

# Installation Guide

This guide will help you set up a **single-language shipyard site** from scratch.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org)
- **npm or pnpm**: Package manager (comes with Node.js)
- **Git**: For version control
- **Code editor**: VS Code recommended

## Create New Project

### 1. Initialize Project

```bash
# Create new directory
mkdir my-single-lang-site
cd my-single-lang-site

# Initialize package.json
npm init -y
```

### 2. Install Dependencies

```bash
# Install Astro and shipyard packages
npm install astro @astrojs/tailwind tailwindcss daisyui
npm install @levino/shipyard-base @levino/shipyard-blog @levino/shipyard-docs

# Install dev dependencies
npm install -D @tailwindcss/typography typescript
```

### 3. Configure Astro

Create `astro.config.mjs`:

```javascript
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Note: No i18n configuration for single-language sites
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
        about: { label: 'About', href: '/about' },
      },
      title: 'My Site',
      tagline: 'Single language site powered by shipyard',
      brand: 'My Brand',
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
})
```

## Project Structure

Set up your project structure:

```
my-single-lang-site/
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies
├── src/
│   ├── env.d.ts         # TypeScript definitions
│   ├── content.config.ts # Content collections
│   └── pages/           # Static pages
│       ├── index.md     # Homepage
│       └── about.md     # About page
├── blog/                # Blog posts (no language dirs!)
│   └── welcome.md       # First blog post
└── docs/                # Documentation (no language dirs!)
    ├── index.md         # Docs homepage
    └── installation.md  # This page
```

## Content Configuration

Create `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { blogSchema } from '@levino/shipyard-blog'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})

const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})

export const collections = { blog, docs }
```

## Development

Start the development server:

```bash
npm run dev
```

Your site will be available at `http://localhost:4321`

## Next Steps

- **Add content**: Create your first [blog post](/blog) and [documentation pages](/docs)
- **Customize**: Modify themes, colors, and layouts
- **Deploy**: Deploy to Vercel, Netlify, or your preferred host

## Troubleshooting

### Common Issues

**Build errors**: Make sure all peer dependencies are installed
**Styling issues**: Check that Tailwind CSS is properly configured
**Route problems**: Verify your content collections are set up correctly

Need more help? Check our [configuration guide](/docs/configuration) for advanced setup options.
