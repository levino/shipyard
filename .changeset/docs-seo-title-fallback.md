---
'@levino/shipyard-docs': patch
---

Documentation pages now produce correct `<title>`, `og:title` and
`og:description` again. Previously a docs page that defined only `title` in its
frontmatter (without `title_meta`) rendered an empty `<title>` and an
`og:title` that fell back to the site name, so social/link previews for docs
pages came out blank. The page `title` is now used as the SEO/Open Graph title
whenever no explicit `title_meta` override is set.
