# @levino/shipyard-blog

Blog plugin for [Shipyard](https://shipyard.levinkeller.de), a general-purpose page builder for Astro.

## Installation

```bash
npm install @levino/shipyard-blog
```

## Peer Dependencies

- `astro` ^5.15

## Basic Usage

### Astro Integration

```ts
// astro.config.ts
import shipyardBlog from '@levino/shipyard-blog'

export default defineConfig({
  integrations: [
    shipyardBlog({
      blogSidebarCount: 5,
      blogSidebarTitle: 'Recent posts',
      postsPerPage: 10,
      editUrl: 'https://github.com/user/repo/edit/main/blog',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
  ],
})
```

### Content Collection Schema

```ts
// content.config.ts
import { defineCollection } from 'astro:content'
import { blogSchema } from '@levino/shipyard-blog'

const blog = defineCollection({
  schema: blogSchema,
})

export const collections = { blog }
```

### Routes

The integration automatically injects these routes:

- `/blog` - Blog index
- `/blog/page/[page]` - Paginated blog index
- `/blog/[...slug]` - Individual blog posts

With i18n enabled, routes are prefixed with `[locale]`.

## Documentation

For complete documentation and examples, visit [shipyard.levinkeller.de](https://shipyard.levinkeller.de).

## License

MIT
