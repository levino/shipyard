---
title: Getting Started with Single-Language Sites
description: Learn how to build single-language sites with shipyard
date: 2024-09-01
tags:
  - getting-started
  - single-language
  - tutorial
---

# Getting Started with Single-Language Sites

Welcome to our first blog post! This post demonstrates how **shipyard** works perfectly with single-language websites.

## Why Choose Single-Language?

Many websites don't need internationalization from day one. Single-language sites offer:

- **Simpler URLs**: `/blog/post-title` instead of `/en/blog/post-title`
- **Easier content management**: No language directories to manage
- **Faster development**: Focus on features instead of translations
- **Better SEO**: Clean URLs without language prefixes

## Key Features

This blog demonstrates:

1. **Clean routing**: Posts are accessible directly at `/blog/post-slug`
2. **Standard blog features**: Categories, tags, dates, and authors
3. **Responsive design**: Works great on all devices
4. **Easy migration**: Can add i18n later if needed

## Getting Started

To create your own single-language shipyard site:

```javascript
// astro.config.mjs
export default defineConfig({
  // No i18n configuration needed!
  integrations: [
    shipyard({
      title: 'Your Site Name',
      tagline: 'Your awesome tagline',
    }),
    shipyardBlog(['blog']),
  ],
})
```

That's it! No complex internationalization setup required.

## What's Next?

Check out our documentation to learn more about:
- Setting up your development environment
- Creating and organizing content
- Customizing themes and layouts
- Adding more advanced features

Happy building! 🚀