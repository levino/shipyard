import { existsSync, readFileSync } from 'node:fs'
import type { AstroIntegration } from 'astro'
import { z } from 'astro/zod'
import { parse as parseYaml } from 'yaml'

// Re-export git metadata utilities
export type { GitMetadata } from './gitMetadata'
export { getEditUrl, getGitMetadata } from './gitMetadata'
// Re-export reading time utilities
export type { ReadingTime } from './readingTime'
export { getReadingTime } from './readingTime'
// Re-export tag utilities
export type { TagsMap } from './tags'
export {
  getTagDescription,
  getTagLabel,
  getTagMetadata,
  getTagPermalink,
  loadTagsMap,
} from './tags'

/**
 * Schema for inline author definition in frontmatter.
 */
export const authorSchema = z.object({
  /**
   * Author's display name.
   */
  name: z.string(),
  /**
   * Author's job title or role.
   */
  title: z.string().optional(),
  /**
   * URL to author's profile or website.
   */
  url: z.string().url().optional(),
  /**
   * URL to author's avatar image.
   */
  image_url: z.string().optional(),
  /**
   * Author's email address.
   */
  email: z.string().email().optional(),
})

export type Author = z.infer<typeof authorSchema>

/**
 * Schema for tag definition in tags.yml file.
 */
export const tagSchema = z.object({
  /**
   * Display label for the tag. If not provided, uses the tag key.
   */
  label: z.string().optional(),
  /**
   * Description of the tag for the tag page.
   */
  description: z.string().optional(),
  /**
   * Custom permalink for the tag. If not provided, uses the tag key.
   */
  permalink: z.string().optional(),
})

export type Tag = z.infer<typeof tagSchema>

export const blogSchema = ({ image }: { image: () => z.ZodType }) =>
  z.object({
    date: z.date(),
    title: z.string(),
    /**
     * SEO title override for the page's <title> and meta tags.
     * If not provided, uses the title field.
     */
    title_meta: z.string().optional(),
    description: z.string(),
    /**
     * Post author(s). Can be:
     * - A string referencing an author from authors.yml
     * - An inline author object
     * - An array of author references or objects
     */
    authors: z
      .union([
        z.string(),
        authorSchema,
        z.array(z.union([z.string(), authorSchema])),
      ])
      .optional(),
    /**
     * Post tags for categorization.
     */
    tags: z.array(z.string()).optional(),
    /**
     * Image for the post. Use a relative path to a local image file.
     */
    image: image().optional(),
    /**
     * SEO keywords for the post.
     */
    keywords: z.array(z.string()).optional(),
    /**
     * Custom URL slug for the post.
     */
    slug: z.string().optional(),
    /**
     * Mark post as draft (excluded from production builds).
     */
    draft: z.boolean().default(false),
    /**
     * Mark post as unlisted (accessible but hidden from listings).
     */
    unlisted: z.boolean().default(false),
    /**
     * Hide the table of contents for this post.
     */
    hide_table_of_contents: z.boolean().default(false),
    /**
     * Sidebar configuration for this blog post.
     */
    sidebar: z
      .object({
        /**
         * Custom label for this post in the blog sidebar.
         * If not provided, uses the title.
         */
        label: z.string().optional(),
      })
      .default({}),
    /**
     * Minimum heading level to include in table of contents.
     * @default 2
     */
    toc_min_heading_level: z.number().int().min(1).max(6).default(2),
    /**
     * Maximum heading level to include in table of contents.
     * @default 3
     */
    toc_max_heading_level: z.number().int().min(1).max(6).default(3),
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
     * Custom canonical URL for this post.
     * Useful when content is duplicated or when migrating URLs.
     */
    canonical_url: z.string().optional(),
  })

export const blogConfigSchema = z.object({
  /**
   * The base path where blog routes will be mounted.
   * @default 'blog'
   * @example 'blog' will mount at /blog/[...slug]
   * @example 'news' will mount at /news/[...slug]
   */
  routeBasePath: z.string().default('blog'),
  /**
   * The name of the content collection to use.
   * Must match a collection defined in your content.config.ts.
   * Defaults to the routeBasePath if not specified.
   * @example 'blog' for a collection named 'blog'
   */
  collectionName: z.string().optional(),
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
   * Whether to show reading time on blog posts.
   * @default true
   */
  showReadingTime: z.boolean().default(true),
  /**
   * Blog title displayed on the blog index.
   */
  blogTitle: z.string().default('Blog'),
  /**
   * Blog description for SEO.
   */
  blogDescription: z.string().optional(),
  /**
   * Path to authors.yml file for global author definitions.
   * @example './blog/authors.yml'
   */
  authorsMapPath: z.string().optional(),
  /**
   * Path to tags.yml file for global tag definitions.
   * Tags can have labels, descriptions, and custom permalinks.
   * @example './blog/tags.yml'
   */
  tagsMapPath: z.string().optional(),
  /**
   * Whether to generate RSS/Atom/JSON feeds.
   * @default true
   */
  feedOptions: z
    .object({
      /**
       * Generate RSS 2.0 feed.
       * @default true
       */
      rss: z.boolean().default(true),
      /**
       * Generate Atom feed.
       * @default true
       */
      atom: z.boolean().default(true),
      /**
       * Generate JSON feed.
       * @default true
       */
      json: z.boolean().default(true),
      /**
       * Maximum number of items in feed.
       * @default 20
       */
      limit: z.number().int().positive().default(20),
      /**
       * Custom feed title.
       */
      title: z.string().optional(),
      /**
       * Custom feed description.
       */
      description: z.string().optional(),
    })
    .default({ rss: true, atom: true, json: true, limit: 20 }),
  /**
   * Truncation marker for post excerpts.
   * Content before this marker is used as the excerpt.
   * @default '<!--truncate-->'
   */
  truncateMarker: z.string().default('<!--truncate-->'),
  /**
   * Whether to create archive pages by year.
   * @default true
   */
  archiveEnabled: z.boolean().default(true),
  /**
   * Whether to include draft posts in development.
   * @default true
   */
  includeDraftsInDev: z.boolean().default(true),
  /**
   * Whether to generate author pages.
   * @default true
   */
  authorsEnabled: z.boolean().default(true),
})

export type BlogConfig = z.infer<typeof blogConfigSchema>

const VIRTUAL_MODULE_ID = 'virtual:shipyard-blog/config'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`
const VIRTUAL_TAGS_MODULE_ID = 'virtual:shipyard-blog/tags'
const RESOLVED_VIRTUAL_TAGS_MODULE_ID = `\0${VIRTUAL_TAGS_MODULE_ID}`
const VIRTUAL_REGISTRY_ID = 'virtual:shipyard-blog/registry'
const RESOLVED_VIRTUAL_REGISTRY_ID = `\0${VIRTUAL_REGISTRY_ID}`

const blogRegistry: Record<
  string,
  {
    blogConfig: BlogConfig
    tagsMap: Record<string, unknown>
    collectionName: string
  }
> = {}

export default (options: Partial<BlogConfig> = {}): AstroIntegration => {
  const blogConfig = blogConfigSchema.parse(options)

  let normalizedBasePath = blogConfig.routeBasePath
  while (normalizedBasePath.startsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(1)
  }
  while (normalizedBasePath.endsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(0, -1)
  }

  const resolvedCollectionName = blogConfig.collectionName ?? normalizedBasePath

  let tagsMap: Record<string, unknown> = {}

  return {
    name: `shipyard-blog-${normalizedBasePath}`,
    hooks: {
      'astro:config:setup': ({ injectRoute, config, updateConfig }) => {
        if (blogConfig.tagsMapPath) {
          try {
            const resolvedPath = blogConfig.tagsMapPath.startsWith('/')
              ? blogConfig.tagsMapPath
              : `${process.cwd()}/${blogConfig.tagsMapPath}`

            if (existsSync(resolvedPath)) {
              const fileContent = readFileSync(resolvedPath, 'utf-8')
              const rawData = parseYaml(fileContent)

              if (rawData && typeof rawData === 'object') {
                for (const [key, value] of Object.entries(rawData)) {
                  const result = tagSchema.safeParse(value)
                  if (result.success) {
                    tagsMap[key.toLowerCase()] = result.data
                  }
                }
              }
            }
          } catch {
            tagsMap = {}
          }
        }

        blogRegistry[normalizedBasePath] = {
          blogConfig,
          tagsMap,
          collectionName: resolvedCollectionName,
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: `shipyard-blog-config-${normalizedBasePath}`,
                resolveId(id) {
                  if (id === VIRTUAL_REGISTRY_ID)
                    return RESOLVED_VIRTUAL_REGISTRY_ID
                  if (id === VIRTUAL_MODULE_ID)
                    return RESOLVED_VIRTUAL_MODULE_ID
                  if (id === VIRTUAL_TAGS_MODULE_ID)
                    return RESOLVED_VIRTUAL_TAGS_MODULE_ID
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_REGISTRY_ID)
                    return `export default ${JSON.stringify(blogRegistry)}`
                  if (id === RESOLVED_VIRTUAL_MODULE_ID)
                    return `export default ${JSON.stringify(blogConfig)}`
                  if (id === RESOLVED_VIRTUAL_TAGS_MODULE_ID)
                    return `export default ${JSON.stringify(tagsMap)}`
                },
              },
            ],
          },
        })

        const basePath = normalizedBasePath
        const pageBase = '@levino/shipyard-blog/astro/pages'

        if (config.i18n) {
          injectRoute({
            pattern: `/[locale]/${basePath}`,
            entrypoint: `${pageBase}/BlogIndex.astro`,
          })
          injectRoute({
            pattern: `/[locale]/${basePath}/page/[page]`,
            entrypoint: `${pageBase}/BlogIndexPaginated.astro`,
          })
          injectRoute({
            pattern: `/[locale]/${basePath}/tags`,
            entrypoint: `${pageBase}/BlogTagsIndex.astro`,
          })
          injectRoute({
            pattern: `/[locale]/${basePath}/tags/[tag]`,
            entrypoint: `${pageBase}/BlogTagPage.astro`,
          })
          if (blogConfig.archiveEnabled) {
            injectRoute({
              pattern: `/[locale]/${basePath}/archive`,
              entrypoint: `${pageBase}/BlogArchive.astro`,
            })
          }
          if (blogConfig.authorsEnabled) {
            injectRoute({
              pattern: `/[locale]/${basePath}/authors`,
              entrypoint: `${pageBase}/BlogAuthorsIndex.astro`,
            })
            injectRoute({
              pattern: `/[locale]/${basePath}/authors/[author]`,
              entrypoint: `${pageBase}/BlogAuthorPage.astro`,
            })
          }
          injectRoute({
            pattern: `/[locale]/${basePath}/[...slug]`,
            entrypoint: `${pageBase}/BlogEntry.astro`,
          })
        } else {
          injectRoute({
            pattern: `/${basePath}`,
            entrypoint: `${pageBase}/BlogIndex.astro`,
          })
          injectRoute({
            pattern: `/${basePath}/page/[page]`,
            entrypoint: `${pageBase}/BlogIndexPaginated.astro`,
          })
          injectRoute({
            pattern: `/${basePath}/tags`,
            entrypoint: `${pageBase}/BlogTagsIndex.astro`,
          })
          injectRoute({
            pattern: `/${basePath}/tags/[tag]`,
            entrypoint: `${pageBase}/BlogTagPage.astro`,
          })
          if (blogConfig.archiveEnabled) {
            injectRoute({
              pattern: `/${basePath}/archive`,
              entrypoint: `${pageBase}/BlogArchive.astro`,
            })
          }
          if (blogConfig.authorsEnabled) {
            injectRoute({
              pattern: `/${basePath}/authors`,
              entrypoint: `${pageBase}/BlogAuthorsIndex.astro`,
            })
            injectRoute({
              pattern: `/${basePath}/authors/[author]`,
              entrypoint: `${pageBase}/BlogAuthorPage.astro`,
            })
          }
          injectRoute({
            pattern: `/${basePath}/[...slug]`,
            entrypoint: `${pageBase}/BlogEntry.astro`,
          })
        }

        const { feedOptions } = blogConfig
        if (feedOptions.rss) {
          injectRoute({
            pattern: config.i18n
              ? `/[locale]/${basePath}/rss.xml`
              : `/${basePath}/rss.xml`,
            entrypoint: `${pageBase}/feeds/rss.xml.ts`,
          })
        }
        if (feedOptions.atom) {
          injectRoute({
            pattern: config.i18n
              ? `/[locale]/${basePath}/atom.xml`
              : `/${basePath}/atom.xml`,
            entrypoint: `${pageBase}/feeds/atom.xml.ts`,
          })
        }
        if (feedOptions.json) {
          injectRoute({
            pattern: config.i18n
              ? `/[locale]/${basePath}/feed.json`
              : `/${basePath}/feed.json`,
            entrypoint: `${pageBase}/feeds/feed.json.ts`,
          })
        }
      },
    },
  }
}
