---
title: Server Mode (SSR)
sidebar:
  position: 7
description: Learn how to use shipyard with Astro's server-side rendering (SSR) mode
---

# Server Mode (SSR)

shipyard fully supports Astro's server-side rendering (SSR) mode, allowing you to render pages on-demand per request instead of at build time.

## When to Use Server Mode

Server mode is ideal for:

- **Dynamic content** that changes frequently
- **User authentication** and personalized pages
- **Database-driven content** that needs real-time updates
- **Applications requiring request-time data**

For static content like documentation and blog posts, we recommend using static mode (the default) for better performance and simpler deployment.

## Configuration

### Step 1: Install an Adapter

Astro requires an adapter for server-side rendering. Choose one based on your deployment platform:

```bash
# For Cloudflare Workers/Pages
npm install @astrojs/cloudflare

# For Node.js
npm install @astrojs/node

# For Vercel
npm install @astrojs/vercel

# For Netlify
npm install @astrojs/netlify
```

### Step 2: Configure Astro

Update your `astro.config.mjs` to enable server mode:

```javascript
import cloudflare from '@astrojs/cloudflare' // or your chosen adapter
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server', // Enable server mode
  adapter: cloudflare(), // Your chosen adapter
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({
      brand: 'My Site',
      title: 'My Site',
      tagline: 'Built with shipyard',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(),
    shipyardBlog(),
  ],
})
```

## How It Works

When using server mode:

1. **Documentation and blog pages** are rendered on-demand when requested
2. **Custom pages** in `src/pages/` can include dynamic server-side logic
3. **Static assets** are still served from the build output

## Example: Dynamic Custom Page

You can create dynamic pages that fetch data at request time:

```astro
---
// src/pages/dashboard.astro
import { Page } from '@levino/shipyard-base/layouts'

// This runs on every request
const userData = await fetchUserData()
---

<Page title="Dashboard" description="Your personal dashboard">
  <h1>Welcome, {userData.name}!</h1>
  <p>Last login: {userData.lastLogin}</p>
</Page>
```

## Hybrid Rendering

For optimal performance, you can mix static and server-rendered pages using Astro's hybrid mode:

```javascript
export default defineConfig({
  output: 'hybrid', // Enable hybrid mode
  adapter: cloudflare(),
  // ...
})
```

In hybrid mode, pages are static by default. Add `export const prerender = false` to any page that needs server-side rendering:

```astro
---
// src/pages/api-data.astro
export const prerender = false

const data = await fetch('https://api.example.com/data')
---
```

## Live Demo

See server mode in action: **[Server Mode Demo](https://server-mode.demos.shipyard.levinkeller.de)**

## Deployment Notes

Each adapter has specific deployment requirements. Consult the Astro documentation for your chosen platform:

- [Cloudflare deployment](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Node.js deployment](https://docs.astro.build/en/guides/deploy/node/)
- [Vercel deployment](https://docs.astro.build/en/guides/deploy/vercel/)
- [Netlify deployment](https://docs.astro.build/en/guides/deploy/netlify/)
