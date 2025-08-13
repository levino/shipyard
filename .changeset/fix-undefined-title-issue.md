---
"@levino/shipyard-base": patch
"@levino/shipyard-blog": patch
---

Fix undefined title issue and improve title handling

- Fix pages showing "Sitename - undefined" when no page title is defined
- Add functional `getTitle` utility in `tools/title.ts` for consistent title handling
- Improve blog Layout.astro to properly pass through title props
- Add meaningful "Blog" title to blog index page
- Prevent title duplication when page title equals site title
- Add comprehensive unit and integration tests with Playwright