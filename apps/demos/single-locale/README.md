# Single-Language Demo

This is a demonstration of **shipyard** working in single-language mode (without internationalization).

## Features Demonstrated

- ✅ **Clean URLs**: No language prefixes like `/en/` or `/de/`
- ✅ **Blog functionality**: English-only blog posts
- ✅ **Documentation**: English-only documentation pages
- ✅ **Simple configuration**: No i18n setup required

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── src/
│   ├── pages/           # Static pages (index.md, about.md)
│   └── content.config.ts # Content collections configuration
├── blog/               # Blog posts (no language directories)
├── docs/               # Documentation (no language directories)
└── astro.config.mjs    # Astro config (no i18n section)
```

## Key Differences from Multi-Language Sites

### URL Structure
- **Single-language**: `/blog`, `/docs`, `/about`
- **Multi-language**: `/en/blog`, `/de/blog`, etc.

### Content Organization
- **Single-language**: Direct in `blog/` and `docs/` directories
- **Multi-language**: Nested in `blog/en/`, `blog/de/`, etc.

### Configuration
- **Single-language**: No `i18n` section in `astro.config.mjs`
- **Multi-language**: Requires full i18n configuration

## Migration Path

This site can be easily upgraded to support multiple languages by:

1. Adding i18n configuration to `astro.config.mjs`
2. Moving content into language subdirectories
3. Updating internal links to include language prefixes

The shipyard framework handles the rest automatically!

## Learn More

Visit the demo site to see these features in action:
- Browse the blog posts to see the content structure
- Read the documentation to understand the setup
- Check the about page to learn about the implementation