---
title: Configuration
---

# Configuration

Shipyard is highly configurable and can be customized to fit your project's needs.

## Basic Configuration

The main configuration happens in your `astro.config.mjs` file when you initialize the Shipyard integration:

```javascript
shipyard({
  navigation: {
    docs: { label: 'Documentation', href: '/docs' },
    blog: { label: 'Blog', href: '/blog' },
    about: { label: 'About', href: '/about' },
  },
  title: 'My Website',
  tagline: 'A description of my website',
  brand: 'My Brand',
})
```

## Configuration Options

### Required Fields

- **`title`**: The main title of your website
- **`brand`**: Your brand name (displayed in navigation)
- **`tagline`**: A short description of your website
- **`navigation`**: Navigation menu structure

### Navigation Configuration

The navigation object defines your site's menu structure. Each key creates a navigation item:

```javascript
navigation: {
  docs: {
    label: 'Documentation',  // Text displayed in menu
    href: '/docs',           // Link destination
  },
  blog: {
    label: 'Blog',
    href: '/blog',
  },
  // Nested navigation example
  resources: {
    label: 'Resources',
    subEntry: {
      guides: { label: 'Guides', href: '/guides' },
      examples: { label: 'Examples', href: '/examples' },
    }
  }
}
```

## Package-Specific Configuration

### Docs Package

The `shipyardDocs` integration accepts an array of content directories:

```javascript
shipyardDocs(['docs', 'guides'])
```

This tells Shipyard to look for documentation content in the `docs/` and `guides/` directories.

### Blog Package

Similarly, the `shipyardBlog` integration configures blog directories:

```javascript
shipyardBlog(['blog', 'news'])
```

## Content Structure

Your content should be organized by locale:

```
src/
  content/
    docs/
      en/
        index.md
        getting-started.md
      de/
        index.md
        getting-started.md
    blog/
      en/
        2024-01-01-welcome.md
      de/
        2024-01-01-willkommen.md
```

## Styling

Shipyard uses Tailwind CSS and DaisyUI for styling. Make sure to disable Astro's base styles:

```javascript
tailwind({
  applyBaseStyles: false,
})
```

This prevents conflicts with Shipyard's built-in styles.