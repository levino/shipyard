# @levino/shipyard-base

Core package for [shipyard](https://shipyard.levinkeller.de), a general-purpose page builder for Astro.

## Installation

```bash
npm install @levino/shipyard-base
```

## Peer Dependencies

- `astro` ^7.2.4
- `tailwindcss` ^4
- `daisyui` ^5
- `@tailwindcss/typography` ^0.5.20

## Basic Usage

### Astro Integration

```ts
// astro.config.ts
import shipyard from '@levino/shipyard-base'

export default defineConfig({
  integrations: [
    shipyard({
      title: 'My Site',
      // ... configuration
    }),
  ],
})
```

### Layouts

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="My Page">
  <p>Page content</p>
</Page>
```

Available layouts: `Page`, `Splash`, `Footer`

### Components

```astro
---
import { SidebarNavigation, Breadcrumbs } from '@levino/shipyard-base/components'
---
```

Available components: `Breadcrumbs`, `Footer`, `GlobalDesktopNavigation`, `LocalNavigation`, `SidebarElement`, `SidebarNavigation`, `TableOfContents`

## Documentation

For complete documentation and examples, visit [shipyard.levinkeller.de](https://shipyard.levinkeller.de).

## License

MIT
