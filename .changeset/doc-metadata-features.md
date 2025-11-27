---
'@levino/shipyard-docs': patch
'@levino/shipyard-blog': patch
---

## Documentation Metadata Features

You can now display helpful metadata at the bottom of documentation pages to improve transparency and enable community contributions:

- **"Edit this page" links**: Enable with the `editUrl` configuration option to show a link that takes users directly to the source file in your repository
- **Last update timestamp**: Enable with `showLastUpdateTime: true` to automatically display when each page was last modified (based on git history)
- **Last update author**: Enable with `showLastUpdateAuthor: true` to show who last modified the page (based on git history)

Example docs configuration:
```typescript
shipyardDocs({
  editUrl: 'https://github.com/your-org/your-repo/edit/main/docs',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

## Multiple Documentation Instances

You can now create multiple documentation sections with different collections by using the `collectionName` option:

```typescript
// Primary docs at /docs
shipyardDocs({
  routeBasePath: 'docs',
  collectionName: 'docs', // defaults to routeBasePath
  editUrl: 'https://github.com/your-org/your-repo/edit/main/docs',
})

// Secondary docs (e.g., guides) at /guides
shipyardDocs({
  routeBasePath: 'guides',
  collectionName: 'guides',
  editUrl: 'https://github.com/your-org/your-repo/edit/main/guides',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

## Blog Metadata Features

The blog plugin now supports the same metadata features as the docs plugin:

```typescript
shipyardBlog({
  editUrl: 'https://github.com/your-org/your-repo/edit/main/blog',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

## Per-Page/Post Frontmatter Overrides

You can override metadata settings per-page (docs) or per-post (blog) using frontmatter:
- `custom_edit_url`: Set a custom edit URL or `null` to disable for a specific page/post
- `last_update_time`: Override the timestamp or set to `false` to hide
- `last_update_author`: Override the author name or set to `false` to hide

**Note:** Git metadata features require access to git history. When deploying with CI/CD, ensure you're not using shallow clones (use `fetch-depth: 0` with GitHub Actions).
