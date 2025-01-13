// @ts-check
import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '../../packages/blog/src/index.ts'
// https://astro.build/config
export default defineConfig({
  redirects: {
    '/': '/de',
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: true,
      strategy: 'pathname',
    },
    fallback: {
      en: 'de',
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
        title: 'Levin Keller',
        description: 'Levins Homepage',
      },
      brand: 'Levin Keller',
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
})
