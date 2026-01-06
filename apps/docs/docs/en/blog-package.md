---
title: '@levino/shipyard-blog'
sidebar:
  position: 5
description: Blog plugin for shipyard with pagination and sidebar
---

# @levino/shipyard-blog

The blog package provides blogging functionality for shipyard including paginated blog index, sidebar with recent posts, and git metadata display.

## Installation

```bash
npm install @levino/shipyard-blog
```

Requires `@levino/shipyard-base` to be installed and configured.

### Tailwind Configuration

For Tailwind to correctly pick up the classes used in shipyard-blog components, you need to add the package path to the `content` array in your `tailwind.config.mjs`:

```javascript
const path = require('node:path')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // Include shipyard-base (required)
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../astro/**/*.astro',
    ),
    // Include shipyard-blog
    path.join(
      path.dirname(require.resolve('@levino/shipyard-blog')),
      '../astro/**/*.astro',
    ),
  ],
  // ... rest of your config
}
```

## Quick Start

### 1. Configure Astro

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    shipyard({
      brand: 'My Site',
      title: 'My Site',
      tagline: 'A blog',
      navigation: {
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardBlog(),
  ],
})
```

### 2. Set Up Content Collection

Create `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { blogSchema } from '@levino/shipyard-blog'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})

export const collections = { blog }
```

### 3. Create Blog Posts

Add markdown files to the `blog/` directory:

```markdown
---
title: My First Post
description: A brief description
date: 2025-01-15
---

# My First Post

Your blog post content...
```

That's it! Your blog is now available at `/blog`.

---

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `blogSidebarCount` | `number \| 'ALL'` | `5` | Number of recent posts in sidebar |
| `blogSidebarTitle` | `string` | `'Recent posts'` | Title for the sidebar section |
| `postsPerPage` | `number` | `10` | Number of posts per page |
| `editUrl` | `string` | — | Base URL for "Edit this post" links |
| `showLastUpdateTime` | `boolean` | `false` | Show last update timestamp from git |
| `showLastUpdateAuthor` | `boolean` | `false` | Show last update author from git |

### Example

```javascript
shipyardBlog({
  blogSidebarCount: 10,
  blogSidebarTitle: 'Latest Articles',
  postsPerPage: 15,
  editUrl: 'https://github.com/user/repo/edit/main/blog',
  showLastUpdateTime: true,
})
```

---

## Frontmatter Options

### Required

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Post title |
| `description` | `string` | Post description/excerpt |
| `date` | `Date` | Publication date (YYYY-MM-DD) |

### Optional

| Field | Type | Description |
|-------|------|-------------|
| `last_update_author` | `string \| false` | Override author, or `false` to hide |
| `last_update_time` | `Date \| false` | Override timestamp, or `false` to hide |
| `custom_edit_url` | `string \| null` | Custom edit URL, or `null` to disable |

### Example

```yaml
---
title: Understanding TypeScript
description: A deep dive into TypeScript generics
date: 2025-01-15
---
```

---

## Internationalization

Organize posts by locale:

```
blog/
├── en/
│   └── 2025-01-15-first-post.md
├── de/
│   └── 2025-01-15-erster-beitrag.md
```

Locale-based routing is automatic when Astro's i18n is configured.
