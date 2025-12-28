---
"@levino/shipyard-docs": patch
"@levino/shipyard-base": patch
---

You can now automatically generate llms.txt and llms-full.txt files for your documentation site, making your docs accessible to AI coding assistants like Claude, Cursor, and others that support the llms.txt standard (https://llmstxt.org/).

Enable this feature by adding the `llmsTxt` configuration option:

```javascript
shipyardDocs({
  llmsTxt: {
    enabled: true,
    projectName: 'My Project',
    summary: 'A brief description of your project for LLMs',
  },
})
```

**Key features:**

- Files are generated at `/{routeBasePath}/llms.txt` (e.g., `/docs/llms.txt`), supporting multiple docs instances
- When i18n is configured, only content from the default locale is included to avoid mixing languages
- A sidebar link with a copy-to-clipboard button is automatically added, making it easy to share the URL with AI assistants
