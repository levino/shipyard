import type { AstroIntegration } from 'astro'
import { z } from 'astro/zod'

export type { FeedConfig, FeedItem, FeedType } from './tools/feed'
export {
  generateAtomFeed,
  generateFeed,
  generateJsonFeed,
  generateRssFeed,
} from './tools/feed'
// Re-export utilities
export { calculateReadingTime } from './tools/readingTime'
export {
  getAllTags,
  groupPostsByYear,
  tagToSlug,
  truncateAtMarker,
} from './tools/truncate'

/**
 * Author definition for blog posts
 */
export const authorSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  url: z.string().url().optional(),
  image_url: z.string().optional(),
  email: z.string().email().optional(),
})

export type Author = z.infer<typeof authorSchema>

export const blogSchema = z.object({
  date: z.date(),
  title: z.string(),
  description: z.string(),
  /**
   * Tags for categorizing the blog post.
   * Used for filtering and organizing content.
   */
  tags: z.array(z.string()).optional(),
  /**
   * Author(s) of the blog post.
   * Can be a single author name, multiple names, or full author objects.
   */
  authors: z
    .union([
      z.string(),
      z.array(z.string()),
      authorSchema,
      z.array(authorSchema),
    ])
    .optional(),
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
  /**
   * Mark the post as a draft. Draft posts are only shown in development.
   */
  draft: z.boolean().optional(),
  /**
   * Hide the post from listings but keep it accessible via direct URL.
   */
  unlisted: z.boolean().optional(),
  /**
   * Social card/preview image for the post.
   */
  image: z.string().optional(),
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
  /**
   * Whether to show reading time on each post.
   * @default true
   */
  showReadingTime: z.boolean().default(true),
  /**
   * Average words per minute for reading time calculation.
   * @default 200
   */
  readingTimeWordsPerMinute: z.number().int().positive().default(200),
  /**
   * Configuration for RSS/Atom feed generation.
   */
  feedOptions: z
    .object({
      /**
       * Whether to enable RSS/Atom feed generation.
       * @default true
       */
      enabled: z.boolean().default(true),
      /**
       * The title for the feed.
       */
      title: z.string().optional(),
      /**
       * The description for the feed.
       */
      description: z.string().optional(),
      /**
       * Types of feeds to generate.
       * @default ['rss', 'atom']
       */
      types: z.array(z.enum(['rss', 'atom', 'json'])).default(['rss', 'atom']),
      /**
       * Maximum number of items to include in the feed.
       * @default 20
       */
      limit: z.number().int().positive().default(20),
    })
    .default({}),
  /**
   * Configuration for the archive page.
   */
  archiveOptions: z
    .object({
      /**
       * Whether to enable the archive page.
       * @default true
       */
      enabled: z.boolean().default(true),
      /**
       * Path for the archive page.
       * @default 'archive'
       */
      path: z.string().default('archive'),
    })
    .default({}),
  /**
   * Configuration for tag pages.
   */
  tagsOptions: z
    .object({
      /**
       * Whether to enable tag pages.
       * @default true
       */
      enabled: z.boolean().default(true),
      /**
       * Path for the tags index page.
       * @default 'tags'
       */
      path: z.string().default('tags'),
    })
    .default({}),
  /**
   * Truncation marker for blog post excerpts.
   * @default '<!--truncate-->'
   */
  truncateMarker: z.string().default('<!--truncate-->'),
  /**
   * Map of author names to author details.
   * Allows defining authors once and referencing by name in posts.
   */
  authorsMap: z.record(z.string(), authorSchema).optional(),
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

        const hasI18n = !!config.i18n
        const localePrefix = hasI18n ? '/[locale]' : ''

        // Core blog routes
        injectRoute({
          pattern: `${localePrefix}/blog`,
          entrypoint: `@levino/shipyard-blog/astro/BlogIndex.astro`,
        })
        injectRoute({
          pattern: `${localePrefix}/blog/page/[page]`,
          entrypoint: `@levino/shipyard-blog/astro/BlogIndexPaginated.astro`,
        })
        injectRoute({
          pattern: `${localePrefix}/blog/[...slug]`,
          entrypoint: `@levino/shipyard-blog/astro/BlogEntry.astro`,
        })

        // Tags routes
        if (blogConfig.tagsOptions.enabled) {
          injectRoute({
            pattern: `${localePrefix}/blog/${blogConfig.tagsOptions.path}`,
            entrypoint: `@levino/shipyard-blog/astro/BlogTagsIndex.astro`,
          })
          injectRoute({
            pattern: `${localePrefix}/blog/${blogConfig.tagsOptions.path}/[tag]`,
            entrypoint: `@levino/shipyard-blog/astro/BlogTag.astro`,
          })
        }

        // Archive routes
        if (blogConfig.archiveOptions.enabled) {
          injectRoute({
            pattern: `${localePrefix}/blog/${blogConfig.archiveOptions.path}`,
            entrypoint: `@levino/shipyard-blog/astro/BlogArchive.astro`,
          })
        }

        // Feed routes (no i18n prefix for feeds)
        if (blogConfig.feedOptions.enabled) {
          for (const feedType of blogConfig.feedOptions.types) {
            const feedPath =
              feedType === 'rss'
                ? 'rss.xml'
                : feedType === 'atom'
                  ? 'atom.xml'
                  : 'feed.json'
            injectRoute({
              pattern: `/blog/${feedPath}`,
              entrypoint: `@levino/shipyard-blog/astro/BlogFeed.astro`,
              prerender: true,
            })
          }
        }
      },
    },
  }
}
