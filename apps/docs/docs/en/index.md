---
title: Shipyard Documentation
slug: 'en'
---

# Build Beautiful Websites with Shipyard

**Shipyard** is a comprehensive toolkit for building stunning documentation sites, blogs, and content-focused websites with [Astro](https://astro.build). 

Assemble and launch your new Astro website in minutes. Shipyard provides all the components you need: responsive layouts, smart navigation, i18n support, and modular packages that work together seamlessly.

## Why Build with Shipyard?

🚀 **Fast Setup** – Get your site running in minutes, not hours  
📱 **Responsive Design** – Beautiful across all devices with Tailwind CSS and DaisyUI  
🌍 **Multi-language Ready** – Optional i18n support with locale-based routing  
🛠️ **Modular** – Install only what you need, expand as your project grows  
📡 **Content-Focused** – Automated organization and collection for all your content  

## What's Included

**Three specialized packages work in perfect coordination:**

- **@levino/shipyard-base** – Core components, layouts, and design foundation
- **@levino/shipyard-docs** – Documentation features and smart navigation
- **@levino/shipyard-blog** – Complete blogging functionality with layouts

## 🌟 Live Demo

**[🚀 Explore the Live Demo →](https://shipyard-demo.levinkeller.de)**

Take a tour of our operational facility – see how elegant and functional your platform can be with responsive design, multi-language support, and seamless navigation.

---

## 🚀 Ready to Start?

Transform your vision into a professional space station in just a few steps. Our comprehensive mission guide covers everything from initial assembly to advanced configuration.

### 📖 Getting Started

- Learn about [setup and configuration](./feature)
- Explore available packages and layouts *(coming soon)*
- Set up your content organization *(coming soon)*

*Perfect for developers, content creators, and anyone who wants a beautiful, fast station without the orbital complexity.*

---

### ⚡ Quick Preview

Here's what you'll have running in minutes:

```javascript
// Your complete Astro station configuration
export default defineConfig({
  // Universal communication is optional! Remove for single-sector operations
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  integrations: [
    shipyard({
      title: 'Your Station Name',
      tagline: 'Constructed with Shipyard',
      navigation: {
        docs: { label: 'Documentation', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

**[📖 Begin Construction Now →](./feature)**