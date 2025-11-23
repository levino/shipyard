// @ts-check

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // No i18n configuration - single language site with multiple docs
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      navigation: {
        docs: {
          label: 'User Docs',
          href: '/docs/index',
        },
        guides: {
          label: 'Guides',
          href: '/guides/index',
        },
      },
      title: 'Multi-Docs Demo',
      tagline: 'Multiple documentation instances',
      brand: 'Multi-Docs Demo',
    }),
    // Default docs at /docs
    shipyardDocs(),
    // Second docs instance at /guides
    shipyardDocs({ routeBasePath: 'guides' }),
  ],
})
