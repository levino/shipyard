---
title: '@levino/shipyard-blog'
sidebar_position: 5
description: Blog plugin for shipyard with pagination, sidebar, and git metadata
---

# @levino/shipyard-blog

The blog package provides complete blogging functionality for shipyard including paginated blog index, individual post pages, sidebar with recent posts, and git metadata display.

## Installation

```bash
npm install @levino/shipyard-blog
```

### Peer Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `astro` | ^5.15 | Astro framework |

The blog package also requires `@levino/shipyard-base` to be installed and configured.

## Quick Start

### 1. Configure Astro

Add the blog integration to your `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    shipyard({
      brand: 'My Site',
      title: 'My Site',
      tagline: 'A blog about things',
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
description: A brief description of this post
date: 2025-01-15
---

# My First Post

Your blog post content here...
```

---

## Integration Configuration

The `shipyardBlog()` integration accepts the following options:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `blogSidebarCount` | `number \| 'ALL'` | No | `5` | Number of recent posts in sidebar |
| `blogSidebarTitle` | `string` | No | `'Recent posts'` | Title for the sidebar section |
| `postsPerPage` | `number` | No | `10` | Number of posts per page on index |
| `editUrl` | `string` | No | — | Base URL for "Edit this post" links |
| `showLastUpdateTime` | `boolean` | No | `false` | Show last update timestamp from git |
| `showLastUpdateAuthor` | `boolean` | No | `false` | Show last update author from git |

### Example with All Options

```javascript
shipyardBlog({
  blogSidebarCount: 10,
  blogSidebarTitle: 'Latest Articles',
  postsPerPage: 15,
  editUrl: 'https://github.com/user/repo/edit/main/blog',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

### Show All Posts in Sidebar

```javascript
shipyardBlog({
  blogSidebarCount: 'ALL',
})
```

### Routes Generated

The integration automatically generates routes:

| With i18n | Without i18n | Description |
|-----------|--------------|-------------|
| `/[locale]/blog` | `/blog` | Blog index (first page) |
| `/[locale]/blog/page/[page]` | `/blog/page/[page]` | Paginated blog pages |
| `/[locale]/blog/[...slug]` | `/blog/[...slug]` | Individual blog posts |

---

## Frontmatter Schema

Blog posts support the following frontmatter options:

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Post title |
| `description` | `string` | Yes | Post description/excerpt |
| `date` | `Date` | Yes | Publication date (YYYY-MM-DD) |

### Optional Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `last_update_author` | `string \| false` | No | From git | Override author, or `false` to hide |
| `last_update_time` | `Date \| false` | No | From git | Override timestamp, or `false` to hide |
| `custom_edit_url` | `string \| null` | No | Auto | Custom edit URL, or `null` to disable |

### Complete Frontmatter Example

```yaml
---
title: Understanding TypeScript Generics
description: A deep dive into TypeScript generics with practical examples
date: 2025-01-15
last_update_author: John Doe
last_update_time: 2025-01-20
custom_edit_url: https://github.com/user/repo/edit/main/blog/typescript-generics.md
---
```

### Minimal Frontmatter Example

```yaml
---
title: Hello World
description: My first blog post
date: 2025-01-01
---
```

---

## Blog Features

### Paginated Blog Index

The blog index page shows posts sorted by date (newest first) with pagination controls:

- **Previous/Next** buttons for adjacent pages
- **First/Last** page quick links
- **Numbered page** links for direct navigation
- **Ellipsis** (...) when there are skipped page numbers

### Blog Sidebar

The sidebar shows recent posts for easy navigation:

- Configurable number of posts (`blogSidebarCount`)
- "View all posts" link when there are more posts
- Respects i18n locale filtering

### Post Navigation

Each blog post includes navigation to older/newer posts:

- **Newer Post** link (left side)
- **Older Post** link (right side)
- Posts are ordered by publication date

### Edit Links

When `editUrl` is configured, each post displays an "Edit this post" link.

### Git Metadata

When enabled, posts display:

- **Last updated** timestamp from git history
- **Author** name from git commit

---

## Components

Import components from `@levino/shipyard-blog/astro`:

```javascript
import { BlogEntry, BlogPostPagination, Layout } from '@levino/shipyard-blog/astro'
```

### Layout

Blog-specific layout with sidebar navigation.

```astro
---
import { Layout } from '@levino/shipyard-blog/astro'
---

<Layout title="My Blog Post">
  <article>
    <h1>Post Content</h1>
  </article>
</Layout>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Page title |

The layout automatically:
- Builds sidebar with recent posts
- Respects `blogSidebarCount` and `blogSidebarTitle` config
- Filters posts by current locale when i18n is enabled

### BlogEntry

Renders individual blog post pages. Used internally by the integration.

**Features:**
- Generates static paths for all posts
- Handles i18n locale routing
- Provides older/newer post navigation
- Integrates metadata and pagination components
- Displays table of contents

### BlogPostPagination

Renders navigation between adjacent blog posts.

```astro
<BlogPostPagination
  older={{ href: "/blog/older-post", title: "Older Post Title" }}
  newer={{ href: "/blog/newer-post", title: "Newer Post Title" }}
/>
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `older` | `PaginationLink` | No | — | Link to older post |
| `newer` | `PaginationLink` | No | — | Link to newer post |
| `olderLabel` | `string` | No | `'Older Post'` | Label for older link |
| `newerLabel` | `string` | No | `'Newer Post'` | Label for newer link |

**PaginationLink:**

```typescript
interface PaginationLink {
  href: string   // Post URL
  title: string  // Post title
}
```

### BlogMetadata

Displays edit link, last update time, and author for a post.

```astro
<BlogMetadata
  editUrl="https://github.com/user/repo/edit/main/blog/post.md"
  lastUpdated={new Date('2025-01-15')}
  lastAuthor="John Doe"
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `editUrl` | `string` | No | URL to edit this post |
| `lastUpdated` | `Date` | No | Last update timestamp |
| `lastAuthor` | `string` | No | Last update author name |

Only renders if at least one prop is provided.

---

## Helper Functions

### getGitMetadata

Retrieves git metadata for a file.

```typescript
import { getGitMetadata } from '@levino/shipyard-blog'

const metadata = getGitMetadata('/absolute/path/to/post.md')
// Returns: { lastUpdated?: Date, lastAuthor?: string }
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | `string` | Yes | Absolute path to the file |

**Returns:** `GitMetadata` object with optional `lastUpdated` (Date) and `lastAuthor` (string).

### getEditUrl

Generates an edit URL for a blog post.

```typescript
import { getEditUrl } from '@levino/shipyard-blog'

getEditUrl('https://github.com/user/repo/edit/main/blog', 'my-post')
// Returns: 'https://github.com/user/repo/edit/main/blog/my-post.md'

getEditUrl(undefined, 'my-post')
// Returns: undefined
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `editUrlBase` | `string \| undefined` | No | Base edit URL |
| `postId` | `string` | Yes | Post ID (file path) |

**Behavior:**
- Automatically adds `.md` extension if missing
- Normalizes slashes in URLs
- Returns `undefined` if no base URL provided

---

## TypeScript Types

Import types from `@levino/shipyard-blog`:

```typescript
import type { BlogConfig, GitMetadata } from '@levino/shipyard-blog'
```

### BlogConfig

Complete configuration interface:

```typescript
interface BlogConfig {
  blogSidebarCount: number | 'ALL'  // Number of posts in sidebar
  blogSidebarTitle: string          // Sidebar section title
  postsPerPage: number              // Posts per page on index
  editUrl?: string                  // Base edit URL
  showLastUpdateTime: boolean       // Show last update timestamp
  showLastUpdateAuthor: boolean     // Show last update author
}
```

### GitMetadata

Git metadata for a file:

```typescript
interface GitMetadata {
  lastUpdated?: Date    // Last commit date
  lastAuthor?: string   // Last commit author
}
```

### blogSchema

Zod schema for validating blog post frontmatter:

```typescript
import { blogSchema } from '@levino/shipyard-blog'

// Use in content collection definition
const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
```

---

## Virtual Module

The blog package provides a virtual module with configuration:

```typescript
import blogConfig from 'virtual:shipyard-blog/config'

console.log(blogConfig.postsPerPage)       // 10
console.log(blogConfig.blogSidebarCount)   // 5
console.log(blogConfig.blogSidebarTitle)   // 'Recent posts'
```

---

## Internationalization

The blog package fully supports Astro's i18n features:

- Automatic locale prefix in routes
- Per-locale post filtering
- Locale-aware sidebar and pagination
- Separate post ordering per locale

Organize your blog posts by locale:

```
blog/
├── en/
│   ├── 2025-01-15-first-post.md
│   └── 2025-01-20-second-post.md
├── de/
│   ├── 2025-01-15-erster-beitrag.md
│   └── 2025-01-20-zweiter-beitrag.md
```

---

## File Naming Conventions

Blog post files can follow different naming conventions:

### Date-Prefixed (Recommended)

```
blog/
├── 2025-01-15-getting-started.md
├── 2025-01-20-advanced-topics.md
```

The date in the filename is for organization only. The `date` field in frontmatter determines the actual publication date.

### Simple Names

```
blog/
├── getting-started.md
├── advanced-topics.md
```

### Nested Folders

```
blog/
├── tutorials/
│   ├── getting-started.md
│   └── advanced.md
├── news/
│   ├── announcement.md
```

---

## Styling

Blog components use DaisyUI and Tailwind CSS classes:

- **Blog index:** Card-style post listings with hover effects
- **Post pages:** Prose typography with table of contents
- **Pagination:** Button-style navigation with proper spacing
- **Metadata:** Subtle styling with icons for dates and authors

All components are responsive and work on mobile and desktop.
