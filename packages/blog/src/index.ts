import type { AstroIntegration } from 'astro'
import { z } from 'astro/zod'

export const blogSchema = z.object({
  date: z.date(),
  title: z.string(),
  description: z.string(),
})

export default (): AstroIntegration => ({
  name: 'shipyard-blog',
  hooks: {
    'astro:config:setup': ({ injectRoute, config }) => {
      if (config.i18n) {
        // With i18n: use locale prefix
        injectRoute({
          pattern: `/[locale]/blog`,
          entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
        })
        injectRoute({
          pattern: `/[locale]/blog/[...slug]`,
          entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
        })
      } else {
        // Without i18n: direct path
        injectRoute({
          pattern: `/blog`,
          entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
        })
        injectRoute({
          pattern: `/blog/[...slug]`,
          entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
        })
      }
    },
  },
})
