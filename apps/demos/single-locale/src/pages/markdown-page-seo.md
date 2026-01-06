---
title: Markdown Page with SEO
description: This page demonstrates SEO frontmatter options for markdown pages
keywords:
  - markdown
  - page
  - seo
  - frontmatter
image: https://picsum.photos/1200/630
canonical_url: https://example.com/canonical-page
wrapperClassName: my-custom-wrapper
custom_meta_tags:
  - name: author
    content: Test Author
  - property: og:locale
    content: en_US
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Markdown Page with SEO Features

This page demonstrates the SEO frontmatter options available for standalone markdown pages.

## Supported Frontmatter

The following frontmatter options are now supported:

- `title` - Page title
- `description` - Meta description for SEO
- `keywords` - Array of keywords for SEO meta tag
- `image` - Social card/preview image (og:image)
- `canonical_url` - Custom canonical URL
- `wrapperClassName` - Custom CSS class for the content wrapper
- `custom_meta_tags` - Array of custom meta tags

## This Page's Configuration

```yaml
title: Markdown Page with SEO
description: This page demonstrates SEO frontmatter options for markdown pages
keywords:
  - markdown
  - page
  - seo
  - frontmatter
image: https://picsum.photos/1200/630
canonical_url: https://example.com/canonical-page
wrapperClassName: my-custom-wrapper
custom_meta_tags:
  - name: author
    content: Test Author
  - property: og:locale
    content: en_US
```

## Verification

Inspect the `<head>` section of this page to see:
- Keywords meta tag
- og:image meta tag
- Canonical link tag
- Custom author and og:locale meta tags
