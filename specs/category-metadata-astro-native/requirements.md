# Requirements: Astro-Native Category Metadata

## Introduction

Shipyard currently has partial support for Docusaurus-style `_category_.json` files to provide metadata for documentation folder categories. However, this implementation has fundamental problems:

1. **Not wired up**: The utility code (`categoryMetadata.ts`) exists but is never called from the Layout component.

2. **Non-Astro-native approach**: Uses direct Node.js filesystem reads (`fs.readFileSync`, `existsSync`) which bypasses Astro's content layer, missing out on validation, type safety, hot reloading, and build pipeline integration.

**Decision:** Remove `_category_.json` support entirely and use frontmatter in `index.md` files as the single source of truth for category metadata. This aligns with Astro's content collection model and provides a cleaner developer experience.

---

## Design Decisions

### 1. Frontmatter Naming Convention

**Decision:** Use camelCase for all frontmatter fields.

**Rationale:** Consistent with JavaScript/TypeScript conventions. No mapping layer needed between frontmatter and internal code.

```yaml
# Good
sidebarPosition: 1

# Bad (deprecated)
sidebar_position: 1
```

### 2. Title and Description Semantics

**Decision:**
- The H1 heading in markdown is the **single source of truth** for the visible page title
- `title` in frontmatter is a **reference title** for SEO, pagination cards, and previews
- `description` in frontmatter is for meta description; falls back to first paragraph

**Rationale:** Avoids the Docusaurus problem of redundant `title` frontmatter + H1 heading that can get out of sync.

**Fallback chains:**
- Sidebar label: `sidebar.label` → `title` → H1 → filename
- SEO/pagination: `title` → H1 → filename
- Meta description: `description` → first paragraph of content

### 3. Sidebar Configuration Grouping

**Decision:** Group all sidebar-related fields under a `sidebar` object in frontmatter.

**Rationale:** Cleaner organization, clear that these fields affect sidebar behavior only.

```yaml
sidebar:
  position: 1
  label: Quick Start
  collapsible: true
  collapsed: false
  className: highlight
  customProps:
    badge: New
```

### 4. Page Rendering vs Sidebar Visibility

**Decision:** Two separate top-level fields with distinct purposes:

| Field | Sidebar Entry | Page Rendered | Use Case |
|-------|---------------|---------------|----------|
| `render: false` | Yes (non-clickable) | No | Category header without landing page |
| `unlisted: true` | No | Yes | Hidden page accessible via direct link |

**Validation:** If `render: false`, the file must not contain content below frontmatter (error if it does).

### 5. Internationalization Strategy

**Decision:** No `sidebarKey` field. Translations must mirror the original file structure.

**Rationale:**
- Keeps `id` field unique (not overloaded for cross-locale matching)
- Simpler mental model for users
- Use `slug` frontmatter for localized URLs if needed

**Convention:**
```
docs/
├── en/
│   └── getting-started/
│       └── installation.md
└── de/
    └── getting-started/       # Same structure
        └── installation.md    # Same filename
```

If localized URLs are needed:
```yaml
# de/getting-started/installation.md
---
slug: erste-schritte/installation
---
```

---

## Frontmatter Schema

### Complete Field Reference

```yaml
# === Page Metadata ===
id: string                    # Custom document ID (default: file path)
title: string                 # Reference title for SEO, pagination, previews (default: H1)
description: string           # Meta description (default: first paragraph)
keywords: [string]            # SEO keywords
image: string                 # Social preview image (og:image)
canonicalUrl: string          # Custom canonical URL

# === Page Rendering ===
render: boolean               # Whether to render a page (default: true)
draft: boolean                # Exclude from production builds (default: false)
unlisted: boolean             # Render page but hide from sidebar (default: false)
slug: string                  # Custom URL slug

# === Layout Options ===
hideTitle: boolean            # Hide the H1 heading (default: false)
hideTableOfContents: boolean  # Hide the TOC (default: false)
hideSidebar: boolean          # Full-width page without sidebar (default: false)
tocMinHeadingLevel: number    # Min heading level in TOC (default: 2)
tocMaxHeadingLevel: number    # Max heading level in TOC (default: 3)

# === Sidebar Configuration ===
sidebar:
  position: number            # Sort order (default: Infinity)
  label: string               # Display label (default: title → H1)
  className: string           # CSS class(es) for styling
  customProps: object         # Arbitrary metadata for custom components
  collapsible: boolean        # Can category be collapsed (default: true)
  collapsed: boolean          # Start collapsed (default: true)

# === Pagination ===
paginationLabel: string       # Label shown in prev/next buttons
paginationNext: string | null # Next page ID, or null to disable
paginationPrev: string | null # Previous page ID, or null to disable

# === Git Metadata Overrides ===
lastUpdate:
  date: Date                  # Override last update date
  author: string              # Override last update author
lastUpdateAuthor: string | false  # Override author, or false to hide
lastUpdateTime: Date | false      # Override timestamp, or false to hide
customEditUrl: string | null      # Custom edit URL, or null to disable

# === Custom Meta Tags ===
customMetaTags:
  - name: string              # Meta tag name
    property: string          # Meta tag property (for og: tags)
    content: string           # Meta tag content
```

### Category-Specific Fields (for index.md files)

When an `index.md` file exists in a folder, these fields control the category behavior:

```yaml
---
title: Advanced Topics
sidebar:
  position: 5
  label: Advanced
  collapsible: true
  collapsed: false
  className: advanced-section
  customProps:
    icon: rocket
---
```

If no `index.md` exists, the category uses defaults:
- Label: folder name
- Position: Infinity (sorted alphabetically after positioned items)
- Collapsible: true
- Collapsed: true

---

## Validation Rules

### Schema Validation (Zod)

1. **Collapsed requires collapsible:**
   ```
   IF sidebar.collapsed = true AND sidebar.collapsible = false
   THEN error: "sidebar.collapsed cannot be true when sidebar.collapsible is false"
   ```

2. **Render false requires no content:**
   ```
   IF render = false AND file contains content below frontmatter
   THEN error: "Files with render: false must not contain content"
   ```

3. **TOC heading levels:**
   ```
   IF tocMinHeadingLevel > tocMaxHeadingLevel
   THEN error: "tocMinHeadingLevel must be <= tocMaxHeadingLevel"
   ```

4. **Heading level range:**
   ```
   tocMinHeadingLevel: 1-6
   tocMaxHeadingLevel: 1-6
   ```

---

## Requirements

### Requirement 1: Category Metadata via index.md

**User Story:** As a documentation author, I want to configure category behavior using frontmatter in index.md files, so that I can control labels, positions, and collapse behavior without separate configuration files.

#### Acceptance Criteria

1. WHEN an `index.md` file exists in a folder THEN the system SHALL use its frontmatter for category configuration
2. WHEN no `index.md` exists THEN the system SHALL use default values (folder name as label, alphabetical sorting)
3. WHEN `sidebar.label` is set THEN the system SHALL display that label for the category in the sidebar
4. WHEN `sidebar.position` is set THEN the system SHALL sort the category accordingly
5. WHEN `sidebar.collapsible` is true THEN the system SHALL render a toggle control
6. WHEN `sidebar.collapsed` is true THEN the system SHALL render the category collapsed initially

### Requirement 2: Non-Rendered Category Pages

**User Story:** As a documentation author, I want to create category entries in the sidebar without a corresponding page, so that I can organize content hierarchically without requiring landing pages.

#### Acceptance Criteria

1. WHEN `render: false` is set THEN the system SHALL create a sidebar entry without rendering a page
2. WHEN `render: false` is set THEN the sidebar entry SHALL NOT be clickable
3. WHEN `render: false` is set AND the file contains content THEN the system SHALL throw a validation error
4. WHEN `render: false` is set THEN category metadata (label, position, collapsible) SHALL still apply

### Requirement 3: Unlisted Pages

**User Story:** As a documentation author, I want to create pages that are accessible via URL but hidden from the sidebar, so that I can share direct links without cluttering navigation.

#### Acceptance Criteria

1. WHEN `unlisted: true` is set THEN the system SHALL render the page
2. WHEN `unlisted: true` is set THEN the system SHALL NOT show the page in the sidebar
3. WHEN `unlisted: true` is set THEN the page SHALL be accessible via its URL
4. WHEN `unlisted: true` is set THEN the page SHALL NOT appear in pagination (prev/next)

### Requirement 4: Title and Description Fallbacks

**User Story:** As a documentation author, I want sensible defaults for titles and descriptions, so that I don't have to repeat information already present in my content.

#### Acceptance Criteria

1. WHEN `title` is not set THEN the system SHALL extract the H1 heading from content
2. WHEN neither `title` nor H1 exists THEN the system SHALL use the filename
3. WHEN `description` is not set THEN the system SHALL extract the first paragraph
4. WHEN `sidebar.label` is not set THEN the system SHALL fall back to `title`, then H1
5. The H1 heading SHALL be the visible title on the page (never duplicated by frontmatter)

### Requirement 5: Validation and Error Handling

**User Story:** As a developer, I want clear error messages when frontmatter is misconfigured, so that I can quickly identify and fix issues.

#### Acceptance Criteria

1. WHEN frontmatter fails schema validation THEN the system SHALL display a clear error message
2. WHEN `sidebar.collapsed: true` with `sidebar.collapsible: false` THEN the system SHALL throw an error
3. WHEN `render: false` with content present THEN the system SHALL throw an error
4. WHEN invalid field types are used THEN the system SHALL report the expected type

### Requirement 6: Internationalization Support

**User Story:** As a documentation author with a multi-language site, I want category metadata to work correctly with mirrored file structures.

#### Acceptance Criteria

1. WHEN using i18n THEN translations SHALL mirror the original file structure
2. WHEN `slug` is set THEN the system SHALL use it for localized URLs
3. WHEN a translation is missing THEN the system SHALL handle gracefully (not crash)
4. WHEN `sidebar.position` is set THEN it SHALL apply consistently across all locales

---

## Testing Requirements

### Demo Applications

Create or update demo applications in `apps/demos/` to showcase all frontmatter features:

1. **Category with index.md:**
   - Folder with `index.md` demonstrating `sidebar.position`, `sidebar.label`, `sidebar.collapsible`, `sidebar.collapsed`

2. **Category without index.md:**
   - Folder with only child documents, demonstrating default behavior

3. **Non-rendered category:**
   - `index.md` with `render: false` demonstrating sidebar-only entry

4. **Unlisted page:**
   - Document with `unlisted: true` demonstrating hidden but accessible page

5. **Title/description fallbacks:**
   - Document without `title` frontmatter, relying on H1
   - Document without `description`, relying on first paragraph

6. **Collapsed categories:**
   - Multiple categories with different `collapsible`/`collapsed` combinations

7. **Custom styling:**
   - Category with `sidebar.className` demonstrating CSS application

8. **Custom props:**
   - Category with `sidebar.customProps` demonstrating badge or icon rendering

### Integration Tests (Playwright)

Add E2E tests in `apps/demos/*/tests/e2e/` validating:

1. **Sidebar structure:**
   - Categories appear in correct order based on `sidebar.position`
   - Labels display correctly from `sidebar.label` or fallback
   - Correct nesting of categories and documents

2. **Collapse behavior:**
   - Collapsible categories have toggle control
   - Non-collapsible categories always show children
   - Initial collapsed state matches `sidebar.collapsed`
   - Toggle interaction works correctly

3. **Non-rendered pages:**
   - Sidebar entry exists but is not clickable
   - No page is generated at the expected URL (404)

4. **Unlisted pages:**
   - Page does not appear in sidebar
   - Page is accessible via direct URL
   - Page does not appear in pagination

5. **SEO and meta tags:**
   - `<title>` tag uses `title` frontmatter or H1 fallback
   - Meta description uses `description` or first paragraph fallback
   - Social preview tags (og:title, og:description, og:image) render correctly

6. **Validation errors:**
   - Build fails with clear message for `collapsed: true` + `collapsible: false`
   - Build fails with clear message for `render: false` with content

### Unit Tests (Vitest)

Add unit tests in `packages/docs/src/` for:

1. **Schema validation:**
   - All valid field combinations pass
   - Invalid combinations produce expected errors

2. **Sidebar tree building:**
   - Correct handling of index.md category metadata
   - Correct fallback behavior when no index.md exists
   - Proper sorting by position then alphabetically

3. **Fallback logic:**
   - Title extraction from H1
   - Description extraction from first paragraph
   - Label fallback chain

---

## Documentation Requirements

### Update Existing Documentation

Update the following documentation files:

1. **`apps/docs/docs/en/docs-package.md`** (and German translation):
   - Remove references to snake_case field names
   - Document all new camelCase frontmatter fields
   - Add `sidebar.*` grouped configuration documentation
   - Document `render` and `unlisted` fields
   - Add examples for each use case
   - Document fallback behavior for `title` and `description`

2. **`apps/docs/docs/en/` (new page or section):**
   - Category metadata guide
   - Migration guide from `_category_.json`
   - i18n file structure requirements

### New Documentation Sections

1. **Frontmatter Reference:**
   - Complete table of all frontmatter fields
   - Types, defaults, and descriptions
   - Examples for each field

2. **Category Configuration Guide:**
   - How to configure categories via index.md
   - When to use `render: false` vs `unlisted: true`
   - Collapse behavior configuration

3. **Migration Guide:**
   - Steps to migrate from `_category_.json` to index.md frontmatter
   - Field name mapping (snake_case → camelCase)
   - Before/after examples

---

## Migration Path

### Breaking Changes

1. **Field naming:** All snake_case fields renamed to camelCase
2. **Sidebar grouping:** `sidebar_*` fields moved to `sidebar.*` object
3. **Removal:** `_category_.json` support removed entirely

### Migration Steps

Users migrating from the current implementation:

1. **Rename frontmatter fields:**
   ```yaml
   # Before
   sidebar_position: 1
   sidebar_label: Quick Start
   hide_table_of_contents: true

   # After
   sidebar:
     position: 1
     label: Quick Start
   hideTableOfContents: true
   ```

2. **Convert `_category_.json` to index.md:**
   ```json
   // Before: getting-started/_category_.json
   {
     "label": "Getting Started",
     "position": 1,
     "collapsible": true
   }
   ```

   ```yaml
   # After: getting-started/index.md
   ---
   title: Getting Started
   sidebar:
     position: 1
     collapsible: true
   ---

   # Getting Started

   Optional landing page content...
   ```

3. **For categories without landing pages:**
   ```yaml
   # getting-started/index.md
   ---
   title: Getting Started
   render: false
   sidebar:
     position: 1
     collapsible: true
   ---
   ```

---

## Appendix: Design Rationale

### Why Not `_category_.json`?

1. **Bypasses Astro's content layer:** Direct filesystem reads don't participate in Astro's build pipeline, missing validation, type safety, and hot reloading.

2. **Inconsistent with other content:** Document frontmatter uses Astro's content collections; category metadata should too.

3. **Extra files to maintain:** Separate JSON files add cognitive overhead and can get out of sync with content.

4. **Not actually wired up:** The current implementation never worked - the code exists but isn't called.

### Why Not `sidebarKey` for i18n?

1. **`id` should be unique:** Overloading `id` for cross-locale matching creates confusion.

2. **Simpler mental model:** "Translations mirror the file structure" is easy to understand and enforce.

3. **`slug` handles localized URLs:** If you need `/de/erste-schritte/` instead of `/de/getting-started/`, use the `slug` field.

4. **YAGNI:** Most documentation sites use mirrored structures. Supporting arbitrary file paths per locale adds complexity for edge cases.

### Why camelCase?

1. **JavaScript convention:** Consistent with the language ecosystem.

2. **No mapping needed:** Frontmatter fields can be used directly in TypeScript without conversion.

3. **Clean break:** Shipyard is not a Docusaurus fork; there's no obligation to maintain their conventions.
