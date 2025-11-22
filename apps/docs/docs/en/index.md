---
title: Shipyard Documentation
---

# Build Beautiful Websites with Shipyard

**Shipyard** is your complete toolkit for building stunning documentation sites, blogs, and content-focused websites with [Astro](https://astro.build). 

Stop wrestling with complex configurations and start creating. Shipyard gives you everything you need: responsive design, intelligent navigation, internationalization, and modular components that work together seamlessly.

## Why Choose Shipyard?

🚀 **Ready to Launch** – Get your site running in minutes, not hours  
📱 **Mobile-First** – Beautiful on every device with Tailwind CSS and DaisyUI  
🌍 **Global Ready** – Optional internationalization with locale-based routing  
🧩 **Modular Design** – Use only what you need, extend as you grow  
📝 **Content-Focused** – Automated organization and collection for your content  

## What's Included

**Three powerful packages work together:**

- **@levino/shipyard-base** – Core components, layouts, and styling foundation
- **@levino/shipyard-docs** – Documentation-specific features and smart navigation
- **@levino/shipyard-blog** – Complete blogging functionality with layouts

## 🌟 See It In Action

**[🚀 Explore the Live Demo →](https://shipyard-demo.levinkeller.de)**

Experience Shipyard firsthand – see how elegant and functional your site can be with responsive layouts, internationalization, and seamless navigation.

---

## 🚀 Ready to Get Started?

Transform your idea into a professional website in just a few steps. Our comprehensive guide covers everything from installation to advanced configuration.

### 📖 Next Steps

- Learn about [getting started and configuration](./feature)
- Explore available components and layouts *(coming soon)*
- Set up your content structure *(coming soon)*

*Perfect for developers, content creators, and anyone who wants a beautiful, fast website without the complexity.*

---

### ⚡ Quick Preview

Here's what you'll be up and running with in minutes:

```javascript
// Your complete Astro configuration
export default defineConfig({
  // i18n is now optional! Remove for single-language sites
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  integrations: [
    shipyard({
      title: 'Your Awesome Site',
      tagline: 'Built with Shipyard',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

**[📖 Start Building Now →](./feature)**