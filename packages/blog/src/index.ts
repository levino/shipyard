import type { AstroIntegration } from 'astro'
import { z } from 'astro/zod'

export const blogSchema = z.object({
  date: z.date(),
  title: z.string(),
  description: z.string(),
})

export const blogConfigSchema = z.object({
  /**
   * Number of recent blog posts to show in the sidebar.
   * Set to 'ALL' to show all posts.
   * @default 5
   */
  blogSidebarCount: z
    .union([z.number().int().positive(), z.literal('ALL')])
    .default(5),
  /**
   * Title for the blog sidebar.
   * @default 'Recent posts'
   */
  blogSidebarTitle: z.string().default('Recent posts'),
  /**
   * Number of posts to show per page on the blog index.
   * @default 10
   */
  postsPerPage: z.number().int().positive().default(10),
})

export type BlogConfig = z.infer<typeof blogConfigSchema>

const VIRTUAL_MODULE_ID = 'virtual:shipyard-blog/config'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

export default (options: Partial<BlogConfig> = {}): AstroIntegration => {
  // Parse and validate config
  const blogConfig = blogConfigSchema.parse(options)

  return {
    name: 'shipyard-blog',
    hooks: {
      'astro:config:setup': ({ injectRoute, config, updateConfig }) => {
        // Add a vite plugin to provide the config via a virtual module
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'shipyard-blog-config',
                resolveId(id) {
                  if (id === VIRTUAL_MODULE_ID) {
                    return RESOLVED_VIRTUAL_MODULE_ID
                  }
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                    return `export default ${JSON.stringify(blogConfig)}`
                  }
                },
              },
            ],
          },
        })

        if (config.i18n) {
          // With i18n: use locale prefix
          injectRoute({
            pattern: `/[locale]/blog`,
            entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
          })
          injectRoute({
            pattern: `/[locale]/blog/page/[page]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogIndexPaginated.astro`,
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
            pattern: `/blog/page/[page]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogIndexPaginated.astro`,
          })
          injectRoute({
            pattern: `/blog/[...slug]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
          })
        }
      },
    },
  }
}
