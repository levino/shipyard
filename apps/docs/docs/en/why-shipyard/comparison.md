---
title: Comparison with Other Tools
slug: 'en/why-shipyard/comparison'
sidebar:
  position: 1
---

# Comparison with Other Tools

How does shipyard compare to Docusaurus and Astro Starlight? This page provides an honest assessment of each tool's strengths and limitations.

> **Note:** This comparison reflects the state of these tools as of December 2025. All three projects are actively developed, so features may have changed since this was written. When in doubt, check the official documentation.

## Docusaurus: Great, But Limited

[Docusaurus](https://github.com/facebook/docusaurus) is one of the best page builders out there. Despite its name suggesting it's only for documentation, you can build all kinds of pages with it. The beauty is that content is stored within the codebase, so an AI assistant can manage the entire site—content, layout, everything.

### What Docusaurus Does Well

- **Mature ecosystem** with extensive plugins
- **Versioned documentation** out of the box
- **Strong corporate backing** from [Meta Open Source](https://opensource.fb.com/projects/docusaurus/)
- **Large community** and plenty of examples

### Where Docusaurus Falls Short

- **Custom functionality is hard.** Need to organize events with nice filtered views? Want to manage arbitrary data beyond docs and blog posts? You'll find yourself fighting the framework. Astro's [content collections](https://docs.astro.build/en/guides/content-collections/) make this trivial—you can manage arbitrary data in Markdown and JSON files, then filter, transform, and render pages based on that data with ease. This flexibility simply doesn't exist in Docusaurus without massively extending the default functionality.

- **The SPA approach is heavy-handed.** Docusaurus ships a bloated JavaScript bundle as a single-page application. For content-focused sites, this is overkill. Astro's approach—static HTML with no JavaScript by default—is much leaner and faster.

- **React-focused.** If you prefer simpler templating, Docusaurus doesn't offer an alternative. [Astro components](https://docs.astro.build/en/basics/astro-components/) have a simpler syntax and produce clean static output.

- **Infima CSS is stagnating.** Docusaurus uses [Infima](https://infima.dev/), their custom CSS component library ([GitHub](https://github.com/facebookincubator/infima)). While they've tried to make it reusable, development effort has stalled. It's not really usable for elaborate custom styling beyond the defaults.

---

## Astro Starlight: Almost There, But Coupled

[Astro](https://astro.build/) itself is excellent—lean, flexible, and powerful. But it's very bare-bones. You need a page builder to get started quickly.

The default page builder for Astro is [Starlight](https://github.com/withastro/starlight), and it's a solid choice for pure documentation sites.

### What Starlight Does Well

- **Built on Astro** with all its performance benefits
- **Clean, accessible design** out of the box
- **Active development** by [Chris Swithinbank](https://github.com/delucis), now Astro core maintainer
- **Growing plugin ecosystem** via community contributions

### Where Starlight Falls Short

- **Docs functionality is hardcoded.** You cannot use Starlight's templating, design, and navigation without also using its docs system. In Docusaurus, you can have the nice styling and easy structure without using docs at all—just a marketing site or blog. Starlight is [built specifically for documentation](https://starlight.astro.build/)—using it for other purposes requires workarounds.

- **Blog is a hacky workaround.** Getting a blog working in Starlight requires a third-party plugin like [starlight-blog](https://github.com/HiDeoo/starlight-blog) by HiDeoo. It works, but it's wiggling blog functionality into a docs-focused system rather than having cleanly separated concerns.

- **Navigation customization is limited.** Want to add custom links to the top navigation bar? Starlight [doesn't support this out of the box](https://github.com/withastro/starlight/discussions/963). You'll need component overrides or third-party plugins like [starlight-utils](https://starlight-utils.pages.dev/utilities/nav-links/). In shipyard, navigation is fully configurable from the start.

- **Undocumented component library.** Starlight built their own component library that isn't open-sourced as a standalone project, documented, or designed for extension. If you want to build on top of it, you're on your own.

---

## How shipyard Differs

shipyard takes a different approach: **composable building blocks on Astro**.

- Use **@levino/shipyard-base** alone for a marketing site—no docs required
- Add **@levino/shipyard-docs** when you need documentation
- Add **@levino/shipyard-blog** when you need a blog
- Customize navigation, layouts, and styling from day one
- Leverage [DaisyUI](https://daisyui.com/) for well-documented, maintained components

The key difference is flexibility. shipyard doesn't assume you're building a documentation site—it gives you the tools to build whatever you need.

---

## The Bottom Line

- **Choose Docusaurus** if you need versioned docs and don't mind the JavaScript bundle
- **Choose Starlight** if you only need documentation and want minimal setup
- **Choose shipyard** if you want composable building blocks and the flexibility to grow beyond docs

See also: [Docusaurus Feature Parity Roadmap](../roadmap) for a detailed comparison of supported features.
