---
title: The shipyard Philosophy
slug: 'en/why-shipyard/philosophy'
sidebar:
  position: 2
---

# The shipyard Philosophy

shipyard is built on a few core principles that guide every design decision.

## Built on Astro's Strengths

Rather than fighting a framework, shipyard embraces what Astro does best:

- **Content collections** for managing any type of content—docs, blogs, events, products, whatever you need
- **Static HTML output** by default, with optional server-side rendering when needed
- **Simple Astro components** with clean syntax and no framework lock-in

This means you get Astro's performance and flexibility while shipyard handles the page builder concerns.

## Composable Building Blocks

Unlike Starlight, which couples everything to its docs system, shipyard separates concerns into independent packages:

| Package | Purpose | Use Case |
|---------|---------|----------|
| **@levino/shipyard-base** | Core layouts, navigation, styling | Marketing site, landing pages |
| **@levino/shipyard-docs** | Documentation features | Add when you need docs |
| **@levino/shipyard-blog** | Blog functionality | Add when you need a blog |

**Mix and match.** Use one package or all three. Your site, your choice.

### Why This Matters

Many projects start as a simple landing page, then need docs, then a blog. With Starlight, you'd need to restructure everything to add non-docs content. With shipyard, you just install another package.

Conversely, if you only need a marketing site with a blog—no docs—shipyard doesn't force documentation infrastructure on you.

## Battle-Tested Styling with DaisyUI

Rather than building a custom component library that might stagnate (like Infima), shipyard uses [DaisyUI](https://daisyui.com/)—a mature, well-documented, actively maintained component library built on [Tailwind CSS](https://tailwindcss.com/).

### Why DaisyUI?

- **Not reinventing the wheel** – DaisyUI is battle-tested by thousands of projects
- **Excellent documentation** – Everything is documented and easy to customize
- **Active maintenance** – Regular updates and bug fixes
- **Tailwind foundation** – Familiar utility-first approach
- **Theme support** – Built-in themes and easy customization

This lets shipyard focus on page builder concerns while delegating styling to experts.

## Easy Migration In and Out

**Your content is just Markdown.** This is a deliberate choice that keeps your options open:

- **Migrating from Docusaurus to shipyard** takes minutes—your Markdown files work as-is
- **Migrating from Starlight to shipyard** is equally straightforward
- **Migrating away from shipyard** is just as easy if you ever need to

*Tip: Use an AI assistant like Claude to help with migration. Since it's just moving Markdown files and adjusting configuration, AI tools can handle most of the work for you.*

### No Vendor Lock-In

shipyard doesn't require:

- Proprietary file formats
- Complex content transformations
- Special syntax that only works in shipyard
- Unusual directory structures

If you decide shipyard isn't right for you, take your Markdown files and move on. This low switching cost means you can try shipyard without commitment—if it doesn't work out, you haven't lost anything.

## Design Principles Summary

1. **Leverage Astro** – Don't fight the framework, extend it
2. **Separate concerns** – Docs, blog, and base functionality are independent
3. **Use proven tools** – DaisyUI for styling, Tailwind for utilities
4. **No lock-in** – Standard Markdown, easy migration
5. **Keep it lean** – Static HTML by default, JavaScript only when needed
