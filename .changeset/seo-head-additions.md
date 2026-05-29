---
'@levino/shipyard-base': patch
---

Richer, more accessible page `<head>` out of the box: the layout now sets the
`lang` attribute on `<html>`, adds `og:site_name`, `og:url`, `twitter:title`
and `twitter:description`, lets pages set the Open Graph object type via a new
`ogType` prop, and renders a "skip to content" link as the first focusable
element (label configurable via `skipToContentLabel`). Existing pages keep
their current behavior — these are additive.
