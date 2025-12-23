# @levino/shipyard-docs

Documentation plugin for [shipyard](https://shipyard.levinkeller.de), a general-purpose page builder for Astro.

## Installation

```bash
npm install @levino/shipyard-docs
```

## Peer Dependencies

- `astro` ^5.15

## Basic Usage

### Astro Integration

```ts
// astro.config.ts
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      routeBasePath: 'docs',
      editUrl: 'https://github.com/user/repo/edit/main/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
  ],
})
```

### Content Collection

```ts
// content.config.ts
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))

export const collections = { docs }
```

### Multiple Documentation Instances

```ts
// astro.config.ts
export default defineConfig({
  integrations: [
    shipyardDocs({ routeBasePath: 'docs' }),
    shipyardDocs({ routeBasePath: 'guides', collectionName: 'guides' }),
  ],
})
```

### Routes

The integration automatically injects these routes:

- `/[routeBasePath]/[...slug]` - Documentation pages

With i18n enabled, routes are prefixed with `[locale]`.

## Documentation

For complete documentation and examples, visit [shipyard.levinkeller.de](https://shipyard.levinkeller.de).

## License

MIT
