---
"@levino/shipyard-docs": patch
---

Add `prerender` configuration option to disable prerendering for SSR sites with auth middleware

You can now set `prerender: false` when configuring shipyard-docs to render docs pages on-demand instead of at build time. This is useful for SSR sites with authentication middleware that need access to `Astro.request.headers` or cookies.

```javascript
shipyardDocs({
  routeBasePath: 'docs',
  prerender: false, // Required for SSR sites with auth middleware
})
```
