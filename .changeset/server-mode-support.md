---
"@levino/shipyard-docs": minor
"@levino/shipyard-blog": minor
---

You can now use shipyard with Astro's server-side rendering (SSR) mode for on-demand page rendering.

Both the docs and blog integrations now support a `prerender` configuration option that controls whether pages should be pre-rendered at build time (static, default) or rendered on-demand per request (SSR).

To enable SSR mode, set `output: 'server'` in your Astro config and configure the integrations with `prerender: false`:

```js
import node from '@astrojs/node'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    shipyardDocs({ prerender: false }),
    shipyardBlog({ prerender: false }),
  ],
})
```

This is useful for sites that need dynamic content, user authentication, or database-driven pages.
