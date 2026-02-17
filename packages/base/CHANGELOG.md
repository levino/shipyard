# @levino/shipyard-base

## 0.7.3

## 0.7.2

### Patch Changes

- 5da25ab: Mobile sidebar now extends to the full height of the screen instead of stopping at the last menu item

## 0.7.1

### Patch Changes

- 32fac4d: Fixed multiple layout and design issues in the page builder:

  - Footer now spans full viewport width instead of being constrained to the drawer-content area, fixing the color mismatch between sidebar and footer
  - Sidebar drawer only opens on desktop when there is actual sidebar content, eliminating 224px of dead whitespace on pages like About or Splash
  - Brand name in navbar stays visible between 768-1024px viewports where the sidebar isn't yet shown
  - Long brand names in the sidebar are now properly truncated instead of overflowing
  - Main content area has a max-width constraint preventing text from stretching across ultra-wide screens
  - Navbar dropdown menus now close when clicking outside or pressing Escape
  - Sidebar breakpoints aligned to lg (1024px) to match the drawer-open breakpoint, fixing missing theme/language controls in the 768-1024px range
  - Sidebar uses min-h-full instead of min-h-screen for proper scroll behavior

## 0.7.0

### Minor Changes

- ed3ef9a: Upgrade to Tailwind CSS 4 and DaisyUI 5. This is a breaking change that requires migration from the old `@astrojs/tailwind` integration to the new `@tailwindcss/vite` plugin.

  **Migration Guide:**

  1. Update dependencies:

     - Replace `@astrojs/tailwind` with `@tailwindcss/vite`
     - Update `tailwindcss` to `^4`
     - Update `daisyui` to `^5`

  2. Update `astro.config.mjs`:

     ```javascript
     // Before
     import tailwind from "@astrojs/tailwind";
     integrations: [tailwind({ applyBaseStyles: false })];

     // After
     import tailwindcss from "@tailwindcss/vite";
     vite: {
       plugins: [tailwindcss()];
     }
     ```

  3. Remove `tailwind.config.mjs` - no longer needed. Tailwind 4 uses CSS-first configuration.

  4. The globals.css now uses new CSS syntax with `@import "tailwindcss"` and `@plugin` directives.

  5. DaisyUI class renames:
     - `avatar placeholder` → `avatar avatar-placeholder`

### Patch Changes

- e9cdc63: You can now use a simpler CSS import syntax in your Tailwind CSS 4 setup. Instead of manually adding `@source` directives for each package, simply import the packages directly:

  ```css
  @import "tailwindcss";

  @import "@levino/shipyard-base";
  @import "@levino/shipyard-blog";
  @import "@levino/shipyard-docs";

  @plugin "daisyui";
  @plugin "@tailwindcss/typography";
  ```

  Each package now includes its own `@source` directives, so Tailwind automatically scans the package components for CSS classes. This eliminates the need for path-based `@source` directives that could break in different project structures.

## 0.6.3

### Patch Changes

- 50fb3e5: Admonitions and other markdown features now work out-of-the-box without manual configuration. The shipyard integration automatically registers the required remark plugins (remarkDirective, remarkAdmonitions, remarkNpm2Yarn), so you no longer need to add them to your Astro config.
- f8a73a6: You can now create versioned documentation to maintain multiple versions of your docs side-by-side.

  **Key features:**

  - Configure multiple documentation versions (e.g., v1, v2, latest) with automatic URL routing
  - Version selector UI component displays in both navbar and sidebar for easy version switching
  - Mark versions as stable, deprecated, or unreleased with visual badges
  - Sidebar automatically filters to show only pages in the current version
  - Pagination stays within the same version boundaries
  - Support for a "latest" alias that always points to the current version
  - Automatic redirect from docs root to current version

  **Getting started:**

  ```typescript
  // astro.config.mjs
  shipyardDocs({
    routeBasePath: "docs",
    versions: {
      current: "v2",
      available: [
        { version: "v2", label: "Version 2.0" },
        { version: "v1", label: "Version 1.0" },
      ],
      deprecated: ["v1"],
      stable: "v2",
    },
  });
  ```

  See the [versioning guide](/en/guides/versioning) for complete documentation.

## 0.6.2

### Patch Changes

- c5e24d0: Add configurable footer with Docusaurus-like API

  You can now customize your site's footer with links, copyright notice, and styling. Shipyard supports both simple (single row) and multi-column footer layouts, similar to Docusaurus.

  **Simple footer:**

  ```javascript
  shipyard({
    footer: {
      links: [
        { label: "Documentation", to: "/docs" },
        { label: "GitHub", href: "https://github.com/myorg/myrepo" },
      ],
      copyright: "Copyright © 2025 My Company.",
    },
  });
  ```

  **Multi-column footer:**

  ```javascript
  shipyard({
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [{ label: "Getting Started", to: "/docs" }],
        },
      ],
      copyright: "Copyright © 2025 My Company.",
    },
  });
  ```

  The footer also includes a "Built with Shipyard" branding link by default, which can be hidden with `hideBranding: true`.

## 0.6.1

### Patch Changes

- cd94056: You can now enable broken link detection during production builds. Shipyard automatically scans your built HTML files for internal links that point to non-existent pages, helping you catch issues before deploying.

  Configure the behavior with the new `onBrokenLinks` option:

  ```javascript
  shipyard({
    // ... other options
    onBrokenLinks: "throw", // fail build on broken links
  });
  ```

  Available values:

  - `'ignore'` - Don't check for broken links
  - `'log'` - Log broken links but continue build
  - `'warn'` - Log warnings (default)
  - `'throw'` - Fail the build on broken links

- 7086067: Export globals.css from package for custom layouts

  You can now import the global styles directly when creating custom layouts:

  ```javascript
  import "@levino/shipyard-base/globals.css";
  ```

  This is useful when creating custom page layouts that don't use the built-in Shipyard layouts but still need the base styles.

## 0.6.0

### Minor Changes

- fd16435: You can now host multiple blog instances with custom URL paths using the `routeBasePath` configuration option. This allows you to have separate blogs at different URLs (e.g., `/blog` and `/news`) within the same site. Additionally, sidebar items can now display custom HTML content using the `labelHtml` property with optional `defaultStyle` for consistent styling.

  A new `remarkNpm2Yarn` remark plugin is now available that transforms npm code blocks into tabbed interfaces showing equivalent npm, yarn, and pnpm commands. Simply add `npm2yarn` to your code block meta and the plugin will automatically generate package manager alternatives.

  Standalone markdown pages in `src/pages/` now support `draft` and `unlisted` frontmatter options. Draft pages render an empty document in production builds, while unlisted pages are accessible but include `noindex, nofollow` meta tags to prevent search engine indexing.

  Category metadata can be configured via `index.md` frontmatter in category folders using the nested `sidebar` object. You can set `sidebar.label`, `sidebar.position`, `sidebar.collapsed`, `sidebar.collapsible`, `sidebar.className`, and `sidebar.customProps` for any docs category folder.

  New SEO frontmatter options are available for both docs and blog:

  - `title_meta` - Override the page title used in `<title>` tags and meta tags for SEO, while keeping the regular `title` for sidebar display
  - `sidebar.label` (blog only) - Customize how blog posts appear in the blog sidebar without changing the post title

  Math equations (KaTeX) and Mermaid diagrams are now supported via Astro's standard remark/rehype plugin ecosystem.

## 0.5.11

### Patch Changes

- e283ff8: You can now automatically generate llms.txt and llms-full.txt files for your documentation site, making your docs accessible to AI coding assistants like Claude, Cursor, and others that support the llms.txt standard (https://llmstxt.org/).

  Enable this feature by adding the `llmsTxt` configuration option:

  ```javascript
  shipyardDocs({
    llmsTxt: {
      enabled: true,
      projectName: "My Project",
      summary: "A brief description of your project for LLMs",
    },
  });
  ```

  **Key features:**

  - Files are generated at `/{routeBasePath}/llms.txt` (e.g., `/docs/llms.txt`), supporting multiple docs instances
  - When i18n is configured, only content from the default locale is included to avoid mixing languages
  - A sidebar link with a copy-to-clipboard button is automatically added, making it easy to share the URL with AI assistants

## 0.5.10

### Patch Changes

- 4739185: You can now switch between languages directly from the navigation bar. When your Astro project has multiple locales configured, a language switcher automatically appears in both the desktop navigation dropdown and the mobile sidebar menu. The switcher reads available locales directly from your Astro i18n configuration, so there's no extra setup required beyond configuring Astro's built-in internationalization.
- 4739185: Added a new Markdown layout for prose-styled content pages. The Splash layout no longer applies prose styling, making it better suited for custom landing pages. Use the new Markdown layout when you want automatic typography styling for markdown content.

## 0.5.9

### Patch Changes

- 6fac4cf: Each package now includes a README with installation instructions, basic usage examples, and links to the official documentation at shipyard.levinkeller.de.

## 0.5.8

### Patch Changes

- 33612b2: Add Docusaurus-like navigation features:
  - Active sidebar entry highlighting with lighter styling
  - Breadcrumbs component showing navigation path
  - Table of contents with 12-column grid layout (9 cols content, 3 cols TOC)
  - Compact sidebar styling matching Docusaurus aesthetics
  - Mobile collapsible dropdown for table of contents
- e5e1a7b: feat: implement Docusaurus-like autogenerated sidebars

## 0.5.7

### Patch Changes

- 0eb9037: Fix footer links to work without i18n. The footer's withLocale function now checks if Astro.currentLocale exists before adding a locale prefix, fixing broken links (like /imprint) when i18n is not configured.

## 0.5.6

### Patch Changes

- 9364be5: trigger release

## 0.5.5

### Patch Changes

- 79a4e41: publishing packages with provenance to npmjs.org

## 0.5.4

### Patch Changes

- ff37845: Fix navigation menu issues for single locale pages

## 0.5.3

### Patch Changes

- 20eddf6: feat: restore support for non-i18n pages

  - Made i18n optional in shipyard base configuration
  - Updated docs and blog integrations to handle both i18n and non-i18n cases
  - Added conditional route patterns based on i18n configuration
  - Maintained full backward compatibility with existing i18n projects
  - Added single-locale demo application to demonstrate non-i18n usage
  - Updated documentation with comprehensive i18n vs non-i18n examples

## 0.5.2

### Patch Changes

- 60679ed: Add script injection capability to allow adding script tags to the HTML head. Supports both string URLs and object configurations with attributes like async, defer, and type. See #40.

## 0.5.1

### Patch Changes

- f5592db: last release failed, bumping

## 0.5.0

### Minor Changes

- a73a9cb: Dropped support for non-i18n pages.

## 0.4.1

### Patch Changes

- 6c8ac30: Do not show the string "undefined" when page title is not provided. Fix #17.

## 0.4.0

### Minor Changes

- 10362e3: enable usage without i18n

## 0.3.0

### Minor Changes

- bfdf717: Improve usage and functionality of the blog. Showing an "all posts" page now.

## 0.2.0

### Minor Changes

- 27b5827: Improve the interface

## 0.1.2

### Patch Changes

- 72531b7: bump to try a publication

## 0.1.1

### Patch Changes

- 718b9c0: release bump
