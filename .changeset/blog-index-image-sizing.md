---
'@levino/shipyard-base': patch
'@levino/shipyard-blog': patch
'@levino/shipyard-docs': patch
---

Blog index images now stay a sensible size and load faster. The featured first post is rendered as a banner capped at 320 px tall (with `object-cover`) so tall or large source photos no longer dominate the page. Both the featured banner and the side-card thumbnails now request explicit widths from Astro's image pipeline, so the served files are properly downscaled instead of being delivered at the original resolution.
