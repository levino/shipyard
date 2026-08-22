---
'@levino/shipyard-base': minor
'@levino/shipyard-blog': minor
'@levino/shipyard-docs': minor
---

shipyard now runs on Astro 7. Update your site to `astro@^7.2.4` and the shipyard packages together — the Astro peer dependency has moved to `^7.2.4`, so Astro 6 is no longer supported.

Astro 7 renders Markdown with its new Sätteri pipeline by default, which does not run remark plugins. Because shipyard's admonitions, npm2yarn tabs and block directives are all remark plugins, shipyard now configures the `unified()` processor from `@astrojs/markdown-remark` for you. Your existing Markdown keeps rendering exactly as before with no changes to your config, and any remark plugins you add yourself still run alongside shipyard's.

Two things in Astro's own upgrade guide are worth checking on a content site: `compressHTML` now defaults to `'jsx'`, which strips whitespace between inline elements, and Astro's new compiler rejects unclosed tags that earlier versions silently accepted.
