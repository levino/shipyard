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
 * Schema for a single tag's locale-specific data.
 */
export const tagLocaleDataSchema = z.object({
  /**
   * The display label for this tag.
   */
  label: z.string(),
  /**
   * Optional description for this tag.
   */
  description: z.string().optional(),
  /**
   * Optional custom permalink for this tag.
   * If not provided, the tag key will be used.
   */
  permalink: z.string().optional(),
})

/**
 * Schema for a single tag definition in the tags collection.
 * Supports both i18n (locale-nested) and non-i18n (flat) structures.
 */
export const tagSchema = z.union([
  // Non-i18n: flat structure with label/description/permalink
  tagLocaleDataSchema,
  // i18n: locale-nested structure where keys are locale codes
  z.record(z.string(), tagLocaleDataSchema),
])

/**
 * Schema for the tags collection.
 * A single YAML file containing all tags.
 *
 * @example Non-i18n structure:
 * ```yaml
 * # tags/tags.yaml
 * getting-started:
 *   label: "Getting Started"
 *   description: "Posts about getting started"
 * tutorial:
 *   label: "Tutorial"
 * ```
 *
 * @example i18n structure:
 * ```yaml
 * # tags/tags.yaml
 * getting-started:
 *   en:
 *     label: "Getting Started"
 *   de:
 *     label: "Erste Schritte"
 * tutorial:
 *   en:
 *     label: "Tutorial"
 *   de:
 *     label: "Anleitung"
 * ```
 */
export const tagsSchema = z.record(z.string(), tagSchema)

export type TagLocaleData = z.infer<typeof tagLocaleDataSchema>
export type Tag = z.infer<typeof tagSchema>
export type TagsCollection = z.infer<typeof tagsSchema>

// Re-export tag utilities for use in components
export {
  buildTagsMap,
  getTagLabel,
  getTagPermalink,
  type TagsMap,
} from './tag-utils.ts'

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
