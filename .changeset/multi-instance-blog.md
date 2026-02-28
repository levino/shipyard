---
'@levino/shipyard-blog': patch
---

You can now run multiple blog instances in the same Astro site. Each instance gets its own URL prefix, content collection, sidebar, tags, and RSS feed — fully isolated from the others. This is useful for sites that need separate content sections like newsletters, reports, or changelogs alongside a regular blog.

Configure additional instances by calling `shipyardBlog()` multiple times in your Astro config with different `routeBasePath` values. The collection name defaults to the route base path (e.g., `routeBasePath: 'newsletters'` reads from the `newsletters` collection).
