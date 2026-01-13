---
title: Version Lifecycle
sidebar_position: 3
description: Managing the complete lifecycle of documentation versions
---

# Version Lifecycle Example

This example shows how to manage versions throughout their complete lifecycle: from releasing a new version, marking it stable, deprecating older versions, and eventually archiving them.

## Version States

A documentation version typically goes through these states:

| State | Badge | Description |
|-------|-------|-------------|
| **Unreleased** | `info` | Pre-release, beta, or release candidate |
| **Current** | `primary` | The latest released version |
| **Stable** | `success` | The recommended version for most users |
| **Deprecated** | `warning` | Still available but no longer maintained |
| **Archived** | (removed) | No longer available in documentation |

## Scenario: Releasing v3

Let's walk through a typical scenario where you have v1 and v2, and you're releasing v3.

### Initial State (Before v3 Release)

```javascript
// astro.config.mjs - Before v3 release
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',
        available: [
          { version: 'v2', label: 'Version 2.0' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',
      },
    }),
  ],
})
```

### Step 1: Add v3 as Unreleased

First, add v3 as a pre-release version while still developing it:

```javascript
// astro.config.mjs - v3 in development
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',  // v2 is still the default
        available: [
          { version: 'v3', label: 'Version 3.0 (Beta)', banner: 'unreleased' },
          { version: 'v2', label: 'Version 2.0' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',  // v2 is still stable
      },
    }),
  ],
})
```

Create the new version directory:

```bash
mkdir -p docs/v3
cp -r docs/v2/* docs/v3/
```

Update the content collection:

```typescript
// src/content.config.ts
const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2', 'v3'],  // Add v3
    fallbackVersion: 'v2',
  }),
)
```

### Step 2: Release v3 (Make it Current)

When v3 is ready for release:

```javascript
// astro.config.mjs - v3 released
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v3',  // v3 is now current
        available: [
          { version: 'v3', label: 'Version 3.0' },  // Remove 'unreleased' banner
          { version: 'v2', label: 'Version 2.0' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v3',  // v3 is now stable
      },
    }),
  ],
})
```

**What changes:**
- Users visiting `/docs/` are redirected to `/docs/v3/`
- `/docs/latest/` now points to v3
- v3 shows the "Stable" badge

### Step 3: Deprecate v2

After v3 has been stable for some time, deprecate v2:

```javascript
// astro.config.mjs - v2 deprecated
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v3',
        available: [
          { version: 'v3', label: 'Version 3.0' },
          { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },  // Add banner
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1', 'v2'],  // Add v2 to deprecated list
        stable: 'v3',
      },
    }),
  ],
})
```

**What changes:**
- v2 pages now show the deprecation warning banner
- v2 shows the "Deprecated" badge
- The banner includes a link to the same page in v3

### Step 4: Archive v1

When a version is so old that it's no longer useful, remove it entirely:

```javascript
// astro.config.mjs - v1 archived
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v3',
        available: [
          { version: 'v3', label: 'Version 3.0' },
          { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },
          // v1 removed from available
        ],
        deprecated: ['v2'],  // Remove v1 from deprecated
        stable: 'v3',
      },
    }),
  ],
})
```

Update the content collection:

```typescript
// src/content.config.ts
const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v2', 'v3'],  // Remove v1
    fallbackVersion: 'v3',
  }),
)
```

Optionally archive the content:

```bash
# Archive v1 content (optional, for reference)
tar -czf archive/docs-v1.tar.gz docs/v1/
rm -rf docs/v1/
```

## Full Configuration Timeline

Here's how the configuration evolves over a typical version lifecycle:

### Timeline

```
Time ──────────────────────────────────────────────────────────────────>

v1:  [stable]────────[deprecated]──────────────────────[archived]
v2:           [unreleased]──[stable]───────[deprecated]───────────────>
v3:                              [unreleased]──[stable]───────────────>
v4:                                                 [unreleased]──────>
```

### Configuration at Each Point

**Point A: v2 is new**
```javascript
versions: {
  current: 'v1',
  available: [
    { version: 'v2', label: 'Version 2.0 (Beta)', banner: 'unreleased' },
    { version: 'v1', label: 'Version 1.0' },
  ],
  deprecated: [],
  stable: 'v1',
}
```

**Point B: v2 released**
```javascript
versions: {
  current: 'v2',
  available: [
    { version: 'v2', label: 'Version 2.0' },
    { version: 'v1', label: 'Version 1.0' },
  ],
  deprecated: [],
  stable: 'v2',
}
```

**Point C: v1 deprecated**
```javascript
versions: {
  current: 'v2',
  available: [
    { version: 'v2', label: 'Version 2.0' },
    { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
  ],
  deprecated: ['v1'],
  stable: 'v2',
}
```

**Point D: v3 released, v1 archived**
```javascript
versions: {
  current: 'v3',
  available: [
    { version: 'v3', label: 'Version 3.0' },
    { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },
  ],
  deprecated: ['v2'],
  stable: 'v3',
}
```

## Best Practices

### When to Deprecate

Deprecate a version when:
- A newer version has been stable for at least one release cycle
- The old version no longer receives security updates
- You want to encourage users to migrate

### When to Archive

Archive a version when:
- Less than 5% of traffic goes to that version
- The version is more than 2-3 major versions behind
- Maintaining the content is no longer worthwhile
- You've provided enough time for users to migrate

### Deprecation Period

A typical deprecation timeline:
1. **Announce deprecation** in release notes when the new version ships
2. **Add deprecation banner** 1-2 months after the new version is stable
3. **Archive** 6-12 months after deprecation (depending on your release cycle)

### Communicating Changes

- Use the `banner` property to show clear warnings on deprecated versions
- Update the `label` to include status (e.g., "Version 1.0 (Legacy)")
- Add migration guides linking from deprecated to current version
- Consider blog posts or changelogs for major version transitions

## Handling Edge Cases

### Release Candidates

For pre-release versions:

```javascript
{ version: 'v3-rc', label: 'Version 3.0 RC1', path: 'v3-rc', banner: 'unreleased' }
```

### LTS (Long-Term Support) Versions

For LTS versions that receive extended support:

```javascript
{
  current: 'v4',
  available: [
    { version: 'v4', label: 'Version 4.0' },
    { version: 'v3-lts', label: 'Version 3.0 LTS', path: 'v3-lts' },
    { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },
  ],
  deprecated: ['v2'],
  stable: 'v4',  // or 'v3-lts' if LTS is recommended for production
}
```

### Parallel Major Versions

When maintaining two active major versions (e.g., Python 2/3 situation):

```javascript
{
  current: 'v3',
  available: [
    { version: 'v3', label: 'Version 3.x' },
    { version: 'v2', label: 'Version 2.x' },  // No deprecation banner
  ],
  deprecated: [],
  stable: 'v3',  // Recommend v3 for new projects
}
```

## Next Steps

- See [Basic Versioning](./basic-versioning) for initial setup
- See [Documentation Versioning Guide](../guides/versioning) for configuration reference
- See [Migrating to Versioned Docs](../guides/migration-to-versioned) for migration help
