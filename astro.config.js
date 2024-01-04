import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
    fallback: {
      en: 'de',
    },
  },
  site: 'https://www.levinkeller.de',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.startsWith('https://www.levinkeller.de/private/'),
    }),
    mdx(),
  ],
})
