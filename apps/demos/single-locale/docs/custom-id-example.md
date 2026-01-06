---
title: Custom Document ID Example
id: my-custom-doc-id
sidebar:
  position: 87
description: Demonstration of using a custom document ID for referencing in pagination
pagination_label: Custom ID Demo
---

# Custom Document ID Example

This page demonstrates the `id` frontmatter option which allows you to define a custom document ID for referencing.

## How It Works

The `id` field is used for:
- Referencing this document in `pagination_next` and `pagination_prev` fields
- Internal document lookups
- Sidebar configuration references

## Usage

Add the `id` property to your frontmatter:

```md
---
title: My Page
id: my-custom-id
---
```

Then you can reference this document by ID in other pages:

```md
---
pagination_next: my-custom-id
---
```

## This Page's Configuration

This page uses:

```yaml
id: my-custom-doc-id
```

## Default Behavior

When `id` is not specified:
- The document ID defaults to the file path (e.g., `docs/getting-started.md` becomes `docs/getting-started.md`)
- This is the same behavior as Docusaurus

## Use Cases

Custom document IDs are useful for:
- **Stable references** - Keep the same ID even if you rename files
- **Shorter IDs** - Use concise IDs instead of long file paths
- **Semantic naming** - Use meaningful IDs that describe the content

## Notes

- The custom ID is used for internal referencing only
- The URL slug is determined by the `slug` frontmatter, not the `id`
- File structure still determines the sidebar hierarchy
