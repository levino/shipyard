// @ts-check
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/en',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: {
      redirectToDefaultLocale: false,
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
      meta: {
        title: 'Shipyard',
        description: 'A universal page builder for astro',
      },
      brand: 'Shipyard',
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
})
