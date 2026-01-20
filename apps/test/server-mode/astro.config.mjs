// @ts-check

import node from '@astrojs/node'
import shipyard from '@levino/shipyard-base'
import shipyardBlog from '@levino/shipyard-blog'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // Server mode configuration with Node.js adapter for testing
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  // No i18n configuration - single language site
  integrations: [
    shipyard({
      css: './src/styles/app.css',
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs/index',
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
      title: 'Server Mode Test',
      tagline: 'shipyard with server-side rendering',
      brand: 'Server Mode Test',
      onBrokenLinks: 'throw',
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/test/server-mode/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
    shipyardBlog({
      blogSidebarCount: 'ALL',
      blogSidebarTitle: 'All posts',
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/test/server-mode/blog',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
  ],
})
