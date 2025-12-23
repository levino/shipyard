# 🚢 shipyard

**The complete toolkit for building stunning websites with Astro**

shipyard transforms the way you create documentation sites, blogs, and content-focused websites. Stop wrestling with complex configurations and start building beautiful, fast websites in minutes.

## ✨ What is shipyard?

shipyard is a comprehensive collection of Astro integrations that provides:

- **🎨 Beautiful Design System** – Modern, responsive layouts with Tailwind CSS + DaisyUI
- **🌍 Internationalization** – Built-in i18n support with locale-based routing
- **📚 Smart Documentation** – Automated navigation and content organization
- **📝 Powerful Blogging** – Complete blog functionality with layouts and collections
- **🧩 Modular Architecture** – Use what you need, extend as you grow

## 🚀 Quick Start

```bash
# Install shipyard packages
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog

# Add to your astro.config.mjs
import { shipyard, shipyardDocs, shipyardBlog } from '@levino/shipyard-base';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  integrations: [
    shipyard({
      title: 'Your Awesome Site',
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

## 📖 Documentation

**[📚 Read the Full Documentation →](https://shipyard.levinkeller.de)**

Learn everything from installation to advanced customization with our comprehensive guides.

## 🌟 Live Demo

**[🚀 Explore the Demo →](https://i18n.demos.shipyard.levinkeller.de)**

See shipyard in action! The demo showcases all features including:
- Responsive documentation layouts
- Blog with internationalization
- Navigation and content organization
- Mobile-first design

## 🏗️ Architecture

shipyard consists of three main packages:

- **`@levino/shipyard-base`** – Core components, layouts, and styling foundation
- **`@levino/shipyard-docs`** – Documentation-specific features and smart navigation  
- **`@levino/shipyard-blog`** – Complete blogging functionality with layouts

## 🔬 Docusaurus Comparison Demos

For development and comparison purposes, we maintain Docusaurus equivalents of our demos:

- **[i18n Docusaurus Demo](https://docusaurus.i18n.demos.shipyard.levinkeller.de/docs/)** - Multi-language Docusaurus setup
- **[Single Locale Docusaurus Demo](https://docusaurus.single-locale.demos.shipyard.levinkeller.de/docs/)** - Single-language Docusaurus setup

## 🤝 Contributing

We welcome contributions! This is a monorepo managed with npm workspaces.

```bash
# Install dependencies and run allowed lifecycle scripts
npm run setup

# Run tests
npm run test:e2e

# Format code
npx biome format --write .
```

> **Note:** This project uses `@lavamoat/allow-scripts` to disable npm lifecycle scripts by default for security. Use `npm run setup` instead of `npm install` to properly initialize the project.

## 📄 License

MIT - see [LICENSE](LICENSE) for details.

---

**Ready to build something amazing?** [🚀 Get Started](https://shipyard.levinkeller.de) | [🌟 View Demo](https://i18n.demos.shipyard.levinkeller.de)
