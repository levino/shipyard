// @ts-check

import cloudflare from '@astrojs/cloudflare'
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'
import shipyardBlog from '../../../packages/blog/src/index.ts'

// https://astro.build/config
export default defineConfig({
  // Server mode configuration for Cloudflare Pages
  output: 'server',
  adapter: cloudflare(),
  // No i18n configuration - single language site
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
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
      title: 'SSR Demo',
      tagline: 'shipyard mit Server-Side Rendering auf Cloudflare',
      brand: 'SSR Demo',
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/server-mode-cloudflare/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      prerender: false, // Disable prerendering for SSR
    }),
    shipyardBlog({
      blogSidebarCount: 'ALL',
      blogSidebarTitle: 'All posts',
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/server-mode-cloudflare/blog',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      prerender: false, // Disable prerendering for SSR
    }),
  ],
})
