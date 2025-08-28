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
    'astro:config:setup': ({ injectRoute }) => {
      blogPaths.forEach((path) => {
        injectRoute({
          pattern: `/[locale]/${path}`,
          entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
        })
        injectRoute({
          pattern: `/[locale]/${path}/[...slug]`,
          entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
        })
      })
    },
  },
})
