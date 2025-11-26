import type { AstroIntegration } from 'astro'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

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
  pagination_next: z.string().nullable().optional(),
  pagination_prev: z.string().nullable().optional(),
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
 * Shipyard Docs integration for Astro.
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
export default (config: DocsConfig = {}): AstroIntegration => {
  const { routeBasePath = 'docs' } = config

  // Normalize the route base path (remove leading/trailing slashes safely)
  let normalizedBasePath = routeBasePath
  while (normalizedBasePath.startsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(1)
  }
  while (normalizedBasePath.endsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(0, -1)
  }

  return {
    name: `shipyard-docs${normalizedBasePath !== 'docs' ? `-${normalizedBasePath}` : ''}`,
    hooks: {
      'astro:config:setup': ({ injectRoute, config: astroConfig }) => {
        if (astroConfig.i18n) {
          // With i18n: use locale prefix
          injectRoute({
            pattern: `/[locale]/${normalizedBasePath}/[...slug]`,
            entrypoint: `@levino/shipyard-docs/astro/DocsEntry.astro`,
            prerender: true,
          })
        } else {
          // Without i18n: direct path
          injectRoute({
            pattern: `/${normalizedBasePath}/[...slug]`,
            entrypoint: `@levino/shipyard-docs/astro/DocsEntry.astro`,
            prerender: true,
          })
        }
      },
    },
  }
}
