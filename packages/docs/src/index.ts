import type { AstroIntegration } from 'astro'

import { z } from 'astro/zod'

export const docsSchema = z.object({
  sidebar: z
    .object({
      render: z.boolean().default(true),
      label: z.string().optional(),
    })
    .default({ render: true }),
  title: z.string().optional(),
  description: z.string().optional(),
})

export default (): AstroIntegration => ({
  name: 'shipyard-docs',
  hooks: {
    'astro:config:setup': ({ injectRoute, config }) => {
      if (config.i18n) {
        // With i18n: use locale prefix
        injectRoute({
          pattern: `/[locale]/docs/[...slug]`,
          entrypoint: `@levino/shipyard-docs/astro/DocsEntry.astro`,
        })
      } else {
        // Without i18n: direct path
        injectRoute({
          pattern: `/docs/[...slug]`,
          entrypoint: `@levino/shipyard-docs/astro/DocsEntry.astro`,
        })
      }
    },
  },
})
