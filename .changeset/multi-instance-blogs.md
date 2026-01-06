---
"@levino/shipyard-blog": minor
"@levino/shipyard-base": minor
"@levino/shipyard-docs": minor
---

You can now host multiple blog instances with custom URL paths using the `routeBasePath` configuration option. This allows you to have separate blogs at different URLs (e.g., `/blog` and `/news`) within the same site. Additionally, sidebar items can now display custom HTML content using the `labelHtml` property with optional `defaultStyle` for consistent styling.

A new `remarkNpm2Yarn` remark plugin is now available that transforms npm code blocks into tabbed interfaces showing equivalent npm, yarn, and pnpm commands. Simply add `npm2yarn` to your code block meta and the plugin will automatically generate package manager alternatives.

Standalone markdown pages in `src/pages/` now support `draft` and `unlisted` frontmatter options. Draft pages render an empty document in production builds, while unlisted pages are accessible but include `noindex, nofollow` meta tags to prevent search engine indexing.

Category metadata can be configured via `index.md` frontmatter in category folders. You can set `sidebar_label`, `sidebar_position`, `collapsed`, `collapsible`, `sidebar_class_name`, and `sidebar_custom_props` for any docs category folder.

New SEO frontmatter options are available for both docs and blog:
- `title_meta` - Override the page title used in `<title>` tags and meta tags for SEO, while keeping the regular `title` for sidebar display
- `sidebar_label` (blog) - Customize how blog posts appear in the blog sidebar without changing the post title

Math equations (KaTeX) and Mermaid diagrams are now supported via Astro's standard remark/rehype plugin ecosystem.
