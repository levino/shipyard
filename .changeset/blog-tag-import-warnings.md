---
'@levino/shipyard-blog': patch
---

Building a site with the blog plugin no longer prints Rollup "circular
dependency between chunks" warnings about `getTagLabel`, `getTagDescription`,
`getTagPermalink` and `getReadingTime`. The blog page components now import
these helpers from their source modules instead of through the package entry
point.
