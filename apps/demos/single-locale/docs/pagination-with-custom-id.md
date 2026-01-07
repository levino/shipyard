---
title: Pagination with Custom ID
sidebar:
  position: 88
description: Demonstration of referencing a page by its custom ID in pagination
pagination_next: my-custom-doc-id
pagination_prev: null
---

# Pagination with Custom ID

This page demonstrates using a custom document ID for pagination navigation.

## Configuration

This page's frontmatter uses `pagination_next` with a custom ID:

```yaml
pagination_next: my-custom-doc-id
```

The "Next" link below should point to the "Custom Document ID Example" page, which has `id: my-custom-doc-id` in its frontmatter.

## How It Works

1. Define a custom `id` in a document's frontmatter
2. Reference that ID in `pagination_next` or `pagination_prev` of another document
3. The pagination system will look up the document by its custom ID

## Benefits

- **Decoupled from file paths** - Change file names without breaking pagination
- **Semantic references** - Use meaningful IDs instead of file paths
- **Docusaurus compatibility** - Works the same way as in Docusaurus

---

Check the "Next" link below - it should point to the "Custom Document ID Example" page!
