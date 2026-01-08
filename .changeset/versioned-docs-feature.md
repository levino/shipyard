---
"@levino/shipyard-docs": patch
"@levino/shipyard-base": patch
---

You can now create versioned documentation to maintain multiple versions of your docs side-by-side.

**Key features:**
- Configure multiple documentation versions (e.g., v1, v2, latest) with automatic URL routing
- Version selector UI component displays in both navbar and sidebar for easy version switching
- Mark versions as stable, deprecated, or unreleased with visual badges
- Sidebar automatically filters to show only pages in the current version
- Pagination stays within the same version boundaries
- Support for a "latest" alias that always points to the current version
- Automatic redirect from docs root to current version

**Getting started:**
```typescript
// astro.config.mjs
shipyardDocs({
  routeBasePath: 'docs',
  versions: {
    current: 'v2',
    available: [
      { version: 'v2', label: 'Version 2.0' },
      { version: 'v1', label: 'Version 1.0' }
    ],
    deprecated: ['v1'],
    stable: 'v2'
  }
})
```

See the [versioning guide](/en/guides/versioning) for complete documentation.
