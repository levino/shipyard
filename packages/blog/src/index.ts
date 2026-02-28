import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
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
   * @example 'news' will mount blog at /news/[...slug]
   */
  routeBasePath: z.string().default('blog'),
  /**
   * The name of the content collection to use.
   * Must match a collection defined in your content.config.ts.
   * @default Same as routeBasePath (e.g., 'blog' or 'news')
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
    .default({}),
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

// ─── Generated File Templates ───────────────────────────────────────────

/**
 * Generate a simple wrapper for components that only need locale-based getStaticPaths.
 * Used for: BlogIndex, BlogTagsIndex, BlogArchive, BlogAuthorsIndex
 */
function generateSimpleWrapper(
  componentImport: string,
  blogConfig: BlogConfig,
  collectionName: string,
  tagsMap: Record<string, unknown>,
  opts?: { authorsCheck?: boolean },
) {
  const configJson = JSON.stringify(blogConfig)
  const tagsJson = JSON.stringify(tagsMap)
  const authorsGuard = opts?.authorsCheck
    ? `
  if (!${JSON.stringify(blogConfig.authorsEnabled)}) return []`
    : ''

  return `---
import { i18n } from 'astro:config/server'
import Component from '${componentImport}'
import type { GetStaticPaths } from 'astro'

export const getStaticPaths = (() => {${authorsGuard}
  if (i18n) {
    return i18n.locales.map((locale) => {
      if (typeof locale !== 'string') {
        throw new Error('shipyard does only support strings as locales.')
      }
      return { params: { locale } }
    })
  } else {
    return [{ params: {} }]
  }
}) satisfies GetStaticPaths

const blogConfig = ${configJson}
const tagsMap = ${tagsJson}
---

<Component _collectionName=${JSON.stringify(collectionName)} _blogConfig={blogConfig} _tagsMap={tagsMap} />
`
}

/**
 * Generate a wrapper for BlogEntry with per-entry getStaticPaths.
 */
function generateBlogEntryWrapper(
  blogConfig: BlogConfig,
  collectionName: string,
  tagsMap: Record<string, unknown>,
) {
  const configJson = JSON.stringify(blogConfig)
  const tagsJson = JSON.stringify(tagsMap)

  return `---
import { i18n } from 'astro:config/server'
import { getCollection } from 'astro:content'
import { computeBlogEntryPaths } from '@levino/shipyard-blog/staticPaths'
import BlogEntry from '@levino/shipyard-blog/astro/BlogEntry.astro'

export const getStaticPaths = async () => {
  const allPosts = await getCollection(${JSON.stringify(collectionName)})
  return computeBlogEntryPaths(allPosts, ${configJson}, i18n)
}

const { entry, older, newer } = Astro.props
const blogConfig = ${configJson}
const tagsMap = ${tagsJson}
---

<BlogEntry
  entry={entry}
  older={older}
  newer={newer}
  _collectionName=${JSON.stringify(collectionName)}
  _blogConfig={blogConfig}
  _tagsMap={tagsMap}
/>
`
}

/**
 * Generate a wrapper for BlogIndexPaginated with pagination-aware getStaticPaths.
 */
function generateBlogPaginatedWrapper(
  blogConfig: BlogConfig,
  collectionName: string,
  tagsMap: Record<string, unknown>,
) {
  const configJson = JSON.stringify(blogConfig)
  const tagsJson = JSON.stringify(tagsMap)

  return `---
import { i18n } from 'astro:config/server'
import { getCollection } from 'astro:content'
import { computeBlogPaginatedPaths } from '@levino/shipyard-blog/staticPaths'
import BlogIndexPaginated from '@levino/shipyard-blog/astro/BlogIndexPaginated.astro'

export const getStaticPaths = async () => {
  const allPosts = await getCollection(${JSON.stringify(collectionName)})
  return computeBlogPaginatedPaths(allPosts, ${configJson}, i18n)
}

const blogConfig = ${configJson}
const tagsMap = ${tagsJson}
---

<BlogIndexPaginated _collectionName=${JSON.stringify(collectionName)} _blogConfig={blogConfig} _tagsMap={tagsMap} />
`
}

/**
 * Generate a wrapper for BlogTagPage with per-tag getStaticPaths.
 */
function generateBlogTagPageWrapper(
  blogConfig: BlogConfig,
  collectionName: string,
  tagsMap: Record<string, unknown>,
) {
  const configJson = JSON.stringify(blogConfig)
  const tagsJson = JSON.stringify(tagsMap)

  return `---
import { i18n } from 'astro:config/server'
import { getCollection } from 'astro:content'
import { computeBlogTagPaths } from '@levino/shipyard-blog/staticPaths'
import BlogTagPage from '@levino/shipyard-blog/astro/BlogTagPage.astro'

export const getStaticPaths = async () => {
  const allPosts = await getCollection(${JSON.stringify(collectionName)})
  return computeBlogTagPaths(allPosts, ${configJson}, i18n)
}

const blogConfig = ${configJson}
const tagsMap = ${tagsJson}
---

<BlogTagPage _collectionName=${JSON.stringify(collectionName)} _blogConfig={blogConfig} _tagsMap={tagsMap} />
`
}

/**
 * Generate a wrapper for BlogAuthorPage with per-author getStaticPaths.
 */
function generateBlogAuthorPageWrapper(
  blogConfig: BlogConfig,
  collectionName: string,
  tagsMap: Record<string, unknown>,
) {
  const configJson = JSON.stringify(blogConfig)
  const tagsJson = JSON.stringify(tagsMap)

  return `---
import { i18n } from 'astro:config/server'
import { getCollection } from 'astro:content'
import { computeBlogAuthorPaths } from '@levino/shipyard-blog/staticPaths'
import BlogAuthorPage from '@levino/shipyard-blog/astro/BlogAuthorPage.astro'

export const getStaticPaths = async () => {
  const allPosts = await getCollection(${JSON.stringify(collectionName)})
  return computeBlogAuthorPaths(allPosts, ${configJson}, i18n)
}

const { author } = Astro.props
const blogConfig = ${configJson}
const tagsMap = ${tagsJson}
---

<BlogAuthorPage author={author} _collectionName=${JSON.stringify(collectionName)} _blogConfig={blogConfig} _tagsMap={tagsMap} />
`
}

/**
 * Generate a feed handler TS file for a specific blog instance.
 */
function generateFeedFile(
  feedType: 'rss' | 'atom' | 'json',
  blogConfig: BlogConfig,
  collectionName: string,
) {
  const configJson = JSON.stringify(blogConfig)
  const feedEnabledKey = feedType === 'json' ? 'json' : feedType
  const contentType =
    feedType === 'rss'
      ? 'application/rss+xml'
      : feedType === 'atom'
        ? 'application/atom+xml'
        : 'application/feed+json'

  if (feedType === 'json') {
    return generateJsonFeedFile(blogConfig, collectionName)
  }

  const isRss = feedType === 'rss'

  return `import { i18n } from 'astro:config/server'
import { getCollection } from 'astro:content'

const blogConfig = ${configJson}
const collectionName = ${JSON.stringify(collectionName)}
const { feedOptions, includeDraftsInDev, blogTitle, blogDescription, routeBasePath } = blogConfig
const { ${feedEnabledKey}: feedEnabled, limit, title: feedTitle, description: feedDescription } = feedOptions

const isDev = import.meta.env.DEV
const shouldIncludePost = (post) => {
  if (post.data.unlisted) return false
  if (post.data.draft && !(isDev && includeDraftsInDev)) return false
  return true
}

export const getStaticPaths = (() => {
  if (!feedEnabled) return []
  if (i18n) {
    return i18n.locales.map((locale) => {
      if (typeof locale !== 'string') throw new Error('shipyard does only support strings as locales.')
      return { params: { locale } }
    })
  }
  return [{ params: {} }]
})

const escapeXml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export const GET = async ({ site, currentLocale }) => {
  if (!feedEnabled) return new Response('Feed disabled', { status: 404 })
  const baseUrl = site?.toString() ?? 'https://example.com'
  const allPosts = await getCollection(collectionName)
  const posts = allPosts
    .filter(shouldIncludePost)
    .filter((post) => {
      if (i18n) { const [pl] = post.id.split('/'); return pl === currentLocale }
      return true
    })
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit)

  const getBlogPostUrl = (post) => {
    if (i18n && currentLocale) {
      const slug = post.id.replace(currentLocale + '/', '')
      return baseUrl + currentLocale + '/' + routeBasePath + '/' + slug
    }
    return baseUrl + routeBasePath + '/' + post.id
  }

  const title = feedTitle ?? blogTitle
  const description = feedDescription ?? blogDescription ?? title + ' Feed'
  const feedUrl = i18n
    ? baseUrl + currentLocale + '/' + routeBasePath + '/${feedType === 'rss' ? 'rss.xml' : 'atom.xml'}'
    : baseUrl + routeBasePath + '/${feedType === 'rss' ? 'rss.xml' : 'atom.xml'}'

${
  isRss
    ? `  const items = posts.map((post) => {
    const postUrl = getBlogPostUrl(post)
    return '    <item>\\n      <title>' + escapeXml(post.data.title) + '</title>\\n      <link>' + escapeXml(postUrl) + '</link>\\n      <description>' + escapeXml(post.data.description) + '</description>\\n      <pubDate>' + post.data.date.toUTCString() + '</pubDate>\\n      <guid>' + escapeXml(postUrl) + '</guid>\\n    </item>'
  })

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\\n  <channel>\\n    <title>' + escapeXml(title) + '</title>\\n    <link>' + escapeXml(baseUrl) + '</link>\\n    <description>' + escapeXml(description) + '</description>\\n    <language>' + (currentLocale ?? 'en') + '</language>\\n    <atom:link href="' + escapeXml(feedUrl) + '" rel="self" type="application/rss+xml"/>\\n    <lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>\\n' + items.join('\\n') + '\\n  </channel>\\n</rss>'
  return new Response(xml, { headers: { 'Content-Type': '${contentType}; charset=utf-8' } })`
    : `  const lastUpdated = posts.length > 0 ? posts[0].data.date.toISOString() : new Date().toISOString()
  const subtitle = feedDescription ?? blogDescription
  const entries = posts.map((post) => {
    const postUrl = getBlogPostUrl(post)
    return '  <entry>\\n    <title>' + escapeXml(post.data.title) + '</title>\\n    <link href="' + escapeXml(postUrl) + '"/>\\n    <id>' + escapeXml(postUrl) + '</id>\\n    <updated>' + post.data.date.toISOString() + '</updated>\\n    <summary>' + escapeXml(post.data.description) + '</summary>\\n  </entry>'
  })

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\\n<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="' + (currentLocale ?? 'en') + '">\\n  <title>' + escapeXml(title) + '</title>\\n  <link href="' + escapeXml(baseUrl) + '"/>\\n  <link href="' + escapeXml(feedUrl) + '" rel="self" type="application/atom+xml"/>\\n  <id>' + escapeXml(baseUrl) + '</id>\\n  <updated>' + lastUpdated + '</updated>\\n  ' + (subtitle ? '<subtitle>' + escapeXml(subtitle) + '</subtitle>' : '') + '\\n' + entries.join('\\n') + '\\n</feed>'
  return new Response(xml, { headers: { 'Content-Type': '${contentType}; charset=utf-8' } })`
}
}
`
}

function generateJsonFeedFile(blogConfig: BlogConfig, collectionName: string) {
  return `import { i18n } from 'astro:config/server'
import { getCollection } from 'astro:content'

const blogConfig = ${JSON.stringify(blogConfig)}
const collectionName = ${JSON.stringify(collectionName)}
const { feedOptions, includeDraftsInDev, blogTitle, blogDescription, routeBasePath } = blogConfig
const { json: feedEnabled, limit, title: feedTitle, description: feedDescription } = feedOptions

const isDev = import.meta.env.DEV
const shouldIncludePost = (post) => {
  if (post.data.unlisted) return false
  if (post.data.draft && !(isDev && includeDraftsInDev)) return false
  return true
}

export const getStaticPaths = (() => {
  if (!feedEnabled) return []
  if (i18n) {
    return i18n.locales.map((locale) => {
      if (typeof locale !== 'string') throw new Error('shipyard does only support strings as locales.')
      return { params: { locale } }
    })
  }
  return [{ params: {} }]
})

export const GET = async ({ site, currentLocale }) => {
  if (!feedEnabled) return new Response('JSON feed disabled', { status: 404 })
  const baseUrl = site?.toString() ?? 'https://example.com'
  const allPosts = await getCollection(collectionName)
  const posts = allPosts
    .filter(shouldIncludePost)
    .filter((post) => {
      if (i18n) { const [pl] = post.id.split('/'); return pl === currentLocale }
      return true
    })
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit)

  const getBlogPostUrl = (post) => {
    if (i18n && currentLocale) {
      const slug = post.id.replace(currentLocale + '/', '')
      return baseUrl + currentLocale + '/' + routeBasePath + '/' + slug
    }
    return baseUrl + routeBasePath + '/' + post.id
  }

  const title = feedTitle ?? blogTitle
  const description = feedDescription ?? blogDescription
  const feedUrl = i18n
    ? baseUrl + currentLocale + '/' + routeBasePath + '/feed.json'
    : baseUrl + routeBasePath + '/feed.json'

  const items = posts.map((post) => {
    const postUrl = getBlogPostUrl(post)
    return {
      id: postUrl,
      url: postUrl,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.date.toISOString(),
      ...(post.data.tags?.length ? { tags: post.data.tags } : {}),
    }
  })

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title,
    home_page_url: baseUrl,
    feed_url: feedUrl,
    ...(description ? { description } : {}),
    language: currentLocale ?? 'en',
    items,
  }

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  })
}
`
}

// ─── Integration Export ─────────────────────────────────────────────────

export default (options: Partial<BlogConfig> = {}): AstroIntegration => {
  // Parse and validate config
  const blogConfig = blogConfigSchema.parse(options)

  // Resolve collection name (defaults to routeBasePath)
  const resolvedCollectionName =
    blogConfig.collectionName ?? blogConfig.routeBasePath

  // Normalize the route base path
  let normalizedBasePath = blogConfig.routeBasePath
  while (normalizedBasePath.startsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(1)
  }
  while (normalizedBasePath.endsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(0, -1)
  }

  // Load tags map if path is provided
  let tagsMap: Record<string, unknown> = {}

  return {
    name: `shipyard-blog${normalizedBasePath !== 'blog' ? `-${normalizedBasePath}` : ''}`,
    hooks: {
      'astro:config:setup': ({ injectRoute, config, updateConfig }) => {
        // Load tags map now (at config setup time)
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

        // Add a vite plugin to provide the config via a virtual module
        // Keep backward-compatible module IDs for single-instance usage
        updateConfig({
          vite: {
            plugins: [
              {
                name: `shipyard-blog-config-${normalizedBasePath}`,
                resolveId(id) {
                  if (id === VIRTUAL_MODULE_ID) {
                    return RESOLVED_VIRTUAL_MODULE_ID
                  }
                  if (id === VIRTUAL_TAGS_MODULE_ID) {
                    return RESOLVED_VIRTUAL_TAGS_MODULE_ID
                  }
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                    return `export default ${JSON.stringify(blogConfig)}`
                  }
                  if (id === RESOLVED_VIRTUAL_TAGS_MODULE_ID) {
                    return `export default ${JSON.stringify(tagsMap)}`
                  }
                },
              },
            ],
          },
        })

        // Create generated entry files for this specific blog instance
        // This ensures each instance has its own getStaticPaths that only returns its own paths
        const generatedDir = join(
          config.root?.pathname || process.cwd(),
          'node_modules',
          '.shipyard-blog',
        )

        if (!existsSync(generatedDir)) {
          mkdirSync(generatedDir, { recursive: true })
        }

        // Helper to write a generated file
        const writeGenerated = (filename: string, content: string) => {
          const filePath = join(generatedDir, filename)
          writeFileSync(filePath, content, 'utf-8')
          return filePath
        }

        const basePath = normalizedBasePath
        const suffix = normalizedBasePath

        // Generate all entry files for this instance
        const blogIndexFile = writeGenerated(
          `BlogIndex-${suffix}.astro`,
          generateSimpleWrapper(
            '@levino/shipyard-blog/astro/BlogIndex.astro',
            blogConfig,
            resolvedCollectionName,
            tagsMap,
          ),
        )

        const blogPaginatedFile = writeGenerated(
          `BlogIndexPaginated-${suffix}.astro`,
          generateBlogPaginatedWrapper(
            blogConfig,
            resolvedCollectionName,
            tagsMap,
          ),
        )

        const blogEntryFile = writeGenerated(
          `BlogEntry-${suffix}.astro`,
          generateBlogEntryWrapper(blogConfig, resolvedCollectionName, tagsMap),
        )

        const blogTagsIndexFile = writeGenerated(
          `BlogTagsIndex-${suffix}.astro`,
          generateSimpleWrapper(
            '@levino/shipyard-blog/astro/BlogTagsIndex.astro',
            blogConfig,
            resolvedCollectionName,
            tagsMap,
          ),
        )

        const blogTagPageFile = writeGenerated(
          `BlogTagPage-${suffix}.astro`,
          generateBlogTagPageWrapper(
            blogConfig,
            resolvedCollectionName,
            tagsMap,
          ),
        )

        const blogArchiveFile = writeGenerated(
          `BlogArchive-${suffix}.astro`,
          generateSimpleWrapper(
            '@levino/shipyard-blog/astro/BlogArchive.astro',
            blogConfig,
            resolvedCollectionName,
            tagsMap,
          ),
        )

        const blogAuthorsIndexFile = writeGenerated(
          `BlogAuthorsIndex-${suffix}.astro`,
          generateSimpleWrapper(
            '@levino/shipyard-blog/astro/BlogAuthorsIndex.astro',
            blogConfig,
            resolvedCollectionName,
            tagsMap,
            { authorsCheck: true },
          ),
        )

        const blogAuthorPageFile = writeGenerated(
          `BlogAuthorPage-${suffix}.astro`,
          generateBlogAuthorPageWrapper(
            blogConfig,
            resolvedCollectionName,
            tagsMap,
          ),
        )

        // Inject routes pointing to generated files
        if (config.i18n) {
          injectRoute({
            pattern: `/[locale]/${basePath}`,
            entrypoint: blogIndexFile,
          })
          injectRoute({
            pattern: `/[locale]/${basePath}/page/[page]`,
            entrypoint: blogPaginatedFile,
          })
          injectRoute({
            pattern: `/[locale]/${basePath}/tags`,
            entrypoint: blogTagsIndexFile,
          })
          injectRoute({
            pattern: `/[locale]/${basePath}/tags/[tag]`,
            entrypoint: blogTagPageFile,
          })
          if (blogConfig.archiveEnabled) {
            injectRoute({
              pattern: `/[locale]/${basePath}/archive`,
              entrypoint: blogArchiveFile,
            })
          }
          if (blogConfig.authorsEnabled) {
            injectRoute({
              pattern: `/[locale]/${basePath}/authors`,
              entrypoint: blogAuthorsIndexFile,
            })
            injectRoute({
              pattern: `/[locale]/${basePath}/authors/[author]`,
              entrypoint: blogAuthorPageFile,
            })
          }
          injectRoute({
            pattern: `/[locale]/${basePath}/[...slug]`,
            entrypoint: blogEntryFile,
          })
        } else {
          injectRoute({
            pattern: `/${basePath}`,
            entrypoint: blogIndexFile,
          })
          injectRoute({
            pattern: `/${basePath}/page/[page]`,
            entrypoint: blogPaginatedFile,
          })
          injectRoute({
            pattern: `/${basePath}/tags`,
            entrypoint: blogTagsIndexFile,
          })
          injectRoute({
            pattern: `/${basePath}/tags/[tag]`,
            entrypoint: blogTagPageFile,
          })
          if (blogConfig.archiveEnabled) {
            injectRoute({
              pattern: `/${basePath}/archive`,
              entrypoint: blogArchiveFile,
            })
          }
          if (blogConfig.authorsEnabled) {
            injectRoute({
              pattern: `/${basePath}/authors`,
              entrypoint: blogAuthorsIndexFile,
            })
            injectRoute({
              pattern: `/${basePath}/authors/[author]`,
              entrypoint: blogAuthorPageFile,
            })
          }
          injectRoute({
            pattern: `/${basePath}/[...slug]`,
            entrypoint: blogEntryFile,
          })
        }

        // Inject feed routes if enabled (generated per-instance)
        const { feedOptions } = blogConfig
        if (feedOptions.rss || feedOptions.atom || feedOptions.json) {
          if (feedOptions.rss) {
            const rssFile = writeGenerated(
              `rss-${suffix}.xml.ts`,
              generateFeedFile('rss', blogConfig, resolvedCollectionName),
            )
            if (config.i18n) {
              injectRoute({
                pattern: `/[locale]/${basePath}/rss.xml`,
                entrypoint: rssFile,
              })
            } else {
              injectRoute({
                pattern: `/${basePath}/rss.xml`,
                entrypoint: rssFile,
              })
            }
          }

          if (feedOptions.atom) {
            const atomFile = writeGenerated(
              `atom-${suffix}.xml.ts`,
              generateFeedFile('atom', blogConfig, resolvedCollectionName),
            )
            if (config.i18n) {
              injectRoute({
                pattern: `/[locale]/${basePath}/atom.xml`,
                entrypoint: atomFile,
              })
            } else {
              injectRoute({
                pattern: `/${basePath}/atom.xml`,
                entrypoint: atomFile,
              })
            }
          }

          if (feedOptions.json) {
            const jsonFeedFile = writeGenerated(
              `feed-${suffix}.json.ts`,
              generateFeedFile('json', blogConfig, resolvedCollectionName),
            )
            if (config.i18n) {
              injectRoute({
                pattern: `/[locale]/${basePath}/feed.json`,
                entrypoint: jsonFeedFile,
              })
            } else {
              injectRoute({
                pattern: `/${basePath}/feed.json`,
                entrypoint: jsonFeedFile,
              })
            }
          }
        }
      },
    },
  }
}
