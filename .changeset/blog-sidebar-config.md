---
'@levino/shipyard-blog': patch
---

Add customizable blog sidebar and pagination options

## Sidebar Configuration

Configure how blog posts appear in the sidebar:

- **blogSidebarCount**: Control the number of posts shown (default: 5)
  - Set to a number to limit displayed posts
  - Set to `'ALL'` to show all posts

- **blogSidebarTitle**: Customize the sidebar section title (default: 'Recent posts')

When posts exceed the configured limit, a "View all posts" link appears at the same level as the sidebar title for easy navigation.

## Pagination

The blog index page now supports pagination with DaisyUI-styled navigation:

- **postsPerPage**: Number of posts per page (default: 10)
- Pages are accessible at `/blog` (page 1) and `/blog/page/2`, `/blog/page/3`, etc.
- Pagination displays: `prev | first | ... | 7 | 8 (active) | 9 | ... | last | next`
- Adjacent page numbers shown around current page with ellipsis for gaps
- Full support for i18n localized blog pages

Example configuration:
```js
// astro.config.mjs
import shipyardBlog from '@levino/shipyard-blog'

export default defineConfig({
  integrations: [
    shipyardBlog({
      blogSidebarCount: 5,
      blogSidebarTitle: 'Recent posts',
      postsPerPage: 10,
    }),
  ],
})
```
