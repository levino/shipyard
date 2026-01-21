---
title: Tailwind CSS Setup
sidebar:
  position: 1
description: Configure Tailwind CSS 4 with shipyard
---

# Tailwind CSS Setup

shipyard uses Tailwind CSS 4 with DaisyUI for styling. This guide explains how to configure Tailwind CSS to work correctly with shipyard components.

## Quick Setup

Create `src/styles/app.css`:

```css
/* Tailwind CSS 4 setup */
@import "tailwindcss";

/* Import shipyard packages - includes styles and @source directives */
@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";

@plugin "daisyui";
@plugin "@tailwindcss/typography";
```

Update `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      brand: 'My Site',
      title: 'My Awesome Site',
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

Install dependencies:

```bash
npm install tailwindcss @tailwindcss/vite daisyui @tailwindcss/typography
```

That's it! The shipyard packages include their own `@source` directives, so Tailwind automatically detects all component classes.

## How It Works

Each shipyard package exports CSS via conditional exports. When imported in CSS with `@import`, it resolves to a CSS file that contains:

1. **Component styles** - CSS rules using `@apply` directives
2. **@source directives** - Tell Tailwind where to scan for class usage

When you import `@import "@levino/shipyard-base"`, Tailwind CSS 4:

1. Processes the component styles
2. Follows the `@source` directives to scan the package's source files
3. Includes all detected utility classes in your build

This means you don't need to manually configure paths or worry about monorepo vs regular install differences.

## Understanding the Setup

| Directive | Purpose |
|-----------|---------|
| `@import "tailwindcss"` | Initializes Tailwind CSS |
| `@import "@levino/shipyard-*"` | Imports shipyard styles and `@source` directives |
| `@plugin "daisyui"` | Enables DaisyUI component classes |
| `@plugin "@tailwindcss/typography"` | Enables prose styling for markdown content |

### Why `?url` Import?

The `?url` suffix in `import appCss from './src/styles/app.css?url'` tells Vite to resolve the file path at build time. This allows shipyard to include your CSS in the correct processing order.

### Why `@tailwindcss/vite`?

Tailwind CSS 4 uses a Vite plugin (`@tailwindcss/vite`) instead of the older `@astrojs/tailwind` integration. This provides better performance and native Vite integration.

## Troubleshooting

### Missing Styles or Broken Components

If components appear unstyled:

1. **Check CSS imports** - Ensure all three shipyard packages are imported
2. **Verify CSS import order** - `@import "tailwindcss"` must come first
3. **Check the css config** - Make sure you're passing `css: appCss` to the shipyard integration

### "Cannot apply unknown utility class"

This error means Tailwind isn't initialized when processing a CSS file. Ensure your app.css has `@import "tailwindcss"` as the first import.

### Build Errors After Upgrade

If you see errors after upgrading, try:

1. Delete `node_modules` and reinstall
2. Clear your build cache: `rm -rf dist .astro`
3. Verify all shipyard packages are on compatible versions

## Migration from Tailwind CSS 3

If you're migrating from Tailwind CSS 3:

1. **Remove `tailwind.config.mjs`** - Configuration now lives in CSS
2. **Remove `@astrojs/tailwind`** - No longer needed
3. **Install `@tailwindcss/vite`** - The new Vite plugin
4. **Create `src/styles/app.css`** - With the setup shown above
5. **Update `astro.config.mjs`** - Add Vite plugin and import CSS with `?url`

### Before (Tailwind 3)

```javascript
// astro.config.mjs
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({ /* ... */ }),
  ],
})
```

```javascript
// tailwind.config.mjs
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    'node_modules/@levino/shipyard-*/**/*.{astro,js,ts}',
  ],
  plugins: [typography, daisyui],
}
```

### After (Tailwind 4)

```javascript
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite'
import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      /* ... */
    }),
  ],
})
```

```css
/* src/styles/app.css */
@import "tailwindcss";
@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";
@plugin "daisyui";
@plugin "@tailwindcss/typography";
```
