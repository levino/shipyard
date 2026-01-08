// @ts-check

import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
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
