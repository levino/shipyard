---
"@levino/shipyard-base": patch
---

Fix footer links to work without i18n. The footer's withLocale function now checks if Astro.currentLocale exists before adding a locale prefix, fixing broken links (like /imprint) when i18n is not configured.
