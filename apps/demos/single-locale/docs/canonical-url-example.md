---
title: Canonical URL Example
sidebar:
  position: 75
description: Demonstration of using custom canonical URLs for SEO
canonical_url: https://example.com/the-canonical-version
pagination_label: Canonical URL
---

# Canonical URL Example

This page demonstrates the `canonical_url` frontmatter option which allows you to specify a custom canonical URL for SEO purposes.

## What is a Canonical URL?

A canonical URL tells search engines which URL is the "official" version of a page when the same or similar content exists at multiple URLs. This helps prevent duplicate content issues and consolidates link equity.

## Usage

Add the `canonical_url` property to your frontmatter:

```md
---
title: My Page Title
canonical_url: https://example.com/the-canonical-version
---
```

## This Page's Configuration

This page uses:

```yaml
canonical_url: https://example.com/the-canonical-version
```

This generates the following HTML in the `<head>`:

```html
<link rel="canonical" href="https://example.com/the-canonical-version" />
```

## Use Cases

Canonical URLs are useful when:

- You have similar content accessible at multiple URLs
- You're migrating content from another site and want to point to the original
- You have both www and non-www versions of your site
- You have HTTP and HTTPS versions of the same content
- You're syndicating content that originally appeared elsewhere

## Notes

- The canonical URL should be a full, absolute URL including the protocol
- This does not redirect users - it only signals to search engines
- Only use canonical URLs when content is genuinely duplicated or very similar
