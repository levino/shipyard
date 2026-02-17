---
'@levino/shipyard-blog': patch
'@levino/shipyard-docs': patch
---

Blog post images and docs images now use Astro's `image()` schema helper and the `<Image>` component for automatic optimization. Use relative paths to local image files in frontmatter instead of external URLs.
