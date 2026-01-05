---
title: Custom Meta Tags Example
sidebar_position: 85
description: Demonstration of using custom meta tags for SEO and social sharing
custom_meta_tags:
  - name: robots
    content: noindex, nofollow
  - name: author
    content: Shipyard Team
  - property: og:locale
    content: en_US
  - property: article:author
    content: https://github.com/levino
pagination_label: Custom Meta Tags
---

# Custom Meta Tags Example

This page demonstrates the `custom_meta_tags` frontmatter option which allows you to add arbitrary meta tags to the page head.

## How It Works

The `custom_meta_tags` field accepts an array of meta tag objects. Each object can have:

- `name` - For standard meta tags like `robots`, `author`, etc.
- `property` - For Open Graph and other property-based tags
- `content` - The value of the meta tag (required)

## Usage

Add the `custom_meta_tags` property to your frontmatter:

```md
---
title: My Page
custom_meta_tags:
  - name: robots
    content: noindex, nofollow
  - name: author
    content: John Doe
  - property: og:locale
    content: en_US
---
```

## This Page's Configuration

This page uses:

```yaml
custom_meta_tags:
  - name: robots
    content: noindex, nofollow
  - name: author
    content: Shipyard Team
  - property: og:locale
    content: en_US
  - property: article:author
    content: https://github.com/levino
```

## Resulting HTML

The above configuration generates these meta tags in the `<head>`:

```html
<meta name="robots" content="noindex, nofollow">
<meta name="author" content="Shipyard Team">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="https://github.com/levino">
```

## Use Cases

Custom meta tags are useful for:

- **SEO control** - Set `robots` directives for specific pages
- **Author attribution** - Add author information
- **Social media** - Additional Open Graph or Twitter card properties
- **Verification** - Site verification tags for various services
- **Localization** - Specify `og:locale` for regional content
- **Article metadata** - Publication dates, modified times, etc.

## Notes

- Each tag object must have a `content` value
- Use `name` for standard meta tags
- Use `property` for Open Graph and similar property-based tags
- Custom meta tags are added after the default tags (description, keywords, etc.)
