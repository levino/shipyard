---
title: Documentation Overview
description: Complete guide to using Shipyard in single-language mode
slug: '/'
---

# Documentation Overview

Welcome to the **Single-Language Shipyard Documentation**! This guide covers everything you need to know about building single-language sites with Shipyard.

## Quick Start

Get up and running in minutes:

1. **Installation**: Set up your development environment
2. **Configuration**: Configure Shipyard without i18n
3. **Content Creation**: Add pages, blog posts, and documentation
4. **Deployment**: Deploy your site to production

## Key Concepts

### Single-Language Architecture

Unlike multi-language sites that use URLs like `/en/page` or `/de/page`, single-language sites use clean URLs:

- ✅ `/blog` (single-language)
- ❌ `/en/blog` (multi-language)

This makes URLs simpler and more memorable for your users.

### Content Organization

```
src/
├── pages/           # Static pages
├── content.config.ts # Content collections config
blog/               # Blog posts (no language subdirectories)
├── post-1.md
└── post-2.md
docs/               # Documentation (no language subdirectories)  
├── index.md
├── installation.md
└── configuration.md
```

## Main Features

- **📝 Blog System**: Full-featured blog with tags, categories, and RSS
- **📚 Documentation**: Structured docs with automatic navigation  
- **🎨 Theming**: Customizable themes with Tailwind CSS
- **⚡ Performance**: Fast static site generation
- **🔧 Configuration**: Simple, intuitive configuration

## Getting Help

- **Examples**: Check the [blog examples](/blog) to see features in action
- **Configuration**: See [configuration guide](/docs/configuration) for setup details
- **Installation**: Follow the [installation guide](/docs/installation) to get started

Ready to dive in? Start with our [installation guide](/docs/installation)!
