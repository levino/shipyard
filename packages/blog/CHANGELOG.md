# @levino/shipyard-blog

## 0.6.3

### Patch Changes

- 6cf308b: The `yaml` dependency is now correctly declared in package.json. This fixes build failures in clean environments (e.g., Docker) where transitive dependencies aren't available.

## 0.6.2

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

- Updated dependencies [e9cdc63]
- Updated dependencies [ed3ef9a]
  - @levino/shipyard-base@0.7.0

## 0.6.1

### Patch Changes

- 526e99f: You can now use shipyard with Astro's server mode (`output: 'server'`) without needing to set `prerender: false` explicitly. Shipyard automatically detects the output mode and configures prerendering accordingly:

  - `output: 'server'` → SSR by default (no prerendering)
  - `output: 'static'` or `output: 'hybrid'` → prerendering by default

  This enables use cases like authentication middleware that needs access to request headers/cookies at runtime.

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

### Patch Changes

- Updated dependencies [fd16435]
  - @levino/shipyard-base@0.6.0

## 0.5.1

### Patch Changes

- 6fac4cf: Each package now includes a README with installation instructions, basic usage examples, and links to the official documentation at shipyard.levinkeller.de.
- Updated dependencies [6fac4cf]
  - @levino/shipyard-base@0.5.9

## 0.5.0

### Minor Changes

- 3ec2987: You can now navigate between documentation pages using automatic next/previous pagination buttons. The pagination follows your sidebar structure and can be customized using `pagination_next` and `pagination_prev` frontmatter fields.

  Blog posts now automatically show older/newer post navigation buttons, making it easy for readers to navigate chronologically through your blog content.

  Both pagination components use Docusaurus-style grid layout that stays horizontal on all screen sizes, including mobile devices.

### Patch Changes

- f63db03: ## Documentation Metadata Features

  You can now display helpful metadata at the bottom of documentation pages to improve transparency and enable community contributions:

  - **"Edit this page" links**: Enable with the `editUrl` configuration option to show a link that takes users directly to the source file in your repository
  - **Last update timestamp**: Enable with `showLastUpdateTime: true` to automatically display when each page was last modified (based on git history)
  - **Last update author**: Enable with `showLastUpdateAuthor: true` to show who last modified the page (based on git history)

  Example docs configuration:

  ```typescript
  shipyardDocs({
    editUrl: "https://github.com/your-org/your-repo/edit/main/docs",
    showLastUpdateTime: true,
    showLastUpdateAuthor: true,
  });
  ```

  ## Multiple Documentation Instances

  You can now create multiple documentation sections with different collections by using the `collectionName` option:

  ```typescript
  // Primary docs at /docs
  shipyardDocs({
    routeBasePath: "docs",
    collectionName: "docs", // defaults to routeBasePath
    editUrl: "https://github.com/your-org/your-repo/edit/main/docs",
  });

  // Secondary docs (e.g., guides) at /guides
  shipyardDocs({
    routeBasePath: "guides",
    collectionName: "guides",
    editUrl: "https://github.com/your-org/your-repo/edit/main/guides",
    showLastUpdateTime: true,
    showLastUpdateAuthor: true,
  });
  ```

  ## Blog Metadata Features

  The blog plugin now supports the same metadata features as the docs plugin:

  ```typescript
  shipyardBlog({
    editUrl: "https://github.com/your-org/your-repo/edit/main/blog",
    showLastUpdateTime: true,
    showLastUpdateAuthor: true,
  });
  ```

  ## Per-Page/Post Frontmatter Overrides

  You can override metadata settings per-page (docs) or per-post (blog) using frontmatter:

  - `custom_edit_url`: Set a custom edit URL or `null` to disable for a specific page/post
  - `last_update_time`: Override the timestamp or set to `false` to hide
  - `last_update_author`: Override the author name or set to `false` to hide

  **Note:** Git metadata features require access to git history. When deploying with CI/CD, ensure you're not using shallow clones (use `fetch-depth: 0` with GitHub Actions).

## 0.4.6

### Patch Changes

- b47c799: Add customizable blog sidebar and pagination options

  ## Sidebar Configuration

  Configure how blog posts appear in the sidebar:

  - **blogSidebarCount**: Control the number of posts shown (default: 5)

    - Set to a number to limit displayed posts
    - Set to `'ALL'` to show all posts

  - **blogSidebarTitle**: Customize the sidebar section title (default: 'Recent posts')

  When posts exceed the configured limit, a "View all posts" link appears at the same level as the sidebar title for easy navigation.

  ## Pagination

  The blog index page now supports pagination with DaisyUI-styled navigation:

  - **postsPerPage**: Number of posts per page (default: 10)
  - Pages are accessible at `/blog` (page 1) and `/blog/page/2`, `/blog/page/3`, etc.
  - Pagination displays: `prev | first | ... | 7 | 8 (active) | 9 | ... | last | next`
  - Adjacent page numbers shown around current page with ellipsis for gaps
  - Full support for i18n localized blog pages

  Example configuration:

  ```js
  // astro.config.mjs
  import shipyardBlog from "@levino/shipyard-blog";

  export default defineConfig({
    integrations: [
      shipyardBlog({
        blogSidebarCount: 5,
        blogSidebarTitle: "Recent posts",
        postsPerPage: 10,
      }),
    ],
  });
  ```

## 0.4.5

### Patch Changes

- 9364be5: trigger release
- Updated dependencies [9364be5]
  - @levino/shipyard-base@0.5.6

## 0.4.4

### Patch Changes

- 79a4e41: publishing packages with provenance to npmjs.org
- Updated dependencies [79a4e41]
  - @levino/shipyard-base@0.5.5

## 0.4.3

### Patch Changes

- ff37845: Fix navigation menu issues for single locale pages
- ff37845: Disable configuration option which was ignored and misleading
- Updated dependencies [ff37845]
  - @levino/shipyard-base@0.5.4

## 0.4.2

### Patch Changes

- 20eddf6: feat: restore support for non-i18n pages

  - Made i18n optional in shipyard base configuration
  - Updated docs and blog integrations to handle both i18n and non-i18n cases
  - Added conditional route patterns based on i18n configuration
  - Maintained full backward compatibility with existing i18n projects
  - Added single-locale demo application to demonstrate non-i18n usage
  - Updated documentation with comprehensive i18n vs non-i18n examples

- Updated dependencies [20eddf6]
  - @levino/shipyard-base@0.5.3

## 0.4.1

### Patch Changes

- f5592db: last release failed, bumping
- Updated dependencies [f5592db]
  - @levino/shipyard-base@0.5.1

## 0.4.0

### Minor Changes

- a73a9cb: Dropped support for non-i18n pages.

### Patch Changes

- Updated dependencies [a73a9cb]
  - @levino/shipyard-base@0.5.0

## 0.3.2

### Patch Changes

- 6c8ac30: Do not show the string "undefined" when page title is not provided. Fix #17.
- Updated dependencies [6c8ac30]
  - @levino/shipyard-base@0.4.1

## 0.3.1

### Patch Changes

- Updated dependencies [10362e3]
  - @levino/shipyard-base@0.4.0

## 0.3.0

### Minor Changes

- bfdf717: Improve usage and functionality of the blog. Showing an "all posts" page now.

### Patch Changes

- Updated dependencies [bfdf717]
  - @levino/shipyard-base@0.3.0

## 0.2.0

### Minor Changes

- 27b5827: Improve the interface

### Patch Changes

- Updated dependencies [27b5827]
  - @levino/shipyard-base@0.2.0

## 0.1.2

### Patch Changes

- 72531b7: bump to try a publication
- Updated dependencies [72531b7]
  - @levino/shipyard-base@0.1.2

## 0.1.1

### Patch Changes

- 718b9c0: release bump
- Updated dependencies [718b9c0]
  - @levino/shipyard-base@0.1.1
