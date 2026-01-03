import type { AstroIntegration } from 'astro'
import { z } from 'astro/zod'

export const blogSchema = z.object({
  date: z.date(),
  title: z.string(),
  description: z.string(),
  /**
   * Tags for categorizing this blog post.
   * Can be an array of tag values (strings) that map to entries in the tags collection.
   */
  tags: z.array(z.string()).optional(),
  /**
   * Override the last update author for this specific post.
   * Set to false to hide the author for this post.
   */
  last_update_author: z.union([z.string(), z.literal(false)]).optional(),
  /**
   * Override the last update timestamp for this specific post.
   * Set to false to hide the timestamp for this post.
   */
  last_update_time: z.union([z.coerce.date(), z.literal(false)]).optional(),
  /**
   * Custom edit URL for this specific post.
   * Set to null to disable edit link for this post.
   */
  custom_edit_url: z.string().nullable().optional(),
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
  /**
   * The base URL for "Edit this page" links.
   * This should point to the directory containing your blog posts in your repository.
   * @example 'https://github.com/user/repo/edit/main/blog'
   */
  editUrl: z.string().optional(),
  /**
   * Whether to show the last update timestamp on each post.
   * Uses git history to determine when the file was last modified.
   * @default false
   */
  showLastUpdateTime: z.boolean().default(false),
  /**
   * Whether to show the last update author on each post.
   * Uses git history to determine who last modified the file.
   * @default false
   */
  showLastUpdateAuthor: z.boolean().default(false),
})

export type BlogConfig = z.infer<typeof blogConfigSchema>

/**
 * Schema for a single tag definition in the tags collection.
 * Each tag has a value (used as ID/key), a label for display, and optional description.
 */
export const tagSchema = z.object({
  /**
   * The display label for this tag.
   * For i18n sites, this can be locale-specific.
   */
  label: z.string(),
  /**
   * Optional description for this tag.
   */
  description: z.string().optional(),
  /**
   * Optional custom permalink for this tag.
   * If not provided, the tag value (ID) will be used.
   */
  permalink: z.string().optional(),
})

/**
 * Schema for the tags collection.
 * The collection is a YAML file where keys are tag values and values contain label/description.
 * For i18n support, tags should be organized by locale in the file structure.
 *
 * @example
 * ```yaml
 * # tags/en/tags.yaml
 * harvest-report:
 *   label: "Harvest Report"
 *   description: "Weekly harvest updates"
 * spring:
 *   label: "Spring"
 * ```
 */
export const tagsSchema = z.record(z.string(), tagSchema)

export type Tag = z.infer<typeof tagSchema>
export type TagsCollection = z.infer<typeof tagsSchema>

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
            pattern: `/[locale]/blog/tags`,
            entrypoint: `@levino/shipyard-blog/astro/BlogTagsIndex.astro`,
          })
          injectRoute({
            pattern: `/[locale]/blog/tags/[tag]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogTagPage.astro`,
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
            pattern: `/blog/tags`,
            entrypoint: `@levino/shipyard-blog/astro/BlogTagsIndex.astro`,
          })
          injectRoute({
            pattern: `/blog/tags/[tag]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogTagPage.astro`,
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
