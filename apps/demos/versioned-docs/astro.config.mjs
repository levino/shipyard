// @ts-check

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // No i18n configuration - single language site with versioned docs
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs/v2/index',
        },
        about: {
          label: 'About',
          href: '/about',
        },
      },
      title: 'Versioned Docs Demo',
      tagline: 'shipyard with documentation versioning',
      brand: 'Versioned Docs',
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/versioned-docs/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      // Version configuration
      versions: {
        // Current version shown by default
        current: 'v2',
        // All available versions
        available: [
          { version: 'v2', label: 'Version 2.0 (Latest)' },
          {
            version: 'v1',
            label: 'Version 1.0',
            banner: 'unmaintained',
          },
        ],
        // Deprecated versions will show a warning banner
        deprecated: ['v1'],
        // The stable release version
        stable: 'v2',
      },
    }),
  ],
})
