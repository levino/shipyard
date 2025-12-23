import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { AstroIntegration } from 'astro'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Re-export git metadata utilities
export type { GitMetadata } from './gitMetadata'
export { getEditUrl, getGitMetadata } from './gitMetadata'
// Re-export pagination types and utilities
export type { PaginationInfo, PaginationLink } from './pagination'
export { getPaginationInfo } from './pagination'
export type { DocsRouteConfig } from './routeHelpers'
// Re-export route helpers
export { getDocPath, getRouteParams } from './routeHelpers'
// Re-export types and utilities from sidebarEntries
export type { DocsData } from './sidebarEntries'
export { toSidebarEntries } from './sidebarEntries'

export const docsSchema = z.object({
  sidebar: z
    .object({
      render: z.boolean().default(true),
      label: z.string().optional(),
    })
    .default({ render: true }),
  title: z.string().optional(),
  description: z.string().optional(),
  sidebar_position: z.number().optional(),
  sidebar_label: z.string().optional(),
  sidebar_class_name: z.string().optional(),
  sidebar_custom_props: z.record(z.any()).optional(),
  pagination_next: z.string().nullable().optional(),
  pagination_prev: z.string().nullable().optional(),
  /**
   * Override the last update author for this specific page.
   * Set to false to hide the author for this page.
   */
  last_update_author: z.union([z.string(), z.literal(false)]).optional(),
  /**
   * Override the last update timestamp for this specific page.
   * Set to false to hide the timestamp for this page.
   */
  last_update_time: z.union([z.coerce.date(), z.literal(false)]).optional(),
  /**
   * Custom edit URL for this specific page.
   * Set to null to disable edit link for this page.
   */
  custom_edit_url: z.string().nullable().optional(),
})

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
  }
> = {}

export default (config: DocsConfig = {}): AstroIntegration => {
  const {
    routeBasePath = 'docs',
    collectionName,
    editUrl,
    showLastUpdateTime = false,
    showLastUpdateAuthor = false,
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
  const docs = await getCollection(collectionName)

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

const { custom_edit_url, last_update_author, last_update_time } = entry.data

let editUrl
if (custom_edit_url === null) {
  editUrl = undefined
} else if (custom_edit_url) {
  editUrl = custom_edit_url
} else {
  editUrl = getEditUrl(docsConfig.editUrl, entry.id)
}

let lastUpdated
let lastAuthor

if (
  (docsConfig.showLastUpdateTime && last_update_time !== false) ||
  (docsConfig.showLastUpdateAuthor && last_update_author !== false)
) {
  const filePath = entry.filePath

  if (filePath) {
    const gitMetadata = getGitMetadata(filePath)

    if (docsConfig.showLastUpdateTime && last_update_time !== false) {
      lastUpdated =
        last_update_time instanceof Date
          ? last_update_time
          : gitMetadata.lastUpdated
    }

    if (docsConfig.showLastUpdateAuthor && last_update_author !== false) {
      lastAuthor =
        typeof last_update_author === 'string'
          ? last_update_author
          : gitMetadata.lastAuthor
    }
  }
}
---

<Layout headings={headings} routeBasePath={routeBasePath} editUrl={editUrl} lastUpdated={lastUpdated} lastAuthor={lastAuthor}>
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
      },
    },
  }
}
