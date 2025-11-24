---
title: Content Management Made Simple
description: Learn about content organization in single-language Shipyard sites
date: 2024-09-03
tags: [content, organization, tips]
---

Managing content in a single-language site is refreshingly simple. Let's explore how to organize your content effectively.

<!-- truncate -->

## Directory Structure

Your content lives in straightforward directories:

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

No language subdirectories needed!

## Blog Posts

Each blog post includes frontmatter:

```yaml
---
title: Your Post Title
description: A brief description
date: 2024-09-03
tags: [tag1, tag2]
---
```

## Documentation

Documentation pages can be nested in categories:

```
docs/
├── getting-started/
│   ├── index.md
│   └── quick-start.md
├── guides/
│   ├── index.md
│   └── configuration.md
└── index.md
```

## Benefits of Simplicity

- **Less cognitive load**: Focus on content, not structure
- **Faster publishing**: Write and deploy immediately
- **Easier maintenance**: Less directories to manage
- **Clean URLs**: Direct access to your content

Keep it simple and focus on what matters - your content!
