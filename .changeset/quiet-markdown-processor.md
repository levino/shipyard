---
'@levino/shipyard-base': patch
---

Builds no longer warn that `markdown.processor` is set to `satteri` when you never set it. Astro 7.3 resolves an unset processor to Sätteri, and shipyard mistook that default for your choice. shipyard still switches the default to `unified()` so admonitions, npm2yarn tabs and block directives render. A processor you configure yourself is now left as it is: a `unified()` processor gets the shipyard plugins added, any other processor stays untouched and shipyard warns once that its Markdown features will not render with it.
