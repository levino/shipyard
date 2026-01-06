import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AstroIntegration } from 'astro'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Re-export fallback utilities
export { extractFirstParagraph } from './fallbacks'
// Re-export git metadata utilities
export type { GitMetadata } from './gitMetadata'
export { getEditUrl, getGitMetadata } from './gitMetadata'
// Re-export llms.txt utilities
export type { LlmsDocEntry, LlmsTxtConfig } from './llmsTxt'
export { generateLlmsFullTxt, generateLlmsTxt } from './llmsTxt'
// Re-export pagination types and utilities
export type { PaginationInfo, PaginationLink } from './pagination'
export { getPaginationInfo } from './pagination'
export type { DocsRouteConfig } from './routeHelpers'
// Re-export route helpers
export { getDocPath, getRouteParams } from './routeHelpers'
// Re-export types and utilities from sidebarEntries
export type { DocsData } from './sidebarEntries'
export { toSidebarEntries } from './sidebarEntries'

/**
 * Schema for sidebar configuration grouped under a single object.
 * Contains all sidebar-related fields for categories and pages.
 */
const sidebarSchema = z
  .object({
    /** Sort order in sidebar (default: Infinity - sorted alphabetically after positioned items) */
    position: z.number().optional(),
    /** Display label in sidebar (default: title -> H1 -> filename) */
    label: z.string().optional(),
    /** CSS class(es) for styling the sidebar entry */
    className: z.string().optional(),
    /** Arbitrary metadata for custom sidebar components */
    customProps: z.record(z.any()).optional(),
    /** Can category be collapsed (default: true) */
    collapsible: z.boolean().default(true),
    /** Start collapsed (default: true) */
    collapsed: z.boolean().default(true),
  })
  .refine((data) => !(data.collapsed === true && data.collapsible === false), {
    message:
      'sidebar.collapsed cannot be true when sidebar.collapsible is false',
  })

export const docsSchema = z
  .object({
    // === Page Metadata ===
    /** Custom document ID (default: file path) */
    id: z.string().optional(),
    /** Reference title for SEO, pagination, previews (default: H1) */
    title: z.string().optional(),
    /** Override title for SEO/browser tab (default: title) - Docusaurus snake_case convention */
    title_meta: z.string().optional(),
    /** Meta description (default: first paragraph) */
    description: z.string().optional(),
    /** SEO keywords */
    keywords: z.array(z.string()).optional(),
    /** Social preview image (og:image) */
    image: z.string().optional(),
    /** Custom canonical URL */
    canonicalUrl: z.string().optional(),
    /** Custom canonical URL - snake_case alias for Docusaurus compatibility */
    canonical_url: z.string().optional(),

    // === Page Rendering ===
    /** Whether to render a page (default: true) */
    render: z.boolean().default(true),
    /** Exclude from production builds (default: false) */
    draft: z.boolean().default(false),
    /** Render page but hide from sidebar (default: false) */
    unlisted: z.boolean().default(false),
    /** Custom URL slug */
    slug: z.string().optional(),

    // === Layout Options ===
    /** Hide the H1 heading (default: false) */
    hideTitle: z.boolean().default(false),
    /** Hide the H1 heading (default: false) - snake_case alias for Docusaurus compatibility */
    hide_title: z.boolean().optional(),
    /** Hide the TOC (default: false) */
    hideTableOfContents: z.boolean().default(false),
    /** Hide the TOC (default: false) - snake_case alias for Docusaurus compatibility */
    hide_table_of_contents: z.boolean().optional(),
    /** Full-width page without sidebar (default: false) */
    hideSidebar: z.boolean().default(false),
    /** Min heading level in TOC (default: 2) */
    tocMinHeadingLevel: z.number().min(1).max(6).default(2),
    /** Max heading level in TOC (default: 3) */
    tocMaxHeadingLevel: z.number().min(1).max(6).default(3),

    // === Sidebar Configuration (grouped) ===
    sidebar: sidebarSchema.default({ collapsible: true, collapsed: true }),

    // === Sidebar Configuration (Docusaurus snake_case aliases) ===
    /** Sort order in sidebar - snake_case alias for Docusaurus compatibility */
    sidebar_position: z.number().optional(),
    /** Display label in sidebar - snake_case alias for Docusaurus compatibility */
    sidebar_label: z.string().optional(),
    /** CSS class(es) for styling - snake_case alias for Docusaurus compatibility */
    sidebar_class_name: z.string().optional(),
    /** Custom props for sidebar entry - snake_case alias for Docusaurus compatibility */
    sidebar_custom_props: z.record(z.any()).optional(),

    // === Pagination ===
    /** Label shown in prev/next buttons */
    paginationLabel: z.string().optional(),
    /** Label shown in prev/next buttons - snake_case alias for Docusaurus compatibility */
    pagination_label: z.string().optional(),
    /** Next page ID, or null to disable */
    paginationNext: z.string().nullable().optional(),
    /** Next page ID - snake_case alias for Docusaurus compatibility */
    pagination_next: z.string().nullable().optional(),
    /** Previous page ID, or null to disable */
    paginationPrev: z.string().nullable().optional(),
    /** Previous page ID - snake_case alias for Docusaurus compatibility */
    pagination_prev: z.string().nullable().optional(),

    // === Git Metadata Overrides ===
    /**
     * Override the last update author for this specific page.
     * Set to false to hide the author for this page.
     */
    lastUpdateAuthor: z.union([z.string(), z.literal(false)]).optional(),
    /**
     * Override the last update timestamp for this specific page.
     * Set to false to hide the timestamp for this page.
     */
    lastUpdateTime: z.union([z.literal(false), z.coerce.date()]).optional(),
    /**
     * Custom edit URL for this specific page.
     * Set to null to disable edit link for this page.
     */
    customEditUrl: z.string().nullable().optional(),

    // === Custom Meta Tags ===
    customMetaTags: z
      .array(
        z.object({
          name: z.string().optional(),
          property: z.string().optional(),
          content: z.string(),
        }),
      )
      .optional(),
    /** Custom meta tags - snake_case alias for Docusaurus compatibility */
    custom_meta_tags: z
      .array(
        z.object({
          name: z.string().optional(),
          property: z.string().optional(),
          content: z.string(),
        }),
      )
      .optional(),
  })
  .transform((data) => ({
    ...data,
    // Merge snake_case aliases into camelCase fields
    hideTitle: data.hide_title ?? data.hideTitle,
    hideTableOfContents:
      data.hide_table_of_contents ?? data.hideTableOfContents,
    canonicalUrl: data.canonical_url ?? data.canonicalUrl,
    customMetaTags: data.custom_meta_tags ?? data.customMetaTags,
    paginationLabel: data.pagination_label ?? data.paginationLabel,
    // For nullable fields, we need to check if the snake_case key exists (not just use ??)
    // because null ?? undefined = undefined, but we want null to be preserved
    paginationNext:
      'pagination_next' in data ? data.pagination_next : data.paginationNext,
    paginationPrev:
      'pagination_prev' in data ? data.pagination_prev : data.paginationPrev,
    // Merge snake_case sidebar aliases into sidebar object
    sidebar: {
      ...data.sidebar,
      position: data.sidebar_position ?? data.sidebar.position,
      label: data.sidebar_label ?? data.sidebar.label,
      className: data.sidebar_class_name ?? data.sidebar.className,
      customProps: data.sidebar_custom_props ?? data.sidebar.customProps,
    },
  }))
  .refine((data) => data.tocMinHeadingLevel <= data.tocMaxHeadingLevel, {
    message: 'tocMinHeadingLevel must be <= tocMaxHeadingLevel',
  })

/**
 * Configuration for llms.txt generation.
 * When enabled, generates llms.txt and llms-full.txt files following
 * the specification at https://llmstxt.org/
 */
export interface LlmsTxtDocsConfig {
  /**
   * Whether to enable llms.txt generation.
   * @default false
   */
  enabled?: boolean
  /**
   * The project name to use as the H1 heading in llms.txt.
   * If not provided, will need to be set for the file to be useful.
   */
  projectName?: string
  /**
   * A concise summary of the project displayed as a blockquote.
   * This should help LLMs quickly understand what the project is about.
   */
  summary?: string
  /**
   * Optional additional description paragraphs.
   * Displayed after the summary blockquote.
   */
  description?: string
  /**
   * Custom section title for the documentation links.
   * @default 'Documentation'
   */
  sectionTitle?: string
}

/**
 * Configuration for a docs instance.
 */
export interface DocsConfig {
  /**
   * The base path where docs routes will be mounted.
   * @default 'docs'
   * @example 'guides' will mount docs at /guides/[...slug]
   */
  routeBasePath?: string
  /**
   * The name of the content collection to use.
   * Must match a collection defined in your content.config.ts.
   * @default Same as routeBasePath (e.g., 'docs' or 'guides')
   */
  collectionName?: string
  /**
   * The base URL for "Edit this page" links.
   * This should point to the directory containing your docs in your repository.
   * @example 'https://github.com/user/repo/edit/main/docs'
   */
  editUrl?: string
  /**
   * Whether to show the last update timestamp on each page.
   * Uses git history to determine when the file was last modified.
   * @default false
   */
  showLastUpdateTime?: boolean
  /**
   * Whether to show the last update author on each page.
   * Uses git history to determine who last modified the file.
   * @default false
   */
  showLastUpdateAuthor?: boolean
  /**
   * Configuration for llms.txt generation.
   * Enables automatic generation of llms.txt and llms-full.txt files
   * that help LLMs understand and index your documentation.
   *
   * @example
   * ```ts
   * shipyardDocs({
   *   llmsTxt: {
   *     enabled: true,
   *     projectName: 'My Project',
   *     summary: 'A framework for building amazing apps',
   *   }
   * })
   * ```
   */
  llmsTxt?: LlmsTxtDocsConfig
}

/**
 * Helper function to create a docs content collection configuration.
 * Use this in your content.config.ts to define docs collections.
 *
 * @param basePath - The base directory path where markdown files are located (relative to project root)
 * @param pattern - Optional glob pattern to match files (defaults to '**\/*.md')
 * @returns A loader and schema configuration for use with defineCollection
 *
 * @example
 * ```ts
 * import { defineCollection } from 'astro:content'
 * import { createDocsCollection } from '@levino/shipyard-docs'
 *
 * const docs = defineCollection(createDocsCollection('./docs'))
 * const guides = defineCollection(createDocsCollection('./guides'))
 *
 * export const collections = { docs, guides }
 * ```
 */
export const createDocsCollection = (
  basePath: string,
  pattern: string = '**/*.md',
) => ({
  schema: docsSchema,
  loader: glob({ pattern, base: basePath }),
})

/**
 * shipyard Docs integration for Astro.
 *
 * Supports multiple documentation instances with configurable route mounting.
 *
 * @param config - Optional configuration for the docs instance
 * @returns An Astro integration
 *
 * @example
 * ```ts
 * // Single docs instance (default)
 * shipyardDocs()
 *
 * // Custom route path
 * shipyardDocs({ routeBasePath: 'guides' })
 *
 * // Multiple docs instances (requires custom route files - see documentation)
 * shipyardDocs({ routeBasePath: 'docs' })
 * shipyardDocs({ routeBasePath: 'guides' })
 * ```
 */
// Store all docs configurations keyed by routeBasePath
// This allows DocsEntry.astro to look up config based on the current route
const VIRTUAL_MODULE_ID = 'virtual:shipyard-docs-configs'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

// Global registry to collect configs from multiple docs plugin instances
const docsConfigs: Record<
  string,
  {
    editUrl?: string
    showLastUpdateTime: boolean
    showLastUpdateAuthor: boolean
    routeBasePath: string
    collectionName: string
    llmsTxtEnabled: boolean
  }
> = {}

export default (config: DocsConfig = {}): AstroIntegration => {
  const {
    routeBasePath = 'docs',
    collectionName,
    editUrl,
    showLastUpdateTime = false,
    showLastUpdateAuthor = false,
    llmsTxt,
  } = config

  // Normalize the route base path (remove leading/trailing slashes safely)
  let normalizedBasePath = routeBasePath
  while (normalizedBasePath.startsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(1)
  }
  while (normalizedBasePath.endsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(0, -1)
  }

  // Collection name defaults to the route base path
  const resolvedCollectionName = collectionName ?? normalizedBasePath

  // Register this config in the global registry
  docsConfigs[normalizedBasePath] = {
    editUrl,
    showLastUpdateTime,
    showLastUpdateAuthor,
    routeBasePath: normalizedBasePath,
    collectionName: resolvedCollectionName,
    llmsTxtEnabled: !!llmsTxt?.enabled,
  }

  // Virtual module for this specific route's config
  const routeConfigVirtualId = `virtual:shipyard-docs-config-${normalizedBasePath}`
  const resolvedRouteConfigVirtualId = `\0${routeConfigVirtualId}`

  return {
    name: `shipyard-docs${normalizedBasePath !== 'docs' ? `-${normalizedBasePath}` : ''}`,
    hooks: {
      'astro:config:setup': ({
        injectRoute,
        config: astroConfig,
        updateConfig,
      }) => {
        // Create a generated entry file for this specific docs instance
        // This ensures each route has its own getStaticPaths that only returns its own paths
        const generatedDir = join(
          astroConfig.root?.pathname || process.cwd(),
          'node_modules',
          '.shipyard-docs',
        )

        if (!existsSync(generatedDir)) {
          mkdirSync(generatedDir, { recursive: true })
        }

        const entryFileName = `DocsEntry-${normalizedBasePath}.astro`
        const entryFilePath = join(generatedDir, entryFileName)

        // Generate the entry file with the correct routeBasePath and collectionName
        // Note: We inline the values directly in getStaticPaths because Astro's compiler
        // hoists getStaticPaths to a separate module context where top-level constants aren't available
        const entryFileContent = `---
import { i18n } from 'astro:config/server'
import { getCollection, render } from 'astro:content'
import { docsConfigs } from 'virtual:shipyard-docs-configs'
import { getEditUrl, getGitMetadata } from '@levino/shipyard-docs'
import Layout from '@levino/shipyard-docs/astro/Layout.astro'

export async function getStaticPaths() {
  const collectionName = ${JSON.stringify(resolvedCollectionName)}
  const routeBasePath = ${JSON.stringify(normalizedBasePath)}
  const allDocs = await getCollection(collectionName)

  // Filter out pages with render: false - they should not generate pages
  const docs = allDocs.filter((doc) => doc.data.render !== false)

  const getParams = (slug) => {
    if (i18n) {
      const [locale, ...rest] = slug.split('/')
      return {
        slug: rest.length ? rest.join('/') : undefined,
        locale,
      }
    } else {
      return {
        slug: slug || undefined,
      }
    }
  }

  return docs.map((entry) => ({
    params: getParams(entry.id),
    props: { entry, routeBasePath },
  }))
}

const { entry, routeBasePath } = Astro.props

const docsConfig = docsConfigs[routeBasePath] ?? {
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
  routeBasePath: 'docs',
  collectionName: 'docs',
}

const { Content, headings } = await render(entry)

const { customEditUrl, lastUpdateAuthor, lastUpdateTime, hideTableOfContents, hideTitle, keywords, image, canonicalUrl, customMetaTags, title_meta: titleMeta } = entry.data

let editUrl
if (customEditUrl === null) {
  editUrl = undefined
} else if (customEditUrl) {
  editUrl = customEditUrl
} else {
  editUrl = getEditUrl(docsConfig.editUrl, entry.id)
}

let lastUpdated
let lastAuthor

if (
  (docsConfig.showLastUpdateTime && lastUpdateTime !== false) ||
  (docsConfig.showLastUpdateAuthor && lastUpdateAuthor !== false)
) {
  const filePath = entry.filePath

  if (filePath) {
    const gitMetadata = getGitMetadata(filePath)

    if (docsConfig.showLastUpdateTime && lastUpdateTime !== false) {
      lastUpdated =
        lastUpdateTime instanceof Date
          ? lastUpdateTime
          : gitMetadata.lastUpdated
    }

    if (docsConfig.showLastUpdateAuthor && lastUpdateAuthor !== false) {
      lastAuthor =
        typeof lastUpdateAuthor === 'string'
          ? lastUpdateAuthor
          : gitMetadata.lastAuthor
    }
  }
}
---

<Layout headings={headings} routeBasePath={routeBasePath} editUrl={editUrl} lastUpdated={lastUpdated} lastAuthor={lastAuthor} hideTableOfContents={hideTableOfContents} hideTitle={hideTitle} keywords={keywords} image={image} canonicalUrl={canonicalUrl} customMetaTags={customMetaTags} titleMeta={titleMeta}>
  <Content />
</Layout>
`

        writeFileSync(entryFilePath, entryFileContent)

        // Create virtual modules to expose docs configurations
        updateConfig({
          vite: {
            plugins: [
              {
                name: `shipyard-docs-config-${normalizedBasePath}`,
                resolveId(id) {
                  if (id === VIRTUAL_MODULE_ID) {
                    return RESOLVED_VIRTUAL_MODULE_ID
                  }
                  if (id === routeConfigVirtualId) {
                    return resolvedRouteConfigVirtualId
                  }
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                    return `export const docsConfigs = ${JSON.stringify(docsConfigs)};`
                  }
                  if (id === resolvedRouteConfigVirtualId) {
                    return `export const routeBasePath = ${JSON.stringify(normalizedBasePath)};\nexport const collectionName = ${JSON.stringify(resolvedCollectionName)};`
                  }
                },
              },
            ],
          },
        })

        if (astroConfig.i18n) {
          // With i18n: use locale prefix
          injectRoute({
            pattern: `/[locale]/${normalizedBasePath}/[...slug]`,
            entrypoint: entryFilePath,
            prerender: true,
          })
        } else {
          // Without i18n: direct path
          injectRoute({
            pattern: `/${normalizedBasePath}/[...slug]`,
            entrypoint: entryFilePath,
            prerender: true,
          })
        }

        // Generate llms.txt routes if enabled
        if (llmsTxt?.enabled) {
          const llmsTxtConfig = {
            projectName: llmsTxt.projectName ?? 'Documentation',
            summary: llmsTxt.summary,
            description: llmsTxt.description,
            sectionTitle: llmsTxt.sectionTitle ?? 'Documentation',
          }

          // Generate individual plain text endpoints for each doc page
          // These are mounted at /_llms-txt/[slug].txt
          const llmsTxtPagesFileName = `llms-txt-pages-${normalizedBasePath}.ts`
          const llmsTxtPagesFilePath = join(generatedDir, llmsTxtPagesFileName)

          const llmsTxtPagesFileContent = `import type { APIRoute, GetStaticPaths } from 'astro'
import { i18n } from 'astro:config/server'
import { getCollection, render } from 'astro:content'

const collectionName = ${JSON.stringify(resolvedCollectionName)}

export const getStaticPaths: GetStaticPaths = async () => {
  const allDocs = await getCollection(collectionName)

  // When i18n is enabled, only include docs from the default locale
  const defaultLocale = i18n?.defaultLocale
  const localeDocs = defaultLocale
    ? allDocs.filter((doc) => doc.id.startsWith(defaultLocale + '/') || doc.id === defaultLocale)
    : allDocs

  // Filter out unlisted and non-rendered pages
  const docs = localeDocs.filter((doc) => !doc.data.unlisted && doc.data.render !== false)

  return docs.map((doc) => {
    const cleanId = doc.id.replace(/\\.md$/, '')
    // For i18n, strip the locale prefix from the slug
    let slug = cleanId
    if (i18n && defaultLocale) {
      const [locale, ...rest] = cleanId.split('/')
      slug = rest.length ? rest.join('/') : locale
    }
    // Handle index pages - use special suffix
    if (slug.endsWith('/index')) {
      slug = slug.slice(0, -6) + '/_index'
    } else if (slug === 'index') {
      slug = '_index'
    }

    return {
      // For [...slug], the param should be the full path string (Astro handles the split)
      params: { slug },
      props: { doc },
    }
  })
}

export const GET: APIRoute = async ({ props }) => {
  const { doc } = props as { doc: Awaited<ReturnType<typeof getCollection>>[number] }
  const { headings } = await render(doc)
  const h1 = headings.find((h) => h.depth === 1)

  // Build the plain text content with title and raw markdown body
  const title = doc.data.title ?? h1?.text ?? doc.id
  const description = doc.data.description ? doc.data.description + '\\n\\n' : ''
  const body = doc.body ?? ''

  const content = '# ' + title + '\\n\\n' + description + body

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
`
          writeFileSync(llmsTxtPagesFilePath, llmsTxtPagesFileContent)

          // Generate llms.txt endpoint file
          const llmsTxtFileName = `llms-txt-${normalizedBasePath}.ts`
          const llmsTxtFilePath = join(generatedDir, llmsTxtFileName)

          const llmsTxtFileContent = `import type { APIRoute } from 'astro'
import { i18n } from 'astro:config/server'
import { getCollection, render } from 'astro:content'
import { generateLlmsTxt } from '@levino/shipyard-docs'

const llmsTxtConfig = ${JSON.stringify(llmsTxtConfig)}
const collectionName = ${JSON.stringify(resolvedCollectionName)}
const routeBasePath = ${JSON.stringify(normalizedBasePath)}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://example.com'
  const allDocs = await getCollection(collectionName)

  // When i18n is enabled, only include docs from the default locale
  const defaultLocale = i18n?.defaultLocale
  const localeDocs = defaultLocale
    ? allDocs.filter((doc) => doc.id.startsWith(defaultLocale + '/') || doc.id === defaultLocale)
    : allDocs

  // Filter out unlisted and non-rendered pages
  const docs = localeDocs.filter((doc) => !doc.data.unlisted && doc.data.render !== false)

  const entries = await Promise.all(
    docs.map(async (doc) => {
      const { headings } = await render(doc)
      const h1 = headings.find((h) => h.depth === 1)
      const cleanId = doc.id.replace(/\\.md$/, '')

      // Generate slug for the _llms-txt path
      let slug = cleanId
      if (i18n && defaultLocale) {
        const [locale, ...rest] = cleanId.split('/')
        slug = rest.length ? rest.join('/') : locale
      }
      // Handle index pages - use special suffix
      if (slug.endsWith('/index')) {
        slug = slug.slice(0, -6) + '/_index'
      } else if (slug === 'index') {
        slug = '_index'
      }

      // Path points to the plain text file
      const path = '/' + routeBasePath + '/_llms-txt/' + slug + '.txt'

      return {
        path,
        title: doc.data.title ?? h1?.text ?? doc.id,
        description: doc.data.description,
        position: doc.data.sidebar?.position,
      }
    })
  )

  const content = generateLlmsTxt(entries, llmsTxtConfig, baseUrl)

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
`
          writeFileSync(llmsTxtFilePath, llmsTxtFileContent)

          // Generate llms-full.txt endpoint file
          const llmsFullTxtFileName = `llms-full-txt-${normalizedBasePath}.ts`
          const llmsFullTxtFilePath = join(generatedDir, llmsFullTxtFileName)

          const llmsFullTxtFileContent = `import type { APIRoute } from 'astro'
import { i18n } from 'astro:config/server'
import { getCollection, render } from 'astro:content'
import { generateLlmsFullTxt } from '@levino/shipyard-docs'

const llmsTxtConfig = ${JSON.stringify(llmsTxtConfig)}
const collectionName = ${JSON.stringify(resolvedCollectionName)}
const routeBasePath = ${JSON.stringify(normalizedBasePath)}

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://example.com'
  const allDocs = await getCollection(collectionName)

  // When i18n is enabled, only include docs from the default locale
  const defaultLocale = i18n?.defaultLocale
  const localeDocs = defaultLocale
    ? allDocs.filter((doc) => doc.id.startsWith(defaultLocale + '/') || doc.id === defaultLocale)
    : allDocs

  // Filter out unlisted and non-rendered pages
  const docs = localeDocs.filter((doc) => !doc.data.unlisted && doc.data.render !== false)

  const entries = await Promise.all(
    docs.map(async (doc) => {
      const { headings } = await render(doc)
      const h1 = headings.find((h) => h.depth === 1)
      const cleanId = doc.id.replace(/\\.md$/, '')

      // Generate slug for the _llms-txt path
      let slug = cleanId
      if (i18n && defaultLocale) {
        const [locale, ...rest] = cleanId.split('/')
        slug = rest.length ? rest.join('/') : locale
      }
      // Handle index pages - use special suffix
      if (slug.endsWith('/index')) {
        slug = slug.slice(0, -6) + '/_index'
      } else if (slug === 'index') {
        slug = '_index'
      }

      // Path points to the plain text file
      const path = '/' + routeBasePath + '/_llms-txt/' + slug + '.txt'

      // Read the raw markdown content from the file
      const rawContent = doc.body ?? ''

      return {
        path,
        title: doc.data.title ?? h1?.text ?? doc.id,
        description: doc.data.description,
        position: doc.data.sidebar?.position,
        content: rawContent,
      }
    })
  )

  const content = generateLlmsFullTxt(entries, llmsTxtConfig, baseUrl)

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
`
          writeFileSync(llmsFullTxtFilePath, llmsFullTxtFileContent)

          // Inject route for individual plain text pages (catch-all for nested paths)
          injectRoute({
            pattern: `/${normalizedBasePath}/_llms-txt/[...slug].txt`,
            entrypoint: llmsTxtPagesFilePath,
            prerender: true,
          })

          // Inject routes for llms.txt and llms-full.txt under the docs path
          injectRoute({
            pattern: `/${normalizedBasePath}/llms.txt`,
            entrypoint: llmsTxtFilePath,
            prerender: true,
          })

          injectRoute({
            pattern: `/${normalizedBasePath}/llms-full.txt`,
            entrypoint: llmsFullTxtFilePath,
            prerender: true,
          })
        }
      },
    },
  }
}
