// @ts-check

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import {
  remarkAdmonitions,
  remarkDirective,
  remarkNpm2Yarn,
} from '@levino/shipyard-base/remark'
import { shipyardCodeBlockTransformers } from '@levino/shipyard-base/shiki'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'
import shipyardBlog from '../../../packages/blog/src/index.ts'

// https://astro.build/config
export default defineConfig({
  // No i18n configuration - single language site
  markdown: {
    remarkPlugins: [remarkDirective, remarkAdmonitions, remarkNpm2Yarn],
    shikiConfig: {
      transformers: shipyardCodeBlockTransformers(),
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
