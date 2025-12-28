---
"@levino/shipyard-docs": patch
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

The generated `/llms.txt` provides an index with links to all documentation pages, while `/llms-full.txt` includes the complete content of all pages in a single file for comprehensive context.
