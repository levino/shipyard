---
"@levino/shipyard-docs": patch
"@levino/shipyard-blog": patch
---

You can now use shipyard with Astro's server mode (`output: 'server'`) without needing to set `prerender: false` explicitly. Shipyard automatically detects the output mode and configures prerendering accordingly:

- `output: 'server'` → SSR by default (no prerendering)
- `output: 'static'` or `output: 'hybrid'` → prerendering by default

This enables use cases like authentication middleware that needs access to request headers/cookies at runtime.
