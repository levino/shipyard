---
title: Custom Slug Example
sidebar_position: 70
description: Demonstration of using a custom URL slug for documentation pages
slug: my-custom-url
pagination_label: Custom URL Slug
---

# Custom Slug Example

This page demonstrates the `slug` frontmatter option which allows you to customize the URL for a documentation page.

## How It Works

By default, shipyard generates URLs based on the file path. For example, a file at `docs/getting-started/installation.md` would be available at `/docs/getting-started/installation`.

With the `slug` frontmatter option, you can override this behavior and specify a custom URL.

## Usage

Add the `slug` property to your frontmatter:

```md
---
title: My Page Title
slug: my-custom-url
---
```

## This Page's Configuration

This page is located at `docs/custom-slug-example.md` but is accessible at `/docs/my-custom-url` because it uses:

```yaml
slug: my-custom-url
```

## Use Cases

Custom slugs are useful when:

- You want shorter, cleaner URLs
- You're migrating from another documentation system and need to preserve old URLs
- You want URLs that differ from your file organization
- You need SEO-friendly URLs that don't match your file naming conventions

## Notes

- The slug should be a valid URL path segment
- Don't include leading slashes - the base path is added automatically
- The sidebar will link to the custom URL
- Pagination will also use the custom URL
