# Versioned Docs Demo

This demo showcases shipyard's documentation versioning feature.

## Features

- Multiple documentation versions (v1, v2)
- Version selector in navigation
- Deprecation banners for old versions
- Clean versioned URLs

## Development

```bash
# Install dependencies (from repo root)
npm run setup

# Run dev server
cd apps/demos/versioned-docs
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Run E2E tests
npm run test:e2e
```

## Configuration

See `astro.config.mjs` for the version configuration example.

## URL Structure

- `/` - Home page
- `/about` - About page
- `/docs/v2/index` - v2 docs index
- `/docs/v2/installation` - v2 installation guide
- `/docs/v1/index` - v1 docs index (deprecated)
