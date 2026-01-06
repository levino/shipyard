---
title: Hidden Title Example
description: This page demonstrates the hide_title frontmatter option
sidebar_position: 61
hide_title: true
---

# This Title Is Hidden

If you can see this heading, the `hide_title` feature is NOT working correctly.

## About hide_title

The `hide_title: true` frontmatter option hides the first H1 heading on the page. This is useful when:

- You want to use a custom title component
- The content already includes decorative elements that serve as the title
- You want more control over the page layout

## Usage

Add this to your frontmatter:

```yaml
hide_title: true
```

The title will still appear in:
- The browser tab (via the `<title>` tag)
- The sidebar navigation
- SEO meta tags

But it will not be visible on the page itself.
