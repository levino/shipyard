---
title: Installation (v1)
description: How to install version 1.0
sidebar_position: 1
---

# Installation Guide (v1)

> **Deprecated**: This guide is for v1. See the [v2 installation guide](/docs/v2/installation) for the latest instructions.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

## Installation Steps

```bash
# Create a new project
npm create astro@latest my-project

# Install shipyard (v1 packages)
npm install @levino/shipyard-base@1 @levino/shipyard-docs@1

# Start development
npm run dev
```

## Basic Setup

Create `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'

export default defineConfig({
  integrations: [
    shipyard({
      siteTitle: 'My Site',  // Note: Changed to 'title' in v2
      siteTagline: 'Welcome',
    }),
  ],
})
```

## Known Limitations

v1 has some limitations addressed in v2:

- No versioning support
- Manual TypeScript configuration required
- Larger bundle size

## Next Steps

- Configure your project - see [Configuration](/docs/v1/configuration)
- Consider [upgrading to v2](/docs/v2/migration)
