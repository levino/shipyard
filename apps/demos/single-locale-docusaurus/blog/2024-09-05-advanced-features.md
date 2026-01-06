---
title: Advanced Features
description: Explore advanced features in single-language shipyard sites
date: 2024-09-05
tags: [advanced, features, customization]
---

Ready to take your site to the next level? Let's explore some advanced features.

<!-- truncate -->

## Custom Components

Create reusable components for your content:

```jsx
// src/components/Callout.astro
---
const { type = 'info' } = Astro.props
---
<div class={`callout callout-${type}`}>
  <slot />
</div>
```

## Theme Customization

Customize your site's appearance with DaisyUI themes:

```javascript
// tailwind.config.js
module.exports = {
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
}
```

## SEO Optimization

shipyard automatically generates:

- Meta tags for social sharing
- Sitemap.xml for search engines
- RSS feeds for blog subscribers
- Canonical URLs

## Performance

Single-language sites benefit from:

- **Smaller bundles**: No i18n overhead
- **Faster builds**: Less content to process
- **Better caching**: Simpler URL structure

## Migration Path

When you're ready for internationalization:

1. Add i18n configuration to Astro
2. Reorganize content into language directories
3. Update internal links
4. Deploy!

shipyard handles the transition smoothly.

Happy building! 🚀
