import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightBlog from 'starlight-blog'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.levinkeller.de',
  integrations: [
    starlightBlog(),
    starlight({
      editLink: {
        baseUrl: 'https://github.com/levino/levinkeller.de/edit/main/docs/',
      },
      title: 'Levin Keller',
      social: {
        github: 'https://github.com/levino/levinkeller.de',
      },
      components: {
        MarkdownContent: 'starlight-blog/overrides/MarkdownContent.astro',
        Sidebar: 'starlight-blog/overrides/Sidebar.astro',
        ThemeSelect: 'starlight-blog/overrides/ThemeSelect.astro',
      },
      sidebar: [
        {
          label: 'Garten',
          autogenerate: {
            directory: 'docs/gardening',
          },
        },
        {
          label: 'Software',
          autogenerate: {
            directory: 'docs/software',
          },
        },
        {
          label: 'Kommunalpolitik',
          autogenerate: {
            directory: 'docs/kommunalpolitik',
          },
        },
        {
          label: 'Über meine Homepage',
          link: '/about',
        },
        {
          label: 'Impressum',
          link: '/imprint',
        },
      ],
    }),
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.startsWith('https://www.levinkeller.de/private/'),
    }),
  ],
})
