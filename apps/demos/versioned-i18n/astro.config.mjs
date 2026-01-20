// @ts-check

import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://versioned-i18n.demos.shipyard.levinkeller.de',
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/': {
      status: 302,
      destination: 'en',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
    // Fallback disabled to prevent overwriting explicitly generated redirect pages
    // All docs have content in both locales, so fallback is not needed
  },
  integrations: [
    shipyard({
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs/v2/',
        },
        about: {
          label: 'About',
          href: '/about',
        },
      },
      title: 'Versioned i18n Demo',
      tagline: 'shipyard with versioning and internationalization',
      brand: 'Versioned i18n',
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/versioned-i18n/docs',
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
