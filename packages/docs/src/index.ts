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

export default (docsPaths: string[]): AstroIntegration => ({
  name: 'shipyard-docs',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      docsPaths.forEach((path) => {
        injectRoute({
          pattern: `/${path}/[...slug]`,
          entrypoint:
            `@levino/shipyard-docs/astro/DefaultLocaleDocsEntry.astro`,
        })
        injectRoute({
          pattern: `/[locale]/${path}/[...slug]`,
          entrypoint: `@levino/shipyard-docs/astro/DocsEntry.astro`,
        })
      })
    },
  },
})
