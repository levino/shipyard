# @levino/shipyard-docs

## 0.5.2

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

- Updated dependencies [e283ff8]
  - @levino/shipyard-base@0.5.11

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

## 0.4.7

### Patch Changes

- 0a23cd8: Add support for multiple documentation instances

  You can now host multiple independent documentation sections within a single Astro site. This is useful for separating user guides, API references, tutorials, or any other content that needs its own navigation and URL structure.

  Each documentation instance can be mounted at a custom path (e.g., `/guides/`, `/api-docs/`) and maintains its own sidebar navigation. See the multi-docs documentation for setup instructions.

## 0.4.6

### Patch Changes

- 33612b2: Add Docusaurus-like navigation features:
  - Active sidebar entry highlighting with lighter styling
  - Breadcrumbs component showing navigation path
  - Table of contents with 12-column grid layout (9 cols content, 3 cols TOC)
  - Compact sidebar styling matching Docusaurus aesthetics
  - Mobile collapsible dropdown for table of contents
- e5e1a7b: feat: implement Docusaurus-like autogenerated sidebars
- Updated dependencies [33612b2]
- Updated dependencies [e5e1a7b]
  - @levino/shipyard-base@0.5.8

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

## 0.3.0

### Minor Changes

- 10362e3: enable usage without i18n

### Patch Changes

- Updated dependencies [10362e3]
  - @levino/shipyard-base@0.4.0

## 0.2.1

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
