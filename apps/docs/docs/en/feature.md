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

## Internationalization

Shipyard supports both single-language and multi-language websites. Internationalization (i18n) is now **optional** as of version 0.x.

### Single-Language Sites

To create a single-language site, simply omit the `i18n` configuration from your `astro.config.mjs`:

```javascript
export default defineConfig({
  // No i18n config needed for single-language sites
  integrations: [
    shipyard({
      title: 'My Single-Language Site',
      tagline: 'Built with Shipyard',
      navigation: {
        docs: { label: 'Docs', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

Your URLs will be clean without language prefixes:
- `/` - Homepage
- `/docs/` - Documentation index  
- `/docs/getting-started/` - Documentation pages
- `/blog/` - Blog index
- `/blog/welcome/` - Blog posts

### Multi-Language Sites

For internationalization, configure Astro's i18n options:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: false, // Optional: removes /en/ prefix for default locale
    },
  },
  integrations: [
    shipyard({
      title: 'My Multi-Language Site',
      // ... rest of config
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

URLs will include language prefixes:
- `/` and `/en/` - English homepage
- `/de/` - German homepage  
- `/en/docs/`, `/de/docs/` - Localized documentation
- `/en/blog/`, `/de/blog/` - Localized blog

## Content Structure

### Multi-Language Sites (with i18n)

For sites with internationalization, organize your content by locale:

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

### Single-Language Sites (without i18n)

For single-language sites, you can organize content directly without locale folders:

```
src/
  content/
    docs/
      index.md
      getting-started.md
    blog/
      2024-01-01-welcome.md
      2024-02-01-another-post.md
```

Or in separate collections:

```
docs/
  index.md
  getting-started.md
blog/
  2024-01-01-welcome.md
  2024-02-01-another-post.md
```

## Styling

Shipyard uses Tailwind CSS and DaisyUI for styling. Make sure to disable Astro's base styles:

```javascript
tailwind({
  applyBaseStyles: false,
})
```

This prevents conflicts with Shipyard's built-in styles.

## Script Injection

Shipyard allows you to inject external scripts into your site's HTML head, similar to Docusaurus. This is useful for adding analytics, chat widgets, CDN libraries, or any third-party scripts.

### Basic Usage

Scripts are configured in your `shipyard()` configuration using the `scripts` array:

```javascript
shipyard({
  // ... other configuration
  scripts: [
    // Simple string format
    'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
    
    // Object format with attributes
    {
      src: 'https://cdn.jsdelivr.net/npm/pocketbase@0.21.5/dist/pocketbase.umd.js',
      async: true,
    },
  ],
})
```

### Configuration Formats

#### String Format

For simple script injection without special attributes:

```javascript
scripts: [
  'https://example.com/script.js',
  'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
]
```

#### Object Format

For scripts that need special attributes or loading behavior:

```javascript
scripts: [
  {
    src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
    async: true,
  },
  {
    src: 'https://cdn.skypack.dev/lodash-es',
    defer: true,
    type: 'module',
  },
  {
    src: 'https://cdn.example.com/secure-script.js',
    integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    crossorigin: 'anonymous',
  },
]
```

### Supported Attributes

All standard HTML script attributes are supported:

- **`src`** (required): The URL of the script
- **`async`**: Load script asynchronously without blocking HTML parsing
- **`defer`**: Load script after HTML parsing is complete
- **`type`**: Script MIME type (e.g., `'module'`, `'text/javascript'`)
- **`crossorigin`**: CORS setting (`'anonymous'`, `'use-credentials'`)
- **`integrity`**: Subresource Integrity hash for security
- **`referrerpolicy`**: Referrer policy for the request

You can also use any other valid HTML attributes:

```javascript
{
  src: 'https://example.com/script.js',
  'data-domain': 'yourdomain.com',
  'data-api': '/api/event',
}
```

### Loading Strategies

#### Async Loading
Best for scripts that don't depend on DOM content and can run independently:

```javascript
{
  src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
  async: true,
}
```

#### Deferred Loading
Best for scripts that need the DOM to be fully parsed:

```javascript
{
  src: 'https://example.com/dom-dependent-script.js',
  defer: true,
}
```

#### ES Modules
For modern JavaScript modules:

```javascript
{
  src: 'https://cdn.skypack.dev/lodash-es',
  type: 'module',
  defer: true,
}
```

### Common Use Cases

#### Analytics
```javascript
scripts: [
  {
    src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
    async: true,
  },
]
```

#### CDN Libraries
```javascript
scripts: [
  'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
]
```

#### Chat Widgets
```javascript
scripts: [
  {
    src: 'https://widget.intercom.io/widget/your-app-id',
    async: true,
  },
]
```

### Important Notes

- **Global injection**: Scripts are injected into every page of your site
- **Load order**: Scripts are loaded in the order they appear in the configuration
- **Performance**: Use `async` or `defer` attributes to avoid blocking page rendering
- **Security**: Consider using `integrity` attributes for third-party CDN scripts
- **Server-side rendering**: Scripts are injected during build time, not at runtime

### Security Considerations

When adding external scripts:

1. **Use trusted sources**: Only include scripts from reputable CDNs and services
2. **Subresource Integrity**: Use `integrity` hashes when possible:
   ```javascript
   {
     src: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
     integrity: 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
     crossorigin: 'anonymous',
   }
   ```
3. **Content Security Policy**: Configure CSP headers if using strict security policies