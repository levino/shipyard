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
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: true,
      strategy: 'pathname',
    },
    fallback: {
      de: 'en',
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      locales: ['de', 'en'],
      defaultLocale: 'en',
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
      title: 'Shipyard Demo',
      tagline: 'A website to demonstrate the Shipyard capabilities.',
      brand: 'Shipyard',
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
})
