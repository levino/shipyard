---
title: Documentation Pagination
sidebar_position: 4
---

# Documentation Pagination

Shipyard automatically adds "Previous" and "Next" navigation buttons at the bottom of each documentation page, helping users navigate through your documentation in a linear fashion.

## How It Works

Pagination is automatically enabled for all documentation pages and follows the sidebar structure and ordering:

1. **Sidebar order**: The pagination order matches the sequence of pages in your sidebar navigation
2. **Nested categories**: Pagination works seamlessly across nested documentation categories
3. **First and last pages**: The first page shows only "Next", and the last page shows only "Previous"

## Basic Usage

Pagination is enabled by default - no configuration required! Just create your documentation pages and they'll automatically have pagination links at the bottom.

```markdown
---
title: Getting Started
---

# Getting Started

Your documentation content here...

<!-- Pagination buttons will appear automatically at the bottom -->
```

## Customizing Pagination

You can customize pagination behavior using frontmatter:

### Override Next/Previous Pages

To link to a specific page instead of the default next/previous:

```markdown
---
title: Getting Started
pagination_next: advanced/deployment.md
pagination_prev: introduction.md
---
```

The `pagination_next` and `pagination_prev` values should be the **document ID** (the file path relative to your docs directory).

### Disable Pagination

To disable the next button:

```markdown
---
pagination_next: null
---
```

To disable the previous button:

```markdown
---
pagination_prev: null
---
```

To disable both buttons (no pagination):

```markdown
---
pagination_next: null
pagination_prev: null
---
```

## Schema Reference

The following frontmatter fields control pagination:

| Field | Type | Description |
|-------|------|-------------|
| `pagination_next` | `string \| null` | Document ID of the next page, or `null` to disable |
| `pagination_prev` | `string \| null` | Document ID of the previous page, or `null` to disable |

## Examples

### Example 1: Skip a Page

If you want to skip a page in the pagination sequence:

```markdown
---
# intro.md
title: Introduction
pagination_next: basics/getting-started.md
---
```

This will make the "Next" button skip directly to `basics/getting-started.md` instead of going to the next page in sidebar order.

### Example 2: Create Custom Learning Path

You can create a custom learning path that differs from the sidebar structure:

```markdown
---
# tutorial-1.md
title: Tutorial 1
pagination_next: tutorial-2.md
pagination_prev: null
---
```

```markdown
---
# tutorial-2.md
title: Tutorial 2
pagination_next: tutorial-3.md
pagination_prev: tutorial-1.md
---
```

### Example 3: Disable Pagination on Landing Page

```markdown
---
# index.md
title: Welcome
pagination_next: null
pagination_prev: null
---

# Welcome to the Documentation

This is a landing page with no pagination.
```

## Styling

The pagination component uses DaisyUI button styles and is fully responsive:

- **Desktop**: Buttons are displayed side-by-side with proper spacing
- **Mobile**: Buttons stack vertically for better usability
- **Accessibility**: Proper ARIA labels and semantic HTML

## Internationalization

Pagination respects locale boundaries when used with i18n:

- Pages only link to other pages in the same locale
- The sidebar structure for each locale determines the pagination order
- This ensures users stay within their selected language

## API Reference

### getPaginationInfo

Utility function to compute pagination information for a page:

```typescript
import { getPaginationInfo } from '@levino/shipyard-docs'

const pagination = getPaginationInfo(
  currentPath,    // Current page path (e.g., '/docs/getting-started')
  sidebarEntries, // Sidebar entry structure
  allDocs         // All documentation pages with metadata
)

// Returns:
// {
//   prev?: { title: string, href: string },
//   next?: { title: string, href: string }
// }
```

### PaginationInfo Type

```typescript
interface PaginationInfo {
  prev?: PaginationLink
  next?: PaginationLink
}

interface PaginationLink {
  title: string
  href: string
}
```

## Component Reference

### DocPagination

The `DocPagination.astro` component renders the pagination buttons:

```astro
---
import DocPagination from '@levino/shipyard-docs/astro/DocPagination.astro'
---

<DocPagination
  prev={{ title: "Introduction", href: "/docs/intro" }}
  next={{ title: "Getting Started", href: "/docs/getting-started" }}
/>
```

Props:

| Prop | Type | Description |
|------|------|-------------|
| `prev` | `PaginationLink?` | Previous page information |
| `next` | `PaginationLink?` | Next page information |

## Comparison with Docusaurus

Shipyard's pagination feature is inspired by and compatible with Docusaurus pagination:

| Feature | Shipyard | Docusaurus |
|---------|----------|------------|
| Automatic pagination | ✅ | ✅ |
| `pagination_next` override | ✅ | ✅ |
| `pagination_prev` override | ✅ | ✅ |
| Disable with `null` | ✅ | ✅ |
| i18n support | ✅ | ✅ |
| Nested categories | ✅ | ✅ |

If you're migrating from Docusaurus, your pagination configuration will work without changes!
