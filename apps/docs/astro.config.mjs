// @ts-check

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'
import shipyardBlog from '../../packages/blog/src/index.ts'

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/en',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: {
      prefixDefaultLocale: true,
      strategy: 'pathname',
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
      title: 'Shipyard',
      tagline: 'A universal page builder for astro',
      brand: 'Shipyard',
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
})
