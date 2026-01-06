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
