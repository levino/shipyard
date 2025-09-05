import type { AstroIntegration } from 'astro'
import { z } from 'astro/zod'

export const blogSchema = z.object({
  date: z.date(),
  title: z.string(),
  description: z.string(),
})

export default (blogPaths: string[]): AstroIntegration => ({
  name: 'shipyard-blog',
  hooks: {
    'astro:config:setup': ({ injectRoute, config }) => {
      blogPaths.forEach((path) => {
        if (config.i18n) {
          // With i18n: use locale prefix
          injectRoute({
            pattern: `/[locale]/${path}`,
            entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
          })
          injectRoute({
            pattern: `/[locale]/${path}/[...slug]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
          })
        } else {
          // Without i18n: direct path
          injectRoute({
            pattern: `/${path}`,
            entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
          })
          injectRoute({
            pattern: `/${path}/[...slug]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
          })
        }
      })
    },
  },
})
