---
title: shipyard Documentation
slug: 'en'
---

# Build Beautiful Websites with shipyard

**shipyard** is your complete toolkit for building stunning documentation sites, blogs, and content-focused websites with [Astro](https://astro.build).

Stop wrestling with complex configurations and start creating. shipyard gives you everything you need: responsive design, intelligent navigation, internationalization, and modular components that work together seamlessly.

## Why Choose shipyard?

- **Ready to Launch** – Get your site running in minutes, not hours
- **Mobile-First** – Beautiful on every device with Tailwind CSS and DaisyUI
- **Global Ready** – Optional internationalization with locale-based routing
- **Modular Design** – Use only what you need, extend as you grow
- **Content-Focused** – Automated organization and collection for your content

---

## Packages

shipyard consists of three packages that work together:

| Package | Purpose | Documentation |
|---------|---------|---------------|
| [@levino/shipyard-base](./base-package) | Core layouts, components, navigation, and configuration | [View Docs →](./base-package) |
| [@levino/shipyard-docs](./docs-package) | Documentation features, sidebar, pagination, git metadata | [View Docs →](./docs-package) |
| [@levino/shipyard-blog](./blog-package) | Blog functionality, post listing, navigation | [View Docs →](./blog-package) |

---

## Quick Start

### Installation

```bash
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog
npm install tailwindcss daisyui @tailwindcss/typography @astrojs/tailwind
```

### Configuration

```javascript
// astro.config.mjs
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({
      brand: 'My Site',
      title: 'My Awesome Site',
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

**[Read the full Getting Started guide →](./feature)**

---

## Live Demo

**[Explore the Live Demo →](https://shipyard-demo.levinkeller.de)**

Experience shipyard firsthand – see how elegant and functional your site can be with responsive layouts, internationalization, and seamless navigation.

---

## Documentation Overview

### Getting Started

- **[Getting Started](./feature)** – Installation, configuration, and project setup

### Package Reference

- **[@levino/shipyard-base](./base-package)** – Core configuration, layouts, and components
- **[@levino/shipyard-docs](./docs-package)** – Documentation plugin with sidebar and pagination
- **[@levino/shipyard-blog](./blog-package)** – Blog plugin with post listing and navigation

### Additional Resources

- **[Feature Roadmap](./roadmap)** – Docusaurus feature parity status and upcoming features

---

*Perfect for developers, content creators, and anyone who wants a beautiful, fast website without the complexity.*
