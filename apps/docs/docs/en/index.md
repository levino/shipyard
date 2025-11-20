---
title: Shipyard Documentation
slug: 'en'
---

# 🏗️ Orbital Assembly for Astro

**Shipyard** is your orbital assembly platform for launching stunning documentation sites, mission logs, and content-focused stations with [Astro](https://astro.build). 

Stop fighting gravity and start assembling. Shipyard provides the blueprints you need: universal compatibility, hyper-speed navigation, intergalactic localization, and modular cargo bays that dock together seamlessly. 🛸

## Why Dock at Shipyard?

🚀 **Ready for Lift-off** – Launch your station in minutes, not light-years  
📱 **Universal Interface** – Beautiful on every device (and HUD) with Tailwind CSS and DaisyUI  
🌍 **Intergalactic Ready** – Optional internationalization with locale-based routing  
🏗️ **Modular Construction** – Dock only the modules you need, expand your station as you grow  
📦 **Cargo-Focused** – Automated organization for your data payloads  

## Mission Modules

**Three core modules ready for docking:**

- **@levino/shipyard-base** – Hull, structural integrity, and styling foundation
- **@levino/shipyard-docs** – Command center features and navigation charts
- **@levino/shipyard-blog** – Mission log functionality and layouts

## 🌟 Inspect the Prototype

**[🚀 Explore the Live Station →](https://shipyard-demo.levinkeller.de)**

Experience Shipyard firsthand – see how elegant and functional your station can be with responsive layouts, internationalization, and seamless navigation.

---

## 🚀 Initiate Launch Sequence?

Transform your blueprint into a fully operational station in just a few steps. Our comprehensive flight manual covers everything from assembly to advanced calibration.

### 📖 Mission Objectives

- Learn about [launch sequence and configuration](./feature)
- Explore available components and layouts *(incoming transmission)*
- Set up your cargo structure *(incoming transmission)*

*Perfect for fleet commanders, log officers, and anyone who wants a warp-speed station without the complexity.*

---

### ⚡ Pre-flight Checklist

Here's what you'll be up and running with in minutes:

```javascript
// Your complete Astro configuration
export default defineConfig({
  // i18n is now optional! Remove for single-sector sites
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },
  integrations: [
    shipyard({
      title: 'Your Space Station',
      tagline: 'Assembled at Shipyard',
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

**[📖 Start Assembling Now →](./feature)**
