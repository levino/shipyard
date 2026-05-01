// @ts-check

import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import pagefind from 'astro-pagefind'
import shipyardBlog from '../../packages/blog/src/index.ts'

// Import CSS URL - Vite resolves the path
import appCss from './src/styles/app.css?url'

// https://astro.build/config
export default defineConfig({
  site: 'https://shipyard.levinkeller.de',
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/': {
      status: 302,
      destination: '/en',
    },
    // Redirect root section paths to default locale for users who forget the locale prefix
    '/docs': {
      status: 302,
      destination: '/en/docs',
    },
    '/blog': {
      status: 302,
      destination: '/en/blog',
    },
    '/search': {
      status: 302,
      destination: '/en/search',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: 'rewrite',
    },
    fallback: {
      de: 'en',
    },
  },
  integrations: [
    shipyard({
      css: appCss,
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
        search: {
          label: 'Search',
          href: '/search',
        },
      },
      title: 'shipyard',
      tagline: 'A universal page builder for astro',
      brand: 'shipyard',
      onBrokenLinks: 'throw',
      scripts: [
        {
          src: 'https://analytics.levinkeller.de/js/script.js',
          defer: true,
          'data-domain': 'shipyard.levinkeller.de',
        },
      ],
    }),
    shipyardDocs({
      llmsTxt: {
        enabled: true,
        projectName: 'shipyard',
        summary:
          'shipyard is an Astro-based page builder for creating documentation sites, blogs, and content-focused websites with responsive design, i18n support, and modular components.',
        description: `shipyard provides three packages: @levino/shipyard-base (core layouts and configuration), @levino/shipyard-docs (documentation features with sidebar and pagination), and @levino/shipyard-blog (blog functionality). It uses Tailwind CSS 4 with DaisyUI 5 for styling.

## Complete Setup (all steps required)

### Step 1: Install packages

Full-featured site (docs + blog):
\`\`\`bash
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog tailwindcss @tailwindcss/vite daisyui @tailwindcss/typography
\`\`\`

Documentation site only (no blog):
\`\`\`bash
npm install @levino/shipyard-base @levino/shipyard-docs tailwindcss @tailwindcss/vite daisyui @tailwindcss/typography
\`\`\`

### Step 2: Create src/styles/app.css

This file is required. Every \`@import\` shown below is needed — each shipyard package ships its own \`@source\` directives that tell Tailwind where to scan for classes. Missing an import causes partially unstyled components.

Full-featured site (docs + blog):
\`\`\`css
@import "tailwindcss";
@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";
@plugin "daisyui";
@plugin "@tailwindcss/typography";
\`\`\`

Documentation site only (no blog — omit the blog import):
\`\`\`css
@import "tailwindcss";
@import "@levino/shipyard-base";
@import "@levino/shipyard-docs";
@plugin "daisyui";
@plugin "@tailwindcss/typography";
\`\`\`

### Step 3: Configure astro.config.mjs

The \`?url\` import and \`css: appCss\` parameter are both required — without them, styles will not be applied.

Full-featured site:
\`\`\`javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  integrations: [
    shipyard({
      css: appCss,
      brand: 'My Site',
      title: 'My Site',
      tagline: 'Built with shipyard',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(),
    shipyardBlog(),
  ],
})
\`\`\`

Documentation site only:
\`\`\`javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  integrations: [
    shipyard({
      css: appCss,
      brand: 'My Site',
      title: 'My Site',
      tagline: 'Built with shipyard',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
      },
    }),
    shipyardDocs(),
  ],
})
\`\`\`

### Step 4: Configure src/content.config.ts (Astro 5+)

This file is essential. Without it you get "The collection does not exist" errors.

Full-featured site:
\`\`\`typescript
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'
import { blogSchema } from '@levino/shipyard-blog'
import { glob } from 'astro/loaders'

const docs = defineCollection(createDocsCollection('./docs'))
const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
export const collections = { docs, blog }
\`\`\`

Documentation site only:
\`\`\`typescript
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))
export const collections = { docs }
\`\`\`

### Step 5: Create content

Create docs/index.md:
\`\`\`yaml
---
title: Getting Started
sidebar:
  position: 1
description: Introduction to my project
---
\`\`\`

## Common Mistakes

- **Missing \`css: appCss\` or \`?url\` import**: Components render but are completely unstyled.
- **Missing a shipyard CSS import**: Components from the missing package are partially unstyled because Tailwind doesn't scan that package's classes.
- **Missing \`src/content.config.ts\`**: Build fails with "The collection does not exist".

## Key Documentation Pages

- [Getting Started](/en/docs/getting-started) - Full setup guide with troubleshooting
- [Tailwind CSS Setup](/en/docs/guides/tailwind-setup) - Detailed CSS configuration and migration guide
- [Base Package](/en/docs/base-package) - Layouts, navigation, and configuration
- [Docs Package](/en/docs/docs-package) - Sidebar, pagination, and frontmatter options
- [Blog Package](/en/docs/blog-package) - Blog functionality and customization
- [Server Mode](/en/docs/server-mode) - Server-side rendering with auth middleware`,
      },
    }),
    shipyardBlog(),
    pagefind(),
  ],
})
