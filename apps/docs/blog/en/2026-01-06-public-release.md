---
title: shipyard Public Release
description: Announcing the public release of shipyard - a composable page builder for Astro
date: 2026-01-06
---

# shipyard Public Release

I'm excited to announce the public release of **shipyard** - a composable page builder for Astro.

## What is shipyard?

shipyard is a toolkit for building documentation sites, blogs, and content-focused websites with [Astro](https://astro.build). Unlike other solutions, shipyard gives you composable building blocks that you can mix and match.

## Key Features

- **Composable packages** - Use `@levino/shipyard-base` alone for a marketing site, add `@levino/shipyard-docs` for documentation, or `@levino/shipyard-blog` for a blog
- **Built on Astro** - Static HTML by default, with optional server-side rendering
- **DaisyUI styling** - Battle-tested components with Tailwind CSS
- **Easy migration** - Your content is just Markdown, migrate in or out in minutes
- **Internationalization** - Full i18n support with Astro's routing

## Why shipyard?

I built shipyard because existing tools didn't quite fit my needs:

- **Docusaurus** is powerful but ships heavy JavaScript bundles and makes custom content types difficult
- **Starlight** is lean but couples docs functionality too tightly - you can't use just the styling and navigation

shipyard takes the best of both: Astro's performance with composable, independent packages.

## Get Started

```bash
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog
```

Check out the [Getting Started guide](/en/docs/getting-started) for full setup instructions.

## What's Next

shipyard is production-ready and actively developed. See the [roadmap](/en/docs/roadmap) for upcoming features.

Contributions and feedback are welcome! Visit the [GitHub repository](https://github.com/levino/shipyard) to get involved.

---

*Levin Keller – Hildesheim, Germany*
