// @ts-check

import shipyard from '@levino/shipyard-base'
import shipyardDocs, { rehypeVersionLinks } from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import appCss from './src/styles/app.css?url'

// Version configuration for this demo
const versionsConfig = {
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
}

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  // Configure rehype plugin for version-aware link resolution
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
  // No i18n configuration - single language site with versioned docs
  integrations: [
    shipyard({
      css: appCss,
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
      // Use the shared version configuration
      versions: versionsConfig,
    }),
  ],
})
