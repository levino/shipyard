---
title: Configuration
---

# Station Configuration

Shipyard is highly configurable and can be customized to fit your mission requirements.

## Core Systems Configuration

The primary configuration occurs in your `astro.config.mjs` file when you initialize the Shipyard platform:

```javascript
shipyard({
  navigation: {
    docs: { label: 'Command Center', href: '/docs' },
    blog: { label: 'Mission Logs', href: '/blog' },
    about: { label: 'Station Info', href: '/about' },
  },
  title: 'My Space Station',
  tagline: 'A description of my orbital facility',
  brand: 'My Station Brand',
})
```

## Configuration Options

### Required Fields

- **`title`**: The main designation of your station
- **`brand`**: Your facility's call sign (displayed in navigation)
- **`tagline`**: A brief description of your orbital operations
- **`navigation`**: Command interface structure

### Navigation Configuration

The navigation object defines your station's interface structure. Each key creates a command interface item:

```javascript
navigation: {
  docs: {
    label: 'Command Center',     // Text displayed in interface
    href: '/docs',               // Navigation destination
  },
  blog: {
    label: 'Mission Logs',
    href: '/blog',
  },
  // Nested navigation example
  resources: {
    label: 'Operations',
    subEntry: {
      guides: { label: 'Protocols', href: '/guides' },
      examples: { label: 'Missions', href: '/examples' },
    }
  }
}
```

## Package-Specific Configuration

### Command Center Module

The `shipyardDocs` integration accepts an array of content directories:

```javascript
shipyardDocs(['docs', 'guides'])
```

This configures Shipyard to monitor command center content in the `docs/` and `guides/` directories.

### Mission Log Module

Similarly, the `shipyardBlog` integration configures mission log directories:

```javascript
shipyardBlog(['blog', 'news'])
```

## Internationalization

Shipyard supports both single-sector and multi-sector communication protocols.

### Single-Sector Operations

To create a single-sector station, simply omit the `i18n` configuration from your `astro.config.mjs`:

```javascript
export default defineConfig({
  // No i18n config needed for single-sector operations
  integrations: [
    shipyard({
      title: 'My Station Alpha',
      tagline: 'Constructed with Shipyard',
      navigation: {
        docs: { label: 'Command Center', href: '/docs' },
        blog: { label: 'Mission Logs', href: '/blog' },
      },
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

Your URLs will be clean without language prefixes:
- `/` - Station Hub
- `/docs/` - Command Center index  
- `/docs/getting-started/` - Command Center protocols
- `/blog/` - Mission Logs index
- `/blog/welcome/` - Mission Log entries

### Multi-Sector Operations

For universal communication across sectors, configure Astro's i18n options:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: false, // Optional: removes /en/ prefix for primary sector
    },
  },
  integrations: [
    shipyard({
      title: 'My Multi-Sector Station',
      // ... rest of config
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
});
```

URLs will include sector prefixes:
- `/` and `/en/` - Primary sector hub
- `/de/` - German sector hub  
- `/en/docs/`, `/de/docs/` - Sector-specific command centers
- `/en/blog/`, `/de/blog/` - Sector-specific mission logs

## Content Structure

### Multi-Sector Operations (with i18n)

For stations with universal communication, organize your content by sector:

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

### Single-Sector Operations (without i18n)

For single-sector stations, you can organize content directly without sector folders:

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

Shipyard allows you to inject external systems into your station's interface, similar to Docusaurus. This is useful for adding analytics, communication widgets, CDN libraries, or any third-party systems.

### Basic Usage

External systems are configured in your `shipyard()` configuration using the `scripts` array:

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

For simple system integration without special attributes:

```javascript
scripts: [
  'https://example.com/script.js',
  'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
]
```

#### Object Format

For systems that need special attributes or loading behavior:

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

- **Station-wide integration**: Systems are integrated into every interface of your station
- **Load sequence**: Systems are loaded in the order they appear in the configuration
- **Performance**: Use `async` or `defer` attributes to avoid blocking interface rendering
- **Security**: Consider using `integrity` attributes for third-party CDN systems
- **Build-time integration**: Systems are integrated during construction, not at runtime

### Security Considerations

When integrating external systems:

1. **Use trusted sources**: Only integrate systems from reputable CDNs and services
2. **Subresource Integrity**: Use `integrity` hashes when possible:
   ```javascript
   {
     src: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
     integrity: 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=',
     crossorigin: 'anonymous',
   }
   ```
3. **Content Security Policy**: Configure CSP headers if using strict security policies