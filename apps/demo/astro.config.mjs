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
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: 'rewrite',
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
      title: 'Metro Gardens',
      tagline: 'Growing community, one plant at a time.',
      brand: 'Metro Gardens',
      scripts: [
        'https://example.com/simple-script.js',
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
          async: true,
        },
        {
          src: 'https://example.com/deferred-script.js',
          defer: true,
          type: 'module',
        },
      ],
    }),
    shipyardDocs(['docs']),
    shipyardBlog(['blog']),
  ],
})
