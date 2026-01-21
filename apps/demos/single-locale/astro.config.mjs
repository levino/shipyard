// @ts-check

import shipyard from '@levino/shipyard-base'
import { shipyardCodeBlockTransformers } from '@levino/shipyard-base/shiki'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import shipyardBlog from '../../../packages/blog/src/index.ts'

// Import CSS URL - Vite resolves the path
import appCss from './src/styles/app.css?url'

// https://astro.build/config
export default defineConfig({
  // No i18n configuration - single language site
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      transformers: shipyardCodeBlockTransformers(),
    },
  },
  integrations: [
    shipyard({
      css: appCss,
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs/markdown-features',
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
      title: 'Single Language Demo',
      tagline: 'shipyard without internationalization',
      brand: 'Single Lang Demo',
      announcementBar: {
        id: 'demo-announcement',
        content:
          'This is a demo site for <a href="/docs/markdown-features">shipyard</a>. Check out the new features!',
        backgroundColor: 'primary',
        textColor: 'primary-content',
        isCloseable: true,
      },
      footer: {
        logo: {
          alt: 'Single Language Demo Logo',
          src: '/favicon.svg',
          href: '/docs/markdown-features',
          width: 40,
          height: 40,
        },
        links: [
          { label: 'Documentation', to: '/docs/markdown-features' },
          { label: 'Blog', to: '/blog' },
          { label: 'About', to: '/about' },
          { label: 'GitHub', href: 'https://github.com/levino/shipyard' },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Single Language Demo.`,
      },
      onBrokenLinks: 'throw',
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/single-locale/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
    shipyardBlog({
      blogSidebarCount: 'ALL',
      blogSidebarTitle: 'All posts',
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/single-locale/blog',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      tagsMapPath: './blog/tags.yml',
    }),
  ],
})
