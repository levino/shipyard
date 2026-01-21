// @ts-check

import mdx from '@astrojs/mdx'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import shipyardBlog from '../../../packages/blog/src/index.ts'
import appCss from './src/styles/app.css?url'

// https://astro.build/config
export default defineConfig({
  site: 'https://i18n.demos.shipyard.levinkeller.de',
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/': {
      status: 302,
      destination: 'en',
    },
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
    mdx(),
    shipyard({
      css: appCss,
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs',
        },
        guides: {
          label: 'Guides',
          href: '/guides',
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
      hideBranding: true,
      footer: {
        style: 'dark',
        logo: {
          alt: 'Metro Gardens Logo',
          src: '/favicon.svg',
          href: 'https://github.com/levino/shipyard',
          width: 40,
          height: 40,
        },
        links: [
          {
            title: 'Docs',
            items: [
              { label: 'Getting Started', to: '/docs' },
              { label: 'Guides', to: '/guides' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Blog', to: '/blog' },
              {
                label: 'GitHub',
                href: 'https://github.com/levino/shipyard',
              },
            ],
          },
          {
            title: 'More',
            items: [{ label: 'About', to: '/about' }],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Metro Gardens. All rights reserved.`,
      },
      // Use 'warn' instead of 'throw' because this demo intentionally has
      // incomplete German translations to demonstrate i18n fallback behavior.
      // The link checker flags language switcher links to non-existent German
      // pages, but these work at runtime due to Astro's fallback rewrite.
      onBrokenLinks: 'warn',
      scripts: [
        'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
        {
          src: 'https://cdn.jsdelivr.net/npm/pocketbase@0.21.5/dist/pocketbase.umd.js',
          async: true,
        },
        {
          src: 'https://cdn.skypack.dev/lodash-es',
          defer: true,
          type: 'module',
        },
      ],
    }),
    shipyardDocs({
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/i18n/docs',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
      llmsTxt: {
        enabled: true,
        projectName: 'Metro Gardens',
        summary:
          'Metro Gardens is a community garden documentation site with guides for growing vegetables, maintaining garden beds, and harvesting crops.',
      },
    }),
    shipyardDocs({
      routeBasePath: 'guides',
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/i18n/guides',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
    shipyardBlog({
      blogSidebarCount: 5,
      blogSidebarTitle: 'Recent posts',
      postsPerPage: 10,
      editUrl:
        'https://github.com/levino/shipyard/edit/main/apps/demos/i18n/blog',
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    }),
  ],
})
