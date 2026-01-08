# Ralph Session History

This file tracks session progress and outcomes.

---

## Session 2026-01-06T19:00:00Z

### Task Completed
- **ID**: fix-hide-table-of-contents
- **Title**: Fix failing test: hide_table_of_contents

### What Was Done
1. Added `hide_table_of_contents` and `hide_title` snake_case aliases to the docs schema for Docusaurus compatibility
2. Added a Zod transform to merge snake_case values into camelCase fields (`hide_table_of_contents` -> `hideTableOfContents`)
3. Updated the generated entry file template to extract and pass `hideTableOfContents` from entry.data to the Layout component
4. Modified Layout.astro to:
   - Accept the new `hideTableOfContents` prop
   - Conditionally render both mobile and desktop TOC based on this prop
   - Expand content to full width when TOC is hidden
5. Added unit tests to verify the snake_case to camelCase transformation works correctly

### Files Modified
- `packages/docs/src/index.ts` - Added snake_case aliases and schema transform
- `packages/docs/astro/Layout.astro` - Added hideTableOfContents prop and conditional rendering
- `packages/docs/src/schema.test.ts` - Added unit tests for snake_case transformation

### Tips for Next Developer
- The docs schema now has a transform that converts snake_case frontmatter fields to camelCase
- When adding new frontmatter options that need Docusaurus compatibility, follow the same pattern:
  1. Add both camelCase (with default) and snake_case (optional) fields
  2. Add a transform to merge them (snake_case takes priority via `??` operator)
- The generated entry file in `node_modules/.shipyard-docs/` is regenerated on each build, so changes to the template in `packages/docs/src/index.ts` require a rebuild

### Tests
- All Hide Table of Contents tests now pass
- Unit tests added for schema transformation
- One unrelated pagination test was already failing before this session

---

## Session 2026-01-06T19:15:00Z

### Tasks Completed
- **ID**: fix-keywords-meta-tag - Fix failing test: keywords meta tag
- **ID**: fix-og-image-meta-tag - Fix failing test: og:image meta tag
- **ID**: fix-twitter-card-meta-tag - Fix failing test: twitter:card meta tag

### What Was Done
1. Updated the generated entry file template in `packages/docs/src/index.ts` to extract and pass SEO-related props (`keywords`, `image`, `canonicalUrl`, `customMetaTags`) from entry.data to the Layout component
2. Added new props to `packages/docs/astro/Layout.astro` for the SEO fields
3. Passed these SEO props through to the BaseLayout component
4. Added snake_case aliases for Docusaurus compatibility:
   - `canonical_url` -> `canonicalUrl`
   - `custom_meta_tags` -> `customMetaTags`
5. Added Zod transforms to merge snake_case values into camelCase fields
6. Added unit tests for the new snake_case transformations

### Files Modified
- `packages/docs/src/index.ts` - Added snake_case aliases, schema transforms, and updated entry file template
- `packages/docs/astro/Layout.astro` - Added SEO props and passed them to BaseLayout
- `packages/docs/src/schema.test.ts` - Added unit tests for canonical_url and custom_meta_tags transforms

### Tips for Next Developer
- The SEO metadata (keywords, image, og:image, twitter:card) is now properly passed through the Layout chain
- The base layout (`packages/base/astro/layouts/Page.astro`) already supported these props - the fix was just passing them through
- When adding new SEO-related frontmatter fields, remember to:
  1. Add the field to the schema if not present
  2. Add snake_case alias if Docusaurus compatibility is needed
  3. Update the generated entry file to extract the field
  4. Add it to Layout.astro props
  5. Pass it to BaseLayout

### Tests
- All SEO Features tests now pass (keywords, og:image, twitter:card)
- Unit tests added for schema transformations

---

## Session 2026-01-06T19:20:00Z

### Task Completed
- **ID**: fix-hide-title
- **Title**: Fix failing test: hide_title

### What Was Done
1. Updated the generated entry file template in `packages/docs/src/index.ts` to extract and pass `hideTitle` from entry.data to the Layout component
2. Added `hideTitle` prop to `packages/docs/astro/Layout.astro` (the schema already had it from a previous session)
3. Applied a conditional `.hide-title` CSS class to the prose container when hideTitle is true
4. Added a global CSS rule in `packages/base/src/globals.css` to hide the first H1 when `.hide-title` class is present

### Files Modified
- `packages/docs/src/index.ts` - Added hideTitle extraction and prop passing in entry file template
- `packages/docs/astro/Layout.astro` - Added hideTitle prop and conditional class on prose container
- `packages/base/src/globals.css` - Added `.hide-title h1:first-of-type { display: none }` rule

### Tips for Next Developer
- The hide_title feature uses a CSS-based approach with `display: none` on the first H1
- The CSS is in the global stylesheet to ensure it's always bundled (Astro may tree-shake component-scoped styles)
- The `.hide-title` class is applied to the `.prose` container, and the CSS targets the first `h1:first-of-type` within it
- The test verifies `toHaveCSS('display', 'none')` on the H1 element

### Tests
- The Hide Title test now passes
- All other previously passing tests still pass
- 11 tests still fail - these correspond to other pending tasks in tasks.json

---

## Session 2026-01-06T19:30:00Z

### Task Completed
- **ID**: fix-pagination-label
- **Title**: Fix failing test: pagination_label

### What Was Done
1. Added `pagination_label` snake_case alias to the docs schema for Docusaurus compatibility
2. Added Zod transform to merge `pagination_label` into `paginationLabel`
3. Created `getPaginationLink` helper function in `packages/docs/src/pagination.ts` that:
   - Looks up the target page's doc data by normalized path
   - Uses the `getDisplayTitle` function to get paginationLabel > sidebarLabel > title
4. Updated the `getPaginationInfo` function to use `getPaginationLink` for:
   - Index page's next link
   - Normal page's prev/next links
5. Fixed the E2E test to use the correct page (`/docs/my-custom-url`) that has a next link with pagination_label
6. Added stronger assertions to verify pagination_label is actually used (not just visible, but contains correct text)
7. Added unit test for pagination_label snake_case to camelCase transformation

### Files Modified
- `packages/docs/src/index.ts` - Added pagination_label snake_case alias and schema transform
- `packages/docs/src/pagination.ts` - Added getPaginationLink helper and updated getPaginationInfo
- `packages/docs/src/schema.test.ts` - Added unit test for pagination_label transformation
- `apps/demos/single-language/tests/e2e/new-features.spec.ts` - Fixed test to use correct page and better assertions

### Tips for Next Developer
- The pagination system now looks up doc frontmatter for each prev/next link to get the correct paginationLabel
- The sidebar entries don't include paginationLabel (it's pagination-specific), so we need to look it up separately
- When testing pagination features, note that the sidebar is sorted alphabetically by label, not by sidebar_position
- Clear Astro cache (`rm -rf .astro`) if schema changes don't take effect immediately

### Tests
- The Pagination Label test now passes
- All 82 tests pass (excluding the 6 tests for still-pending tasks)
- 10 tests still fail - these correspond to other pending tasks in tasks.json

---

## Session 2026-01-06T19:40:00Z

### Tasks Completed
- **ID**: fix-canonical-url - Fix failing test: canonical_url
- **ID**: fix-custom-meta-tags-robots - Fix failing test: custom robots meta tag
- **ID**: fix-custom-meta-tags-author - Fix failing test: custom author meta tag
- **ID**: fix-custom-meta-tags-og-locale - Fix failing test: custom og:locale meta tag

### What Was Done
1. Investigated the fix-canonical-url task and discovered it was already implemented in a previous session
2. Ran E2E tests to verify canonical_url and custom_meta_tags features are working correctly
3. All 4 related tests pass: canonical link tag, robots meta tag, author meta tag, og:locale meta tag
4. Updated tasks.json to reflect the actual completed status of these tasks

### Files Modified
- `ralph/tasks.json` - Updated status of 4 tasks from pending to completed
- `ralph/history.md` - Added session notes

### Tips for Next Developer
- The fix-keywords-meta-tag session (2026-01-06T19:15:00Z) implemented more than originally documented
- It included support for: keywords, og:image, twitter:card, canonical_url, and custom_meta_tags
- When checking task status, run the actual E2E tests to verify - some tasks may already be complete
- The test suite now shows only 6 failing tests corresponding to the remaining pending tasks:
  1. sidebar badge (fix-sidebar-badge)
  2. badge style class (fix-sidebar-badge-style)
  3. custom document id pagination (fix-custom-document-id-pagination)
  4. custom document id title (fix-custom-document-id-title)
  5. title_meta frontmatter (fix-title-meta-frontmatter)
  6. blog sidebar_label (fix-blog-sidebar-label)

### Tests
- 96 tests pass
- 6 tests still fail - corresponding to remaining pending tasks

---

## Session 2026-01-06T19:50:00Z

### Tasks Completed
- **ID**: fix-sidebar-badge - Fix failing test: sidebar badge
- **ID**: fix-sidebar-badge-style - Fix failing test: sidebar badge style

### What Was Done
1. Added Docusaurus-compatible snake_case sidebar aliases to docs schema:
   - `sidebar_position` → `sidebar.position`
   - `sidebar_label` → `sidebar.label`
   - `sidebar_class_name` → `sidebar.className`
   - `sidebar_custom_props` → `sidebar.customProps`
2. Added Zod transform to merge snake_case sidebar fields into the nested sidebar object
3. Added `customProps` field to Entry type in `@levino/shipyard-base/astro/components/types.ts`
4. Updated TreeNode interface in `sidebarEntries.ts` to include customProps
5. Passed customProps through `createLeafNode`, `mergeNodeWithDoc`, and `treeNodeToEntry`
6. Updated `SidebarElement.astro` to render badges:
   - Extracts badge text from `customProps.badge`
   - Extracts badge style from `customProps.badgeType` (defaults to 'info')
   - Renders with DaisyUI classes: `badge badge-{type} badge-sm`
7. Added 5 unit tests for sidebar snake_case transformations
8. Fixed pre-existing broken test for pagination_label (wrong page URL)

### Files Modified
- `packages/docs/src/index.ts` - Added snake_case sidebar aliases and schema transform
- `packages/base/astro/components/types.ts` - Added customProps to Entry type
- `packages/docs/src/sidebarEntries.ts` - Added customProps to TreeNode and pipeline
- `packages/base/astro/components/SidebarElement.astro` - Added badge rendering
- `packages/docs/src/schema.test.ts` - Added unit tests for sidebar snake_case transforms
- `apps/demos/single-language/tests/e2e/new-features.spec.ts` - Fixed pagination_label test URL

### Tips for Next Developer
- The sidebar badge feature uses `sidebar_custom_props.badge` for text and `sidebar_custom_props.badgeType` for style
- Available badge types: info (default), success, warning, error, primary, secondary, accent
- The schema transform runs AFTER defaults are applied, so snake_case aliases override nested sidebar values
- When adding new Docusaurus-compatible frontmatter fields, follow the snake_case alias pattern established here
- Some i18n demo tests are failing due to content/test mismatches (unrelated to this work)

### Tests
- 98 tests pass in single-language demo
- 4 tests still fail (pending tasks: custom document id, title_meta, blog sidebar_label)
- Sidebar badge tests now pass

---

## Session 2026-01-06T19:57:00Z

### Tasks Completed
- **ID**: fix-custom-document-id-pagination - Fix failing test: custom document id pagination
- **ID**: fix-custom-document-id-title - Fix failing test: custom document id title

### What Was Done
1. Added `customId` field to `DocsData` interface in `sidebarEntries.ts` to store the custom document ID from frontmatter
2. Added `pagination_next` and `pagination_prev` snake_case aliases to the docs schema for Docusaurus compatibility
3. Fixed Zod transform for nullable fields: used `'key' in data` check instead of `??` operator
   - Problem: `null ?? undefined = undefined` doesn't preserve the explicit `null` value
   - Solution: Check if the key exists using `'pagination_next' in data` before applying
4. Updated `Layout.astro` to extract `customId` from `doc.data.id` and include it in the docs array
5. Added `findDocById` helper function in `pagination.ts` that looks up docs by either:
   - Content collection ID (file path based)
   - Custom frontmatter ID (`doc.data.id`)
6. Updated all pagination ID lookups to use `findDocById` instead of direct `doc.id` comparisons
7. Added 4 unit tests for `pagination_next` and `pagination_prev` snake_case transforms

### Files Modified
- `packages/docs/src/sidebarEntries.ts` - Added customId field to DocsData interface
- `packages/docs/src/index.ts` - Added pagination_next/pagination_prev aliases and fixed nullable transform
- `packages/docs/src/pagination.ts` - Added findDocById helper and updated all ID lookups
- `packages/docs/astro/Layout.astro` - Extract customId from doc.data.id
- `packages/docs/src/schema.test.ts` - Added unit tests for pagination snake_case transforms

### Tips for Next Developer
- When adding nullable snake_case aliases (where `null` has special meaning), use `'key' in data` check
- The `??` operator doesn't work for preserving `null` because `null ?? undefined = undefined`
- Custom document IDs can be referenced in `pagination_next`/`pagination_prev` frontmatter
- The demo has pages demonstrating this: `custom-id-example.md` has `id: my-custom-doc-id`
- Clear ALL Astro caches when debugging schema changes: `.astro`, `node_modules/.astro`, `node_modules/.shipyard-docs`

### Tests
- All 4 Custom Document ID tests pass
- 100 tests pass in single-language demo
- 2 tests still fail (pending tasks: title_meta, blog sidebar_label)
- i18n demo has pre-existing blog pagination test failures (unrelated to this work)

---

## Session 2026-01-06T20:10:00Z

### Task Completed
- **ID**: fix-title-meta-frontmatter
- **Title**: Fix failing test: title_meta

### What Was Done
1. Added `title_meta` field to the docs schema in `packages/docs/src/index.ts`
   - Docusaurus uses snake_case convention for this field, so we keep it as `title_meta` (not titleMeta)
2. Updated the generated entry file template to extract `title_meta` as `titleMeta` and pass it to the Layout
3. Added `titleMeta` prop to `packages/docs/astro/Layout.astro`
4. Passed `titleMeta` to BaseLayout as the `title` prop
5. BaseLayout's `getTitle` function combines the site title with `titleMeta` to create the full `<title>` tag
6. Added unit test for `title_meta` schema field

### Files Modified
- `packages/docs/src/index.ts` - Added title_meta field to docsSchema, updated entry file template
- `packages/docs/astro/Layout.astro` - Added titleMeta prop and passed to BaseLayout as title
- `packages/docs/src/schema.test.ts` - Added unit test for title_meta

### Tips for Next Developer
- The `title_meta` field in Docusaurus allows specifying a different title for the browser tab than what's displayed in the sidebar
- Unlike most snake_case aliases in this codebase, `title_meta` is kept as-is because that's the Docusaurus convention
- The BaseLayout's `getTitle(siteTitle, pageTitle)` function combines both: `{siteTitle} - {pageTitle}`
- When `titleMeta` is undefined (page doesn't have it), nothing is passed to BaseLayout's title prop
- The sidebar still uses the regular `title` field - `title_meta` only affects the `<title>` tag

### Tests
- Both Title Meta tests pass:
  - `page with title_meta uses it for the page title instead of regular title`
  - `page with title_meta still shows regular title in sidebar`
- 101 tests pass in single-language demo
- 1 test still fails (pending task: blog sidebar_label)

---

## Session 2026-01-06T20:15:00Z

### Task Completed
- **ID**: fix-blog-sidebar-label
- **Title**: Fix failing test: blog sidebar_label

### What Was Done
1. Investigated the failing test - the blog post already had `sidebar_label: Advanced Features` in frontmatter
2. The blog Layout.astro was already correctly using `sidebar_label ?? postTitle` to build the navigation
3. Discovered the issue: the sidebar `<details>` element was collapsed by default
4. The SidebarElement component uses `collapsed ?? true` as default, hiding child entries unless expanded
5. Added `collapsed: false` to the blog sidebar navigation tree in `packages/blog/astro/Layout.astro`
6. This matches Docusaurus behavior where blog sidebar shows recent posts expanded by default

### Files Modified
- `packages/blog/astro/Layout.astro` - Added `collapsed: false` to posts navigation entry

### Tips for Next Developer
- The sidebar's expand/collapse state is controlled by the `collapsed` property in the navigation tree
- By default, `collapsed ?? true` means all sections are collapsed unless explicitly set to `false`
- Sections will auto-expand if they contain an active child (via `shouldBeOpen = hasActiveChild || !collapsed`)
- For blogs, users typically want to see recent posts immediately, so `collapsed: false` is appropriate
- The i18n demo has pre-existing test failures related to content/test mismatches - not caused by this change

### Tests
- Both Blog Sidebar Label tests pass:
  - `blog post with sidebar_label uses it in sidebar`
  - `blog post with title_meta uses it for page title`
- All 102 tests pass in single-language demo
- All tasks in tasks.json are now completed!

---
