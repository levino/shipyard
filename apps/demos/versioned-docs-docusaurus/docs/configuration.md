---
title: Configuration (v2)
description: Configuration options available in version 2.0
sidebar_position: 2
---

# Configuration Guide (v2)

Configure shipyard to match your project needs.

## Basic Configuration

Create or edit `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyard({
      title: 'My Project',
      brand: 'MyApp',
    }),
    shipyardDocs({
      // v2 feature: versioning support
      versions: {
        current: 'v2',
        available: [
          { version: 'v2', label: 'Latest' },
        ],
      },
    }),
  ],
})
```

## New v2 Configuration Options

### Version Support

The `versions` option is new in v2:

```javascript
versions: {
  current: 'v2',      // Default version
  available: [...],     // All versions
  deprecated: ['v1'], // Show deprecation banner
  stable: 'v2',       // Stable release marker
}
```

### Enhanced Sidebar

v2 includes improved sidebar configuration:

```javascript
shipyardDocs({
  sidebar: {
    collapsible: true,
    autoGenerate: true,
  },
})
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SITE_URL` | Production URL | - |
| `ENABLE_DRAFTS` | Show draft content | `false` |

## Next Steps

- Learn about [theming and customization](#)
- Explore [advanced features](#)
