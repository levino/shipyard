// @ts-check

import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import appCss from './src/styles/app.css?url'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      navigation: {
        docs: {
          label: 'Documentation',
          href: '/docs',
        },
        broken: {
          label: 'Broken Link',
          href: '/this-page-does-not-exist',
        },
      },
      title: 'Broken Links Test',
      tagline: 'Testing broken link detection',
      brand: 'Test App',
      // Set to 'throw' to test that broken links fail the build
      onBrokenLinks: 'throw',
    }),
    shipyardDocs(),
  ],
})
