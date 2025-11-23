---
"@levino/shipyard-docs": patch
---

Add support for multiple documentation instances with configurable route mounting

- Added `DocsConfig` interface with `routeBasePath` option to mount docs at custom paths
- Added `createDocsCollection()` helper function for defining docs content collections
- Added `getDocPath()` and `getRouteParams()` utility functions for custom route generation
- Updated `DocsLayout` component to accept `routeBasePath` and `docsData` props for advanced usage
- Exported `DocsLayout` component from `@levino/shipyard-docs/astro`
- Exported `DocsData` type and `toSidebarEntries` function for building custom sidebars
