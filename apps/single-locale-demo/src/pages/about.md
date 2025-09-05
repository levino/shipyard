---
title: About Single Language Demo  
description: Learn about this single-language Shipyard demonstration
layout: '@levino/shipyard-base/layouts/Page.astro'
---

# About This Demo

This is a **single-language demonstration** of the Shipyard framework, showing how it works without internationalization (i18n) configuration.

## Key Differences from Multi-Language Sites

### URL Structure
- **Single language**: `/blog`, `/docs`, `/about`
- **Multi-language**: `/en/blog`, `/de/blog`, `/en/docs`, etc.

### Configuration
- No `i18n` section in `astro.config.mjs`
- No locale-based routing
- Simpler content organization

### Content Organization
- Blog posts directly in `/blog/` directory
- Documentation directly in `/docs/` directory  
- No language subdirectories needed

## Use Cases

This approach is perfect for:
- **Corporate websites** serving a single market
- **Personal blogs** in one language
- **Product documentation** for English-only products
- **Prototypes** where i18n isn't needed yet

## Technical Implementation

The restored non-i18n support works by:
1. Making i18n optional in Shipyard configuration
2. Conditionally injecting routes based on i18n presence
3. Handling both i18n and non-i18n content structures
4. Maintaining backward compatibility

You can switch to multi-language support later by adding i18n configuration to your `astro.config.mjs` file.