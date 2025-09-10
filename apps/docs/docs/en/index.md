---
title: Shipyard Documentation
slug: 'en'
---

# Construct Stellar Websites with Shipyard

**Shipyard** is your orbital construction platform for building stunning documentation sites, blogs, and content-focused websites with [Astro](https://astro.build). 

Stop wrestling with complex orbital mechanics and start constructing. Shipyard provides all the modules you need: responsive interfaces, intelligent navigation, universal communication, and modular components that work together in perfect harmony.

## Why Launch with Shipyard?

🚀 **Mission Ready** – Get your station operational in minutes, not hours  
📱 **Universal Interface** – Beautiful across all devices with Tailwind CSS and DaisyUI  
🌍 **Sector-Wide Communication** – Optional universal translation with locale-based routing  
🛠️ **Modular Assembly** – Install only the modules you need, expand as your operations grow  
📡 **Mission-Focused** – Automated organization and collection for all your content  

## What's Included

**Three specialized modules work in perfect coordination:**

- **@levino/shipyard-base** – Core components, layouts, and interface foundation
- **@levino/shipyard-docs** – Command center features and intelligent navigation systems
- **@levino/shipyard-blog** – Complete mission logging functionality with layouts

## 🌟 Live Operations Center

**[🛰️ Explore the Live Demo →](https://shipyard-demo.levinkeller.de)**

Take a tour of our operational station – see how elegant and functional your platform can be with responsive interfaces, universal communication, and seamless navigation.

---

## 🚀 Ready for Launch?

Transform your vision into a professional space station in just a few steps. Our comprehensive mission guide covers everything from initial assembly to advanced configuration.

### 📖 Mission Phases

- Learn about [launch protocols and configuration](./feature)
- Explore available modules and interface layouts *(docking soon)*
- Set up your content organization systems *(docking soon)*

*Perfect for developers, content creators, and anyone who wants a beautiful, fast station without the orbital complexity.*

---

### ⚡ Launch Preview

Here's what you'll have operational in minutes:

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
        docs: { label: 'Command Center', href: '/docs' },
        blog: { label: 'Mission Logs', href: '/blog' },
      },
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

**[📖 Begin Construction Now →](./feature)**