---
'@levino/shipyard-base': patch
'@levino/shipyard-docs': patch
---

Three improvements for docs pages:

- The "On this page" table of contents on wide screens now stays in view while you scroll, as it was meant to.
- Headings `h2` to `h4` in markdown link to their own anchor. Click a heading to get the URL of that section in the address bar; a `#` fades in on hover and keyboard focus. Headings keep a scroll margin, so a sticky navigation bar no longer covers them after a jump.
- shipyard's built-in labels ("On this page", "Next", "Previous", "Edit this page", "Last updated", menu and skip-link labels, …) follow the page's language. English and German ship with shipyard. Sites without Astro `i18n` routing can set the new `locale` option, e.g. `shipyard({ locale: 'de', … })`, which also sets `<html lang>`. Dates under "Last updated" are formatted in the page's language.
