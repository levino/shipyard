---
title: Basic Versioning
sidebar_position: 1
description: Minimal setup for versioned documentation
---

# Basic Versioning Example

A minimal configuration for versioned documentation with two versions.

## What You'll Get

- Two versions: v1 (deprecated) and v2 (current)
- Version selector in navbar and sidebar
- Deprecation warning banner on v1 pages
- `/latest/` alias for v2

## Files to Create/Modify

### 1. astro.config.mjs

```javascript
import { defineConfig } from 'astro/config'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',
        available: [
          { version: 'v2', label: 'Version 2.0 (Latest)' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',
      },
    }),
  ],
})
```

### 2. src/content.config.ts

```typescript
import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2'],
    fallbackVersion: 'v2',
  }),
)

export const collections = { docs }
```

### 3. Directory Structure

```
your-project/
├── astro.config.mjs
├── src/
│   └── content.config.ts
└── docs/
    ├── v2/
    │   ├── index.md
    │   ├── installation.md
    │   └── configuration.md
    └── v1/
        ├── index.md
        └── installation.md
```

### 4. Sample Content Files

**docs/v2/index.md**
```markdown
---
title: Welcome
sidebar_position: 1
---

# Welcome to Version 2.0

This is the latest version of the documentation.

## What's New in v2

- New feature A
- Improved feature B
- Bug fixes

## Getting Started

See [Installation](./installation) to get started.
```

**docs/v2/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Requirements

- Node.js 18+
- npm or yarn

## Install

\`\`\`bash
npm install your-package@latest
\`\`\`
```

**docs/v2/configuration.md**
```markdown
---
title: Configuration
sidebar_position: 3
---

# Configuration

## Basic Setup

Create a config file:

\`\`\`javascript
export default {
  option1: true,
  option2: 'value',
}
\`\`\`
```

**docs/v1/index.md**
```markdown
---
title: Welcome
sidebar_position: 1
---

# Welcome to Version 1.0

This documentation covers version 1.0.

## Getting Started

See [Installation](./installation) to get started.
```

**docs/v1/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Requirements

- Node.js 16+
- npm or yarn

## Install

\`\`\`bash
npm install your-package@1.0
\`\`\`
```

## URLs Generated

After building, you'll have:

| URL | Content |
|-----|---------|
| `/docs/` | Redirects to `/docs/v2/` |
| `/docs/v2/` | v2 welcome page |
| `/docs/v2/installation` | v2 installation guide |
| `/docs/v2/configuration` | v2 configuration guide |
| `/docs/v1/` | v1 welcome page (deprecated banner shown) |
| `/docs/v1/installation` | v1 installation guide |
| `/docs/latest/` | Alias for `/docs/v2/` |
| `/docs/latest/installation` | Alias for `/docs/v2/installation` |

## Next Steps

- Add more versions by creating new version directories and updating the configuration
- See [Documentation Versioning Guide](../guides/versioning) for advanced configuration options
- See [Migrating to Versioned Docs](../guides/migration-to-versioned) if you have existing documentation

