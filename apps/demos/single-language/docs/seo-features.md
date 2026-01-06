---
title: SEO Features Demo
title_meta: "SEO Frontmatter Features | shipyard Documentation"
description: Demonstrating SEO frontmatter features including keywords and social images
sidebar_position: 60
keywords:
  - SEO
  - meta tags
  - keywords
  - social sharing
  - open graph
image: https://picsum.photos/1200/630
---

# SEO Features Demo

This page demonstrates the SEO features available in shipyard through frontmatter.

## Title Meta Override

This page uses `title_meta` to provide a custom title for SEO and the browser tab:

```yaml
title_meta: "SEO Frontmatter Features | shipyard Documentation"
```

The `title_meta` value is used in the `<title>` tag and meta tags, while the regular `title` is displayed in the sidebar.

## Keywords Support

This page includes keywords in its frontmatter:

```yaml
keywords:
  - SEO
  - meta tags
  - keywords
  - social sharing
  - open graph
```

These keywords are rendered as a `<meta name="keywords">` tag in the HTML head.

## Social Card Image

This page also specifies a social card image:

```yaml
image: https://picsum.photos/1200/630
```

This generates the following meta tags:
- `<meta property="og:image">`
- `<meta name="twitter:card" content="summary_large_image">`
- `<meta name="twitter:image">`

## Checking the Meta Tags

You can view the generated meta tags by:

1. Opening the browser's Developer Tools (F12)
2. Going to the Elements tab
3. Looking inside the `<head>` element

You should see the keywords and image meta tags.
