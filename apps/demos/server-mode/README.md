# Server Mode Demo

This is a demonstration of **shipyard** working in server-side rendering (SSR) mode.

## Features Demonstrated

- ✅ **Server-side rendering**: Pages are rendered on-demand per request
- ✅ **Blog functionality**: Blog posts with SSR
- ✅ **Documentation**: Documentation pages with SSR
- ✅ **Prerender configuration**: Using `prerender: false` for on-demand rendering

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── src/
│   ├── pages/           # Static pages (index.md, about.md)
│   └── content.config.ts # Content collections configuration
├── blog/               # Blog posts
├── docs/               # Documentation
└── astro.config.mjs    # Astro config with server mode
```

## Key Differences from Static Sites

### Build Output
- **Static mode**: Pre-renders all pages at build time
- **Server mode**: Renders pages on-demand per request

### Configuration
- **Static mode**: `output: 'static'` (default) or no `output` setting
- **Server mode**: `output: 'server'` with an adapter

### Prerender Setting
shipyard packages support a `prerender` option to control per-integration rendering:

```js
shipyardDocs({
  prerender: false, // Disable prerendering for SSR
})

shipyardBlog({
  prerender: false, // Disable prerendering for SSR
})
```

## Use Cases for Server Mode

- Dynamic content that changes frequently
- User authentication and personalized pages
- Database-driven content
- Applications requiring request-time data

## Learn More

Visit the demo site to see these features in action:
- Browse the blog posts to see server-rendered content
- Read the documentation to understand the setup
- Notice how pages are rendered on each request
