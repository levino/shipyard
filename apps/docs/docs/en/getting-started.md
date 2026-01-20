---
title: Getting Started
sidebar:
  position: 2
description: Learn how to install and configure shipyard for your Astro project
---

# Getting Started with shipyard

This guide walks you through setting up shipyard in your Astro project. By the end, you'll have a fully configured site with documentation and blog functionality.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18 or later
- **npm** (comes with Node.js)
- An existing Astro project, or create one with `npm create astro@latest`

## Installation

### Step 1: Install Packages

Install the shipyard packages you need:

```bash
# Full-featured site (docs + blog)
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog

# Documentation site only
npm install @levino/shipyard-base @levino/shipyard-docs

# Blog site only
npm install @levino/shipyard-base @levino/shipyard-blog

# Core components only
npm install @levino/shipyard-base
```

### Step 2: Install Peer Dependencies

shipyard requires the following peer dependencies:

```bash
npm install tailwindcss daisyui @tailwindcss/typography @astrojs/tailwind
```

## Required Files Overview

Before diving into the configuration details, here's a quick checklist of the files you'll need to create or modify:

| File | Purpose | Required? |
|------|---------|-----------|
| `astro.config.mjs` | Astro integrations and site settings | Yes |
| `tailwind.config.mjs` | Tailwind CSS configuration | Yes |
| `src/content.config.ts` | **Content collection schemas and loaders** | Yes |
| `docs/` directory | Documentation markdown files | Yes (for docs) |
| `blog/` directory | Blog post markdown files | Yes (for blog) |

The most commonly missed file is `src/content.config.ts` — without it, you'll get errors like "The collection does not exist" when building your site.

## Configuration

### Astro Configuration

Update your `astro.config.mjs`:

```javascript
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({
      brand: 'My Site',
      title: 'My Awesome Site',
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
```

**Important configuration notes:**

| Setting | Why it's needed |
|---------|-----------------|
| `tailwind({ applyBaseStyles: false })` | Prevents Tailwind's base styles from conflicting with DaisyUI. Without this, you may see unstyled or broken components. |
| Integration order | Tailwind must come before shipyard integrations to ensure styles are processed correctly. |

### Tailwind Configuration

Create or update `tailwind.config.mjs`:

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

### Content Collections (Required)

Create `src/content.config.ts` — **this file is essential** for shipyard to find and render your documentation and blog content:

```typescript
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
```

## Project Structure

After setup, your project should look like this:

```
my-site/
├── docs/                       # Documentation markdown files
│   ├── index.md               # Docs landing page
│   └── getting-started.md     # Documentation pages
├── blog/                       # Blog post markdown files
│   └── 2025-01-15-first-post.md
├── src/
│   ├── content.config.ts      # Content collection config
│   └── pages/                 # Additional pages
│       └── index.astro        # Homepage
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Creating Content

### Documentation Pages

Create markdown files in the `docs/` directory:

```markdown
---
title: Introduction
sidebar:
  position: 1
description: Learn about our project
---

# Introduction

Your documentation content here...
```

**Key frontmatter options:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Page title |
| `sidebar.position` | `number` | Order in sidebar (lower = earlier) |
| `description` | `string` | Page description for SEO |

See [@levino/shipyard-docs](./docs-package) for all frontmatter options.

### Blog Posts

Create markdown files in the `blog/` directory:

```markdown
---
title: My First Post
description: A brief description of this post
date: 2025-01-15
---

# My First Post

Your blog post content here...
```

**Required frontmatter:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Post title |
| `description` | `string` | Post description/excerpt |
| `date` | `Date` | Publication date (YYYY-MM-DD) |

See [@levino/shipyard-blog](./blog-package) for all frontmatter options.

### Custom Pages with Layouts

For standalone pages that aren't part of docs or blog collections, use shipyard's layouts directly.

**Markdown pages** – Use the Markdown layout for pages with prose styling:

```markdown
---
layout: '@levino/shipyard-base/layouts/Markdown.astro'
title: About Us
description: Learn about our team
---

# About Us

Your markdown content with nice typography styling...
```

**Astro component pages** – Import the Page layout for full control:

```astro
---
// src/pages/index.astro
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="Home" description="Welcome to our site">
  <div class="hero min-h-[60vh] bg-base-200">
    <div class="hero-content text-center">
      <h1 class="text-5xl font-bold">Welcome!</h1>
      <p>Your custom homepage content...</p>
    </div>
  </div>
</Page>
```

**Landing pages** – Use Splash layout for centered content without prose styling:

```markdown
---
layout: '@levino/shipyard-base/layouts/Splash.astro'
title: Welcome
---

<div class="hero min-h-screen">
  <h1 class="text-5xl font-bold">My Landing Page</h1>
</div>
```

See [@levino/shipyard-base layouts](./base-package#layouts) for all available layouts and options.

## Adding Internationalization

shipyard supports Astro's i18n features. Update your Astro config:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    // ... your integrations
  ],
})
```

Organize content by locale:

```
docs/
├── en/
│   ├── index.md
│   └── getting-started.md
├── de/
│   ├── index.md
│   └── getting-started.md

blog/
├── en/
│   └── 2025-01-15-first-post.md
├── de/
│   └── 2025-01-15-erster-beitrag.md
```

## Running Your Site

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Package Overview

shipyard consists of three packages that work together:

| Package | Purpose | Documentation |
|---------|---------|---------------|
| `@levino/shipyard-base` | Core layouts, components, and configuration | [Base Package](./base-package) |
| `@levino/shipyard-docs` | Documentation features, sidebar, pagination | [Docs Package](./docs-package) |
| `@levino/shipyard-blog` | Blog functionality, post listing, navigation | [Blog Package](./blog-package) |

## Next Steps

Now that you have shipyard set up, explore these topics:

- **[@levino/shipyard-base](./base-package)** – Layouts, components, and configuration
- **[@levino/shipyard-docs](./docs-package)** – Documentation features and customization
- **[@levino/shipyard-blog](./blog-package)** – Blog features and customization
- **[Server Mode (SSR)](./server-mode)** – Using shipyard with server-side rendering
- **[Feature Roadmap](./roadmap)** – See what features are coming next

## Troubleshooting

### "The collection does not exist" or "Cannot read properties of undefined"

```
The collection "docs" does not exist or is empty.
Cannot read properties of undefined (reading 'render')
```

**Cause:** Missing or incorrectly configured `src/content.config.ts` file.

**Solution:** Create the content config file as shown in [Content Collections](#content-collections-required) above. Make sure:
1. The file is located at `src/content.config.ts` (not in the root directory)
2. You export a `collections` object with your defined collections
3. The collection names match what the shipyard plugins expect (`docs` for documentation, `blog` for blog posts)

### Build errors after installation

If you see TypeScript or build errors immediately after installation:

1. **Check peer dependencies** — Ensure all required peer dependencies are installed:
   ```bash
   npm install tailwindcss daisyui @tailwindcss/typography @astrojs/tailwind
   ```

2. **Verify Tailwind config** — Make sure `tailwind.config.mjs` includes the shipyard packages in the `content` array

3. **Check integration order** — In `astro.config.mjs`, Tailwind must come before shipyard integrations

### Styles not applying correctly

If components appear unstyled or broken:

1. **Check `applyBaseStyles`** — Ensure Tailwind is configured with `applyBaseStyles: false`:
   ```javascript
   tailwind({ applyBaseStyles: false })
   ```

2. **Verify content paths** — Make sure `tailwind.config.mjs` includes paths to shipyard packages and your content directories

### Documentation pages return 404

1. **Check folder structure** — Documentation files should be in `docs/` at the project root, not in `src/docs/`
2. **Verify content.config.ts** — Make sure the glob loader points to the correct directory (`'./docs'`)
3. **Check for index.md** — Ensure you have at least one markdown file (e.g., `docs/index.md`)

## Need Help?

- Check the [GitHub repository](https://github.com/levino/shipyard) for issues and discussions
- Explore the [live demo](https://i18n.demos.shipyard.levinkeller.de/en/) for examples
