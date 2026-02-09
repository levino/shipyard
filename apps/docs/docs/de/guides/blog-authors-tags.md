---
title: Blog Authors & Tags
sidebar:
  position: 6
description: Configure blog authors and tags with dedicated pages and feeds
---

# Blog Authors & Tags

shipyard's blog package supports authors and tags with auto-generated pages for each.

---

## Authors

### Inline Authors

Define authors directly in blog post frontmatter:

```yaml
---
title: My Post
description: A blog post
date: 2026-01-15
authors:
  - name: Jane Doe
    title: Lead Developer
    url: https://janedoe.dev
    image_url: https://example.com/jane.jpg
---
```

### Authors File

For shared author data, you can create an `authors.yml` file in your blog directory:

```yaml
# blog/authors.yml
jane:
  name: Jane Doe
  title: Lead Developer
  url: https://janedoe.dev
  image_url: https://example.com/jane.jpg
  email: jane@example.com

john:
  name: John Smith
  title: Technical Writer
  url: https://johnsmith.io
  image_url: https://example.com/john.jpg
```

> **Hinweis:** String-Autoren-Referenzen (z.B. `authors: jane`) werden derzeit nicht aus `authors.yml` aufgelöst. Diese Funktion ist geplant, aber noch nicht implementiert. Verwenden Sie vorerst Inline-Autorenobjekte im Frontmatter wie oben gezeigt, oder einfache Strings, die nur als Namen angezeigt werden.

Then reference authors by key in frontmatter:

```yaml
---
title: My Post
description: A blog post
date: 2026-01-15
authors: jane
---
```

For multiple authors:

```yaml
---
authors:
  - jane
  - john
---
```

### Author Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Author's display name |
| `title` | `string` | No | Author's role or title |
| `url` | `string` | No | Author's website URL |
| `image_url` | `string` | No | Author's avatar image |
| `email` | `string` | No | Author's email address |

### Author Pages

When authors are configured, shipyard auto-generates:

- `/blog/authors` — Index of all authors
- `/blog/authors/[author]` — Posts filtered by author

---

## Tags

### Using Tags

Add tags to blog post frontmatter:

```yaml
---
title: TypeScript Tips
description: Useful TypeScript patterns
date: 2026-01-15
tags:
  - typescript
  - best-practices
---
```

### Tags File

For custom tag labels, descriptions, and permalinks, create a `tags.yml` file and configure it in your Astro config:

```yaml
# blog/tags.yml
typescript:
  label: TypeScript
  description: Posts about TypeScript programming
  permalink: /typescript

best-practices:
  label: Best Practices
  description: Recommended patterns and approaches
```

Then configure the path in `astro.config.mjs`:

```js
shipyardBlog({
  tagsMapPath: './blog/tags.yml',
  // ... other options
})
```

**Hinweis:** Die `tags.yml`-Datei wird nicht automatisch erkannt. Sie müssen `tagsMapPath` in Ihrer Konfiguration angeben, damit Tag-Metadaten geladen werden.

### Tag Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | `string` | No | Display name (defaults to tag key) |
| `description` | `string` | No | Tag description shown on tag page |
| `permalink` | `string` | No | Custom URL path for tag page |

### Tag Pages

shipyard auto-generates:

- `/blog/tags` — Index of all tags with post counts
- `/blog/tags/[tag]` — Posts filtered by tag

---

## Feeds

Blog feeds are automatically generated and include author and tag metadata:

| Feed | URL |
|------|-----|
| RSS 2.0 | `/blog/rss.xml` |
| Atom | `/blog/atom.xml` |
| JSON Feed | `/blog/feed.json` |

---

## Archive

The blog archive groups posts by year:

- `/blog/archive` — Chronological listing of all posts grouped by year

The archive is generated automatically and requires no configuration.
