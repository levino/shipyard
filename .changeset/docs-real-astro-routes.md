---
'@levino/shipyard-docs': patch
---

The docs plugin no longer writes generated `.astro` route components into
`node_modules` at build time. Routes are now served by real, shipped
components (`astro/pages/DocsEntry.astro` and
`astro/pages/DocsVersionRedirect.astro`) that resolve their docs instance from
the route pattern — the same approach the blog plugin uses. This removes a
duplicate, drift-prone code path (the source of the empty docs `<title>`/
`og:title` bug) and keeps all route markup in real, type-checked `.astro`
files.
