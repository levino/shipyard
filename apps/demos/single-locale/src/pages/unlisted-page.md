---
title: Unlisted Page Example
description: This page demonstrates the unlisted feature for markdown pages
unlisted: true
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Unlisted Page

This page is marked as unlisted. It will:

- **Be accessible**: You can visit this page directly via its URL
- **Not appear in navigation**: This page won't show in sidebars or menus
- **Not be indexed**: Search engines are instructed not to index this page

## Use Cases

Unlisted pages are useful for:

- Internal-only pages shared via direct link
- Landing pages for specific campaigns
- Pages that should be accessible but not discoverable
- Preview links for review before officially publishing

## Frontmatter

```yaml
unlisted: true
```

Simply add `unlisted: true` to your page's frontmatter to mark it as unlisted.

## Behavior

Unlike draft pages (which return 404 in production), unlisted pages are always accessible. They just include a `<meta name="robots" content="noindex, nofollow">` tag to prevent search engine indexing.
