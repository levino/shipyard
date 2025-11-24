---
'@levino/shipyard-docs': patch
---

You can now display helpful metadata at the bottom of documentation pages to improve transparency and enable community contributions:

- **"Edit this page" links**: Enable with the `editUrl` configuration option to show a link that takes users directly to the source file in your repository
- **Last update timestamp**: Enable with `showLastUpdateTime: true` to automatically display when each page was last modified (based on git history)
- **Last update author**: Enable with `showLastUpdateAuthor: true` to show who last modified the page (based on git history)

Example configuration:
```typescript
shipyardDocs({
  editUrl: 'https://github.com/your-org/your-repo/edit/main/docs',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

You can also override these settings per-page using frontmatter:
- `custom_edit_url`: Set a custom edit URL or `null` to disable for a specific page
- `last_update_time`: Override the timestamp or set to `false` to hide
- `last_update_author`: Override the author name or set to `false` to hide
