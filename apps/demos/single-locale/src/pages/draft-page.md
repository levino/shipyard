---
title: Draft Page Example
description: This page demonstrates the draft feature for markdown pages
draft: true
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Draft Page

This page is marked as a draft. It will:

- **Show in development**: You can see and work on this page during development
- **Return 404 in production**: This page won't be accessible when the site is built

## Use Cases

Draft pages are useful for:

- Work-in-progress content
- Pages that need review before publishing
- Content scheduled for future release

## Frontmatter

```yaml
draft: true
```

Simply add `draft: true` to your page's frontmatter to mark it as a draft.
