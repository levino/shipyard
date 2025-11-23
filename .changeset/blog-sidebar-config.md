---
'@levino/shipyard-blog': patch
---

Add customizable blog sidebar options

You can now configure how blog posts appear in the sidebar:

- **blogSidebarCount**: Control the number of posts shown (default: 5)
  - Set to a number to limit displayed posts
  - Set to `'ALL'` to show all posts

- **blogSidebarTitle**: Customize the sidebar section title (default: 'Recent posts')

When posts exceed the configured limit, a "View all posts" link automatically appears.

Example configuration:
```js
// astro.config.mjs
import shipyardBlog from '@levino/shipyard-blog'

export default defineConfig({
  integrations: [
    shipyardBlog({
      blogSidebarCount: 5,
      blogSidebarTitle: 'Recent posts',
    }),
  ],
})
```
