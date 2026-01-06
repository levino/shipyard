---
title: Content Management Made Simple
description: How to organize and manage content in single-language shipyard sites
date: 2024-09-03
tags:
  - content
  - tutorial
authors:
  - name: Levin Keller
    title: Creator of shipyard
    url: https://github.com/levino
---

# Content Management Made Simple

One of the biggest advantages of single-language sites is **simplified content management**. Let's explore how this works in practice.

## File Organization

With single-language sites, your content structure is straightforward:

```
blog/
├── 2024-09-01-getting-started.md
├── 2024-09-03-content-management.md
└── 2024-09-05-advanced-features.md

docs/
├── index.md
├── installation.md
└── configuration.md
```

No language directories like `blog/en/` or `blog/de/` to manage!

## Writing Content

### Blog Posts

Every blog post needs frontmatter with these fields:

- `title`: The post title
- `description`: SEO description  
- `pubDate`: Publication date
- `author`: Post author
- `tags`: Array of tags for categorization

### Documentation

Docs are even simpler - just title and description:

```yaml
---
title: Your Doc Title
description: What this documentation covers
---
```

## Benefits

This approach offers several advantages:

1. **Faster authoring**: No need to think about language codes
2. **Easier collaboration**: Contributors don't need to understand i18n structure
3. **Simpler deployment**: One content version, one build
4. **Better performance**: No language switching logic needed

## Migration Path

If you later need multilingual support, shipyard makes it easy to migrate:

1. Add i18n configuration to `astro.config.mjs`
2. Move content into language directories
3. Update internal links to include language prefixes

The framework handles the rest automatically!

## Best Practices

- Use descriptive filenames with dates for blog posts
- Keep documentation hierarchical and logical
- Use tags consistently across blog posts
- Write clear descriptions for better SEO

Ready to start writing? The tools are all here! ✨