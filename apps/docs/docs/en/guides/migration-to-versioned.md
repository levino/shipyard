---
title: Migrating to Versioned Docs
sidebar_position: 2
description: Step-by-step guide for migrating existing documentation to versioned docs
---

# Migrating to Versioned Docs

This guide walks you through migrating an existing shipyard documentation site to use versioned documentation. The migration is non-breaking and can be done incrementally.

## Prerequisites

Before migrating, ensure you have:

- An existing shipyard docs site working without versioning
- `@levino/shipyard-docs` version 0.4.0 or later installed
- A clear understanding of which version(s) you want to maintain

## Migration Overview

The migration process involves:

1. Reorganizing your content directory structure
2. Updating your content collection configuration
3. Adding version configuration to your Astro config
4. Testing the migrated site

**Important:** This migration is non-breaking. Your existing URLs will continue to work, and the version system adds new URL patterns rather than changing existing ones.

---

## Step 1: Plan Your Version Strategy

Before restructuring content, decide on your versioning approach:

### Questions to Consider

1. **How many versions will you maintain?**
   - Start with 1-2 versions (current + one previous)
   - Add more as needed

2. **What version naming scheme will you use?**
   - Simple: `v1`, `v2`, `v3`
   - Semantic: `v1`, `v2` (avoid dots in folder names)
   - Named: `stable`, `next`, `legacy`

3. **Do you need to keep the current docs as-is?**
   - If yes, your current docs become `v1`, and you create `v2` for changes
   - If no, your current docs become the initial version

### Recommended Approach

For most migrations, we recommend:

- Current docs become your first version (e.g., `v1`)
- Create new version (`v2`) only when you have breaking changes
- Keep version count low initially

---

## Step 2: Restructure Content Directory

### Current Structure (Non-Versioned)

Your existing structure likely looks like this:

```
docs/
├── index.md
├── getting-started.md
├── configuration.md
└── advanced/
    ├── api.md
    └── plugins.md
```

Or with i18n:

```
docs/
├── en/
│   ├── index.md
│   └── getting-started.md
└── de/
    ├── index.md
    └── getting-started.md
```

### Target Structure (Versioned)

Move all content into a version directory:

**Without i18n:**

```
docs/
└── v1/
    ├── index.md
    ├── getting-started.md
    ├── configuration.md
    └── advanced/
        ├── api.md
        └── plugins.md
```

**With i18n:**

```
docs/
└── v1/
    ├── en/
    │   ├── index.md
    │   └── getting-started.md
    └── de/
        ├── index.md
        └── getting-started.md
```

### Migration Commands

Run these commands from your project root:

**Without i18n:**

```bash
# Create version directory
mkdir -p docs/v1

# Move all content into version directory
mv docs/*.md docs/v1/
mv docs/*/ docs/v1/ 2>/dev/null || true

# Verify structure
ls -la docs/v1/
```

**With i18n:**

```bash
# Create version directory
mkdir -p docs/v1

# Move locale directories into version directory
mv docs/en docs/v1/
mv docs/de docs/v1/
# Repeat for other locales

# Verify structure
ls -la docs/v1/
```

---

## Step 3: Update Content Collection

Update your `src/content.config.ts` (or `src/content/config.ts`):

### Before (Non-Versioned)

```typescript
import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs' }),
  schema: docsSchema,
})

export const collections = { docs }
```

### After (Versioned)

```typescript
import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1'],  // Add more versions as needed
    fallbackVersion: 'v1',
  }),
)

export const collections = { docs }
```

### What Changed

- Import `createVersionedDocsCollection` instead of `docsSchema` and `glob`
- Use the helper function which handles glob patterns and schema automatically
- Specify your version(s) in the `versions` array

---

## Step 4: Add Version Configuration

Update your `astro.config.mjs`:

### Before (Non-Versioned)

```javascript
import { defineConfig } from 'astro/config'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      // existing config
    }),
  ],
})
```

### After (Versioned)

```javascript
import { defineConfig } from 'astro/config'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      // existing config
      versions: {
        current: 'v1',
        available: [
          { version: 'v1', label: 'Version 1.0' },
        ],
        stable: 'v1',
      },
    }),
  ],
})
```

### Configuration Options

| Property | Description | Initial Value |
|----------|-------------|---------------|
| `current` | Default version for `/docs/` | Your version name |
| `available` | Array of version configs | Single version initially |
| `deprecated` | Versions to show warnings for | Empty array |
| `stable` | Marked as stable release | Same as current |

---

## Step 5: Test the Migration

### Build and Preview

```bash
# Build the site
npm run build

# Preview locally
npm run preview
```

### Verify URLs

After migration, your URLs will work as follows:

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/getting-started` | `/docs/v1/getting-started` | Version prefix added |
| `/docs/` | `/docs/v1/` | Redirects to current version |
| N/A | `/docs/latest/getting-started` | New alias for current |

With i18n:

| Old URL | New URL |
|---------|---------|
| `/en/docs/getting-started` | `/en/docs/v1/getting-started` |
| `/de/docs/getting-started` | `/de/docs/v1/getting-started` |

### Run E2E Tests

If you have existing E2E tests, update URL expectations:

```typescript
// Before
await page.goto('/docs/getting-started')

// After
await page.goto('/docs/v1/getting-started')
// Or use latest alias:
await page.goto('/docs/latest/getting-started')
```

---

## Step 6: Update Internal Links

If your documentation has internal links, update them to include the version:

### Option A: Use Relative Links (Recommended)

Relative links automatically work within the same version:

```markdown
<!-- This works - stays within same version -->
See the [configuration guide](./configuration)
See the [API reference](../advanced/api)
```

### Option B: Use Latest Alias

For links that should always point to the current version:

```markdown
<!-- Always points to current version -->
See the [getting started](/docs/latest/getting-started)
```

### Option C: Use Explicit Versions

For links to specific versions:

```markdown
<!-- Links to specific version -->
See the [v1 migration guide](/docs/v1/migration)
```

---

## Adding a Second Version

When you're ready to add a new version:

### 1. Copy Content

```bash
cp -r docs/v1 docs/v2
```

### 2. Update Configuration

```javascript
// astro.config.mjs
versions: {
  current: 'v2',  // Update current
  available: [
    { version: 'v2', label: 'Version 2.0 (Latest)' },
    { version: 'v1', label: 'Version 1.0' },
  ],
  stable: 'v2',  // Update stable
},
```

### 3. Update Content Collection

```typescript
createVersionedDocsCollection('./docs', {
  versions: ['v1', 'v2'],  // Add new version
  fallbackVersion: 'v2',   // Update fallback
})
```

### 4. Update v2 Content

Modify the content in `docs/v2/` to reflect the new version's changes.

---

## Troubleshooting

### Common Issues

**Build fails with "cannot find content"**

- Ensure all files were moved to the version directory
- Check that the `versions` array includes all your version folder names
- Verify folder names match exactly (case-sensitive)

**Version selector doesn't appear**

- The selector only shows when there are 2+ versions configured
- With a single version, no selector is needed

**404 errors for existing URLs**

- Old URLs without version prefix won't automatically redirect
- Consider adding redirects in your hosting configuration
- Or update all internal/external links to new versioned URLs

**Sidebar shows wrong pages**

- The sidebar filters by current version automatically
- Ensure your content is in the correct version directory

### Getting Help

If you encounter issues:

1. Check that your folder structure matches the expected pattern
2. Verify version names are consistent across all configuration files
3. Run a clean build: `rm -rf dist .astro && npm run build`
4. Check the browser console for any errors

---

## Rollback Plan

If you need to revert the migration:

1. Move content back out of the version directory:
   ```bash
   mv docs/v1/* docs/
   rmdir docs/v1
   ```

2. Revert `src/content.config.ts` to use `docsSchema` and `glob` directly

3. Remove the `versions` config from `astro.config.mjs`

---

## See Also

- [Documentation Versioning](./versioning) - Complete versioning reference
- [@levino/shipyard-docs](../docs-package) - Full docs package reference
