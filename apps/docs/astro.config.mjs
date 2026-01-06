// @ts-check

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'
import shipyardBlog from '../../packages/blog/src/index.ts'

// https://astro.build/config
export default defineConfig({
  site: 'https://shipyard.levinkeller.de',
  redirects: {
    '/': {
      status: 302,
      destination: 'en',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs',
        },
        blog: {
          label: 'Blog',
          href: '/blog',
        },
        about: {
          label: 'About',
          href: '/about',
        },
      },
      title: 'shipyard',
      tagline: 'A universal page builder for astro',
      brand: 'shipyard',
      scripts: [
        {
          src: 'https://analytics.levinkeller.de/js/script.js',
          defer: true,
          'data-domain': 'shipyard.levinkeller.de',
        },
      ],
    }),
    shipyardDocs({
      llmsTxt: {
        enabled: true,
        projectName: 'shipyard',
        summary:
          'shipyard is an Astro-based page builder for creating documentation sites, blogs, and content-focused websites with responsive design, i18n support, and modular components.',
        description:
          'shipyard provides three packages: @levino/shipyard-base (core layouts and configuration), @levino/shipyard-docs (documentation features with sidebar and pagination), and @levino/shipyard-blog (blog functionality). It uses Tailwind CSS with DaisyUI for styling.',
      },
    }),
    shipyardBlog(),
  ],
})
