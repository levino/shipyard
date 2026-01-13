---
title: Configuration (v1)
description: Configure your v1 project settings
sidebar_position: 2
---

# Configuration Guide (v1)

> **Note**: This is documentation for v1. For the latest version, see the [v2 configuration guide](/en/docs/v2/configuration).

This page covers configuration options in v1.

## Basic Configuration

Create your `astro.config.mjs`:

```javascript
import { shipyard } from '@levino/shipyard-base'
import { shipyardDocs } from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyard({
      title: 'My Project',
    }),
    shipyardDocs(),
  ],
})
```

## Available Options

| Option | Type | Description |
|--------|------|-------------|
| title | string | Site title |
| brand | string | Brand name |
| navigation | object | Navigation links |

## Environment Variables

```bash
# .env
SITE_URL=https://example.com
```

## Upgrading

For the latest configuration options, upgrade to [v2](/en/docs/v2/configuration).
