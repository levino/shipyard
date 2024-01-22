import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import shipyard from '@shipyard/base'
// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
      strategy: 'pathname',
    },
    fallback: {
      en: 'de',
    },
  },
  site: 'https://www.levinkeller.de',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.startsWith('https://www.levinkeller.de/private/'),
    }),
    mdx(),
    shipyard({
      navigation: {
        garden: {
          label: 'Gartenplaner',
          subEntry: {
            beds: {
              label: 'Beetplaner',
              href: '/garden/beds/1',
            },
            plants: {
              label: 'Pflanzen',
              href: '/garden/plants/1',
            },
            shoppinglist: {
              label: 'Einkaufsliste',
              href: '/garden/shopping-list',
            },
            sowingCalendar: {
              label: 'Aussaatkalender',
              href: '/garden/sowing-calendar',
            },
          },
        },
        docs: {
          label: 'Docs',
          href: '/docs',
        },
        blog: {
          label: 'Blog',
          href: '/blog',
        },
        work: {
          label: 'Work',
          href: '/work',
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
  ],
})
