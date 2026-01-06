---
title: Configuration (v1)
description: Configuration options for version 1.0
sidebar_position: 2
---

# Configuration Guide (v1)

> **Deprecated**: This guide is for v1. See the [v2 configuration guide](/docs/v2/configuration) for current options.

## Basic Configuration

Edit `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyard({
      siteTitle: 'My Project',
      siteTagline: 'A great project',
      brandName: 'MyApp',
    }),
    shipyardDocs({
      docsRoot: './docs',
    }),
  ],
})
```

## v1 Configuration Options

### Site Settings

| Option | Type | Description |
|--------|------|-------------|
| `siteTitle` | string | Page title |
| `siteTagline` | string | Subtitle text |
| `brandName` | string | Navigation brand |

### Docs Settings

| Option | Type | Description |
|--------|------|-------------|
| `docsRoot` | string | Docs directory path |
| `editUrl` | string | GitHub edit URL |

## Limitations

v1 configuration does not support:

- Documentation versioning
- Advanced sidebar configuration
- Custom theme options

These features are available in [v2](/docs/v2/configuration).

## Migrating Configuration

When upgrading to v2, rename these options:

- `siteTitle` → `title`
- `siteTagline` → `tagline`
- `brandName` → `brand`

See the [Migration Guide](/docs/v2/migration) for complete instructions.
