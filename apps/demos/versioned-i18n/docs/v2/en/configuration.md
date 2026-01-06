---
title: Configuration (v2)
description: Configure your v2 project settings
sidebar_position: 2
---

# Configuration Guide (v2)

This page covers all configuration options available in v2.

## Basic Configuration

Create or update your `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyard({
      title: 'My Project',
      brand: 'My Brand',
    }),
    shipyardDocs({
      showLastUpdateTime: true,
    }),
  ],
})
```

## New in v2

- **Versioning support**: Configure multiple documentation versions
- **i18n integration**: Built-in internationalization support
- **Enhanced navigation**: Improved sidebar configuration

## Environment Variables

```bash
# .env
SITE_URL=https://example.com
```

## Related

- [Installation](/en/docs/v2/installation)
- [Migration from v1](/en/docs/v2/migration)
