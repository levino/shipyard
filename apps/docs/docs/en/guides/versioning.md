---
title: Documentation Versioning
sidebar_position: 1
description: Learn how to create versioned documentation with shipyard
---

# Documentation Versioning

shipyard supports versioned documentation, allowing you to maintain multiple versions of your docs alongside your software releases. This is useful when you need to provide documentation for different versions of your product or API.

## Overview

With versioned docs, users can:
- Switch between different versions using a version selector
- Access documentation for older releases
- See deprecation warnings on outdated versions
- Use a `/latest/` alias that always points to the current version

## Quick Start

### 1. Configure Version Settings

Update your `astro.config.mjs` to add version configuration:

```javascript
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

### 2. Set Up Content Collection

Update your `src/content.config.ts` to use the versioned collection helper:

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

### 3. Organize Content by Version

Structure your docs directory with version subdirectories:

```
docs/
├── v2/
│   ├── index.md
│   ├── installation.md
│   └── configuration.md
└── v1/
    ├── index.md
    └── installation.md
```

That's it! Your versioned documentation is now available at `/docs/v2/`, `/docs/v1/`, and `/docs/latest/`.

---

## Configuration Reference

### Version Config Options

The `versions` option in `shipyardDocs()` accepts the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `current` | `string` | Yes | The default version shown when users visit `/docs/` |
| `available` | `SingleVersionConfig[]` | Yes | Array of all available versions |
| `deprecated` | `string[]` | No | Version identifiers to mark as deprecated |
| `stable` | `string` | No | The stable release version (defaults to `current`) |

### SingleVersionConfig Options

Each entry in the `available` array can have:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `version` | `string` | Yes | The version identifier (e.g., `"v2"`, `"1.0.0"`) |
| `label` | `string` | No | Human-readable label for the UI (defaults to `version`) |
| `path` | `string` | No | URL path segment (defaults to `version`) |
| `banner` | `'unreleased' \| 'unmaintained'` | No | Banner to display for this version |

### Example Configuration

```javascript
shipyardDocs({
  versions: {
    // The default version for /docs/
    current: 'v2',

    // All available versions (order matters for UI display)
    available: [
      {
        version: 'v3-beta',
        label: 'Version 3.0 (Beta)',
        banner: 'unreleased',
      },
      {
        version: 'v2',
        label: 'Version 2.0 (Latest)',
      },
      {
        version: 'v1',
        label: 'Version 1.x',
        banner: 'unmaintained',
      },
    ],

    // Versions that show deprecation warnings
    deprecated: ['v1'],

    // The stable release
    stable: 'v2',
  },
})
```

---

## Directory Structure

### Basic Structure

For versioned docs without i18n:

```
docs/
├── v2/                    # Current/latest version
│   ├── index.md
│   ├── getting-started.md
│   └── advanced/
│       └── configuration.md
└── v1/                    # Previous version
    ├── index.md
    └── getting-started.md
```

### With Internationalization

When combining versions with i18n, add locale directories inside each version:

```
docs/
├── v2/
│   ├── en/
│   │   ├── index.md
│   │   └── getting-started.md
│   └── de/
│       ├── index.md
│       └── getting-started.md
└── v1/
    ├── en/
    │   └── index.md
    └── de/
        └── index.md
```

URLs become: `/en/docs/v2/getting-started`, `/de/docs/v1/`, etc.

### Version Folder Naming

**Important:** Avoid dots in version folder names. Astro's content collection loader strips dots from folder names in document IDs, which can cause issues.

| Folder Name | Status | Notes |
|-------------|--------|-------|
| `v1/` | Good | Simple, clean |
| `v2/` | Good | |
| `next/` | Good | For unreleased versions |
| `v1.0/` | Avoid | Dots are stripped from IDs |
| `2.0.0/` | Avoid | Dots cause issues |

Use the `label` property to display the full version number in the UI:

```javascript
{ version: 'v2', label: 'Version 2.0.0' }
```

---

## URL Structure

### Route Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| `/docs/[version]/[...slug]` | `/docs/v2/installation` | Standard versioned route |
| `/docs/latest/[...slug]` | `/docs/latest/installation` | Alias for current version |
| `/docs/` | `/docs/` | Redirects to current version |

With i18n enabled:

| Pattern | Example |
|---------|---------|
| `/[locale]/docs/[version]/[...slug]` | `/en/docs/v2/installation` |
| `/[locale]/docs/latest/[...slug]` | `/de/docs/latest/installation` |

### The `/latest/` Alias

The `/latest/` alias is automatically generated for all pages in the current version. This allows users to link to documentation that will always point to the most recent version.

```markdown
<!-- Always links to current version -->
Check the [installation guide](/docs/latest/installation)
```

---

## Adding a New Version

When releasing a new version:

1. **Create the version directory**
   ```bash
   mkdir -p docs/v3
   ```

2. **Copy content from the previous version**
   ```bash
   cp -r docs/v2/* docs/v3/
   ```

3. **Update the configuration**
   ```javascript
   versions: {
     current: 'v3',  // Update current
     available: [
       { version: 'v3', label: 'Version 3.0 (Latest)' },  // Add new
       { version: 'v2', label: 'Version 2.0' },  // Update label
       { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
     ],
     deprecated: ['v1'],  // Keep or update
     stable: 'v3',  // Update stable
   }
   ```

4. **Update content collection config**
   ```typescript
   createVersionedDocsCollection('./docs', {
     versions: ['v1', 'v2', 'v3'],  // Add new version
     fallbackVersion: 'v3',  // Update fallback
   })
   ```

5. **Update the new version's content**
   - Document new features
   - Update changed APIs
   - Remove deprecated features

---

## Deprecating a Version

When deprecating an older version:

1. **Add to deprecated list**
   ```javascript
   deprecated: ['v1', 'v2'],  // Add deprecated version
   ```

2. **Add unmaintained banner**
   ```javascript
   available: [
     { version: 'v3', label: 'Version 3.0 (Latest)' },
     { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },  // Add banner
     { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
   ],
   ```

3. **Consider removing very old versions**

   You can remove versions entirely by:
   - Removing from the `available` array
   - Removing from the `deprecated` array
   - Deleting the version directory
   - Removing from the content collection config

---

## Version Selector

The version selector UI automatically appears in both the navbar and mobile sidebar when multiple versions are configured.

### Display Badges

The version selector shows badges to help users identify version status:

| Badge | Meaning | Trigger |
|-------|---------|---------|
| **stable** (green) | Stable release | Matches `stable` config property |
| **deprecated** (yellow) | Deprecated/unmaintained | In `deprecated` array or has `banner: 'unmaintained'` |
| **unreleased** (blue) | Preview/beta version | Has `banner: 'unreleased'` |

### Behavior

- Clicking a version navigates to the same page in the selected version
- If the page doesn't exist in the target version, navigates to the version's index
- Current version is visually highlighted

---

## Best Practices

### Content Management

1. **Start with one version**: Get your docs working without versioning first, then add versions when you need them.

2. **Keep versions focused**: Only maintain actively supported versions. Remove very old versions when they're no longer relevant.

3. **Document breaking changes**: When a page changes significantly between versions, clearly document the differences.

4. **Use consistent structure**: Keep the same page hierarchy across versions when possible, so links don't break when users switch versions.

### Configuration Tips

1. **Use descriptive labels**: Make it clear which version is latest/stable:
   ```javascript
   { version: 'v2', label: 'Version 2.0 (Latest)' }
   ```

2. **Mark pre-release versions**: Use the `unreleased` banner for beta/preview versions:
   ```javascript
   { version: 'v3-beta', banner: 'unreleased' }
   ```

3. **Keep versions ordered**: List versions from newest to oldest in the `available` array.

### Performance Considerations

Each version generates a complete set of static pages. For large documentation sites with many versions:

- Consider limiting the number of maintained versions
- Remove deprecated versions after a reasonable deprecation period
- Use meaningful page boundaries to avoid very large single pages

---

## Cross-Version Links

When writing versioned documentation, you often need to link between pages within the same version or to specific pages in other versions. shipyard provides a rehype plugin for intelligent link handling.

### Setting Up Link Resolution

Add the `rehypeVersionLinks` plugin to your Astro markdown config:

```javascript
import shipyardDocs, { rehypeVersionLinks } from '@levino/shipyard-docs'

// Define your versions config (reuse in both places)
const versionsConfig = {
  current: 'v2',
  available: [
    { version: 'v2', label: 'Version 2.0 (Latest)' },
    { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
  ],
  deprecated: ['v1'],
  stable: 'v2',
}

export default defineConfig({
  markdown: {
    rehypePlugins: [
      [
        rehypeVersionLinks,
        {
          routeBasePath: 'docs',
          currentVersion: versionsConfig.current,
          availableVersions: versionsConfig.available.map((v) => v.version),
        },
      ],
    ],
  },
  integrations: [
    shipyardDocs({
      versions: versionsConfig,
    }),
  ],
})
```

### Link Types

#### 1. Relative Links (Same Version)

Relative links automatically stay within the current version:

```markdown
<!-- In /docs/v2/getting-started.md -->
See the [configuration guide](./configuration) for more options.

<!-- Renders as: <a href="./configuration">... -->
<!-- Navigates to: /docs/v2/configuration -->
```

Use relative links for navigation within the same version. They work correctly regardless of which version the page is in.

#### 2. Cross-Version Links (@version:/path)

Use the `@version:/path` syntax to link to a specific version:

```markdown
<!-- Link to v2 from any page -->
Check the [v2 migration guide](@v2:/migration)

<!-- Link to v1 docs -->
See the [old configuration](@v1:/configuration)

<!-- Link using latest alias -->
View the [latest documentation](@latest:/getting-started)
```

The plugin transforms these links:
- `@v2:/migration` → `/docs/v2/migration`
- `@v1:/configuration` → `/docs/v1/configuration`
- `@latest:/getting-started` → `/docs/latest/getting-started`

#### 3. Auto-Versioned Absolute Links

Absolute links to docs without a version are automatically versioned to the current version:

```markdown
<!-- In any versioned doc -->
See the [installation guide](/docs/installation)

<!-- With currentVersion: 'v2', renders as: -->
<a href="/docs/v2/installation">...
```

This is useful when migrating existing docs to versioning.

### Best Practices for Links

| Use Case | Recommended Approach | Example |
|----------|---------------------|---------|
| Same-version navigation | Relative links | `[Page](./page)` |
| Cross-version references | @version syntax | `[@v2:/page](@v2:/page)` |
| External links | Full URL | `[Docs](https://...)` |
| Anchor links | Standard syntax | `[Section](#section)` |

### Plugin Options

| Option | Type | Description |
|--------|------|-------------|
| `routeBasePath` | `string` | Base path for docs (e.g., `'docs'`) |
| `currentVersion` | `string` | The current/default version |
| `availableVersions` | `string[]` | List of valid version identifiers |
| `debug` | `boolean` | Enable verbose logging (default: `false`) |

### Example: Deprecation Notice Links

A common pattern is linking from deprecated docs to the current version:

```markdown
<!-- In docs/v1/configuration.md -->
---
title: Configuration (v1)
---

# Configuration (v1)

> **Deprecated**: This guide is for v1. See the [v2 configuration guide](@v2:/configuration) for current options.

## Legacy Configuration

When upgrading to v2, see the [Migration Guide](@v2:/migration).
```

---

## See Also

- [@levino/shipyard-docs](../docs-package) - Full docs package reference
- [Getting Started](../getting-started) - Initial setup guide
