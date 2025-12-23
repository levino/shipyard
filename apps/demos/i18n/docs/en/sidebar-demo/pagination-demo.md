---
title: Pagination Demo
sidebar_position: 40
---

# Pagination Demo

This page demonstrates the automatic pagination feature in shipyard docs.

## What is Pagination?

Similar to Docusaurus, shipyard automatically adds "Previous" and "Next" navigation buttons at the bottom of each documentation page. These buttons help users navigate through your documentation in the order defined by your sidebar.

## How It Works

1. **Automatic ordering**: Pagination follows the sidebar structure and order
2. **Nested categories**: Works seamlessly across nested documentation categories
3. **Customizable**: You can override the default next/previous pages using frontmatter

## Customizing Pagination

You can customize pagination using frontmatter:

```yaml
---
pagination_next: path/to/next/page.md
pagination_prev: path/to/previous/page.md
---
```

### Disabling Pagination

To disable the next button:
```yaml
---
pagination_next: null
---
```

To disable the previous button:
```yaml
---
pagination_prev: null
---
```

To disable both:
```yaml
---
pagination_next: null
pagination_prev: null
---
```

## Try It Out

Look at the bottom of this page - you should see pagination buttons that let you navigate to the previous and next pages in the documentation.
