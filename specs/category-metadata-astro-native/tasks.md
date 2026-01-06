# Implementation Plan

## Progress Summary
- **Total Tasks**: 21
- **Completed**: 21
- **Remaining**: 0
- **Progress**: 100%

---

## Completed Tasks

### Phase 1: Schema and Type Foundation

- [x] 1. Update Zod schema with new sidebar object structure
  - Modify `docsSchema` in `packages/docs/src/index.ts` to use grouped `sidebar` object
  - Create `sidebarSchema` sub-schema with `position`, `label`, `className`, `customProps`, `collapsible`, `collapsed` fields
  - Add `.refine()` validation for `collapsed: true` with `collapsible: false` error
  - Rename snake_case fields to camelCase: `sidebar_position` -> removed (use `sidebar.position`), etc.
  - Add new top-level fields: `render`, `unlisted`, `draft`, `hideTitle`, `hideTableOfContents`, `hideSidebar`
  - Add TOC fields: `tocMinHeadingLevel`, `tocMaxHeadingLevel` with `.refine()` validation
  - Add pagination fields: `paginationLabel`, `paginationNext`, `paginationPrev`
  - Rename git metadata fields to camelCase: `last_update_author` -> `lastUpdateAuthor`, etc.
  - Files to modify: `packages/docs/src/index.ts`
  - Requirements: [R1], [R5]

- [x] 2. Update DocsData interface for new fields
  - Add `collapsible?: boolean` field to `DocsData` interface
  - Add `collapsed?: boolean` field to `DocsData` interface
  - Add `unlisted?: boolean` field to `DocsData` interface
  - Add `paginationLabel?: string` field to `DocsData` interface
  - Add `sidebarCustomProps?: Record<string, unknown>` field (already exists, verify)
  - Remove deprecated snake_case field references: `pagination_next`, `pagination_prev`
  - Add camelCase pagination fields: `paginationNext`, `paginationPrev`
  - Files to modify: `packages/docs/src/sidebarEntries.ts`
  - Requirements: [R1], [R2], [R3]

- [x] 3. Update Entry type with collapsible properties
  - Add `collapsible?: boolean` field to Entry type definition
  - Add `collapsed?: boolean` field to Entry type definition
  - Files to modify: `packages/base/astro/components/types.ts`
  - Requirements: [R1]

### Phase 2: Sidebar Tree Builder Updates

- [x] 4. Update TreeNode interface for collapsible support
  - Add `readonly collapsible: boolean` field to TreeNode interface
  - Add `readonly collapsed: boolean` field to TreeNode interface
  - Update `createLeafNode` to include `collapsible` and `collapsed` from DocsData
  - Update `createBranchNode` to set default `collapsible: true`, `collapsed: true`
  - Update `mergeNodeWithDoc` to handle `collapsible` and `collapsed` merging
  - Files to modify: `packages/docs/src/sidebarEntries.ts`
  - Requirements: [R1]

- [x] 5. Implement unlisted page filtering in sidebar builder
  - Add filter to exclude docs where `unlisted: true` before building tree
  - Ensure unlisted pages still render but do not appear in navigation
  - Files to modify: `packages/docs/src/sidebarEntries.ts`
  - Requirements: [R3]

- [x] 6. Update treeNodeToEntry to output collapsible properties
  - Modify `treeNodeToEntry` function to include `collapsible` and `collapsed` in Entry output
  - Only include these properties when node has children (category nodes)
  - Files to modify: `packages/docs/src/sidebarEntries.ts`
  - Requirements: [R1]

### Phase 3: Component Updates

- [x] 7. Update SidebarElement component with collapse UI
  - Add `<details>` and `<summary>` HTML elements for collapsible categories
  - Conditionally render collapse toggle when `collapsible: true` and `subEntry` exists
  - Set `open` attribute based on `collapsed` value (open when not collapsed)
  - Render non-clickable categories as `<span>` when `href` is undefined
  - Auto-expand parent categories when child is active using `isActiveOrHasActiveChild`
  - Files to modify: `packages/base/astro/components/SidebarElement.astro`
  - Requirements: [R1], [R2]

- [x] 8. Update Layout.astro data transformation
  - Update data mapping to read from new `sidebar.*` grouped fields
  - Map `sidebar.position` to `sidebarPosition`
  - Map `sidebar.label` to `sidebarLabel`
  - Map `sidebar.className` to `sidebarClassName`
  - Map `sidebar.customProps` to `sidebarCustomProps`
  - Map `sidebar.collapsible` to `collapsible`
  - Map `sidebar.collapsed` to `collapsed`
  - Map `render` to `link` (inverted: `link = render`)
  - Map `unlisted` directly
  - Map `paginationLabel`, `paginationNext`, `paginationPrev`
  - Files to modify: `packages/docs/astro/Layout.astro`
  - Requirements: [R1], [R2], [R3], [R4]

- [x] 9. Update generated DocsEntry.astro template for non-rendered pages
  - Modify `getStaticPaths()` in generated entry template to filter out `render: false` pages
  - Update frontmatter field access to use camelCase names
  - Files to modify: `packages/docs/src/index.ts` (the generated entry template string)
  - Requirements: [R2]

### Phase 4: Pagination Updates

- [x] 10. Update pagination logic for unlisted pages
  - Unlisted pages are already excluded from sidebar entries, verify pagination excludes them
  - Update `getPaginationInfo` to use `paginationLabel` for display when available
  - Update field access from `pagination_next`/`pagination_prev` to `paginationNext`/`paginationPrev`
  - Files to modify: `packages/docs/src/pagination.ts`
  - Requirements: [R3]

### Phase 5: Build-time Validation

- [x] 11. Add build-time validation for render:false with content
  - Add `astro:build:start` hook to shipyard-docs integration
  - Fetch docs collection and check each doc with `render: false`
  - Throw descriptive error if doc body contains content (non-empty after trim)
  - Files to modify: `packages/docs/src/index.ts`
  - Requirements: [R2], [R5]

### Phase 6: Title/Description Fallback Utilities

- [x] 12. Create utility function for first paragraph extraction
  - Create `extractFirstParagraph(body: string): string | undefined` function
  - Skip headings (lines starting with `#`)
  - Return first non-empty paragraph text
  - Add unit tests for various markdown content scenarios
  - Files to create: `packages/docs/src/fallbacks.ts`, `packages/docs/src/fallbacks.test.ts`
  - Requirements: [R4]

- [x] 13. Implement title fallback chain in Layout.astro
  - Update title resolution: `sidebar.label` -> `title` -> H1 heading -> filename
  - Apply fallback chain for `sidebarLabel` output
  - Apply fallback chain for SEO title (separate from sidebar label)
  - Files to modify: `packages/docs/astro/Layout.astro`
  - Requirements: [R4]

### Phase 7: Unit Tests

- [x] 14. Add Zod schema validation unit tests
  - Create test file for schema validation
  - Test valid sidebar configuration acceptance
  - Test `collapsed: true` with `collapsible: false` rejection
  - Test `tocMinHeadingLevel > tocMaxHeadingLevel` rejection
  - Test default values are applied correctly
  - Test all field types are validated correctly
  - Files to create: `packages/docs/src/schema.test.ts`
  - Requirements: [R5]

- [x] 15. Extend sidebarEntries.test.ts for new features
  - Add test: includes `collapsible`/`collapsed` in category entries
  - Add test: filters unlisted pages from sidebar
  - Add test: creates non-clickable entries for `render: false` (no href)
  - Add test: applies index.md metadata to parent category including collapsible state
  - Files to modify: `packages/docs/src/sidebarEntries.test.ts`
  - Requirements: [R1], [R2], [R3]

- [x] 16. Update pagination.test.ts for new field names
  - Update existing tests to use camelCase field names
  - Add test: uses `paginationLabel` for display when available
  - Verify unlisted pages excluded from pagination
  - Files to modify: `packages/docs/src/pagination.test.ts`
  - Requirements: [R3]

### Phase 8: Demo Content and E2E Tests

- [x] 17. Create demo content for category metadata features
  - Create folder with `index.md` demonstrating `sidebar.position`, `sidebar.label`, `sidebar.collapsible`, `sidebar.collapsed`
  - Create folder with only child documents (no index.md) demonstrating default behavior
  - Create `index.md` with `render: false` demonstrating sidebar-only entry
  - Create document with `unlisted: true` demonstrating hidden but accessible page
  - Create documents without `title` frontmatter demonstrating H1 fallback
  - Create categories with different `collapsible`/`collapsed` combinations
  - Files to create/modify in: `apps/demos/i18n/docs/en/`, `apps/demos/single-language/docs/`
  - Requirements: [R1], [R2], [R3], [R4]

- [x] 18. Create E2E tests for category metadata
  - Test: categories appear in correct order based on `sidebar.position`
  - Test: labels display correctly from `sidebar.label` or fallback
  - Test: collapsible categories have toggle control
  - Test: non-collapsible categories always show children
  - Test: initial collapsed state matches `sidebar.collapsed`
  - Test: toggle interaction expands/collapses children
  - Test: active page parent category is expanded
  - Files to create: `apps/demos/i18n/tests/e2e/category-metadata.spec.ts`
  - Requirements: [R1]

- [x] 19. Create E2E tests for non-rendered and unlisted pages
  - Test: sidebar entry exists for `render: false` page but is not clickable
  - Test: navigating to `render: false` URL returns 404
  - Test: unlisted page renders at direct URL
  - Test: unlisted page not visible in sidebar
  - Test: unlisted page not in prev/next pagination
  - Files to create: `apps/demos/i18n/tests/e2e/unlisted-pages.spec.ts`
  - Requirements: [R2], [R3]

### Phase 9: Integration and Cleanup

- [x] 20. Update llms.txt generation for new field names
  - Update field access in generated llms.txt endpoint files from `sidebar_position` to `sidebar.position`
  - Ensure llms.txt respects `unlisted` and `render` fields appropriately
  - Files to modify: `packages/docs/src/index.ts` (generated endpoint templates)
  - Requirements: [R1]

- [x] 21. Remove deprecated categoryMetadata.ts file
  - Delete the unused `categoryMetadata.ts` file that used `_category_.json`
  - Verify no other files import from it
  - Update any exports in index.ts if needed
  - Files to delete: `packages/docs/src/categoryMetadata.ts` (if exists)
  - Files to modify: `packages/docs/src/index.ts` (remove exports if any)
  - Requirements: [R1]

---

## Notes

### Migration Impact
This implementation introduces breaking changes:
- All snake_case frontmatter fields renamed to camelCase
- Sidebar fields grouped under `sidebar.*` object
- `_category_.json` support removed entirely

### Testing Strategy
- Unit tests validate schema, sidebar builder, and fallback logic
- E2E tests validate user-facing behavior in demo applications
- All tests should pass before merging

### Dependencies Between Tasks
- Tasks 1-3 (schema/types) must complete before Tasks 4-6 (sidebar builder)
- Tasks 4-6 must complete before Tasks 7-9 (components)
- Task 12 (fallbacks utility) can be done in parallel with Tasks 4-9
- Tasks 14-16 (unit tests) depend on their respective implementation tasks
- Tasks 17-19 (demo/E2E) depend on all implementation tasks completing
