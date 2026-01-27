import type { AstroIntegration } from 'astro'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Re-export fallback utilities
export { extractFirstParagraph } from './fallbacks'
// Re-export git metadata utilities (getEditUrl is runtime-safe, getGitMetadata is build-time only)
export type { GitMetadata } from './gitMetadata'
export { getEditUrl, getGitMetadata } from './gitMetadata'
// Re-export llms.txt utilities
export type { LlmsDocEntry, LlmsTxtConfig } from './llmsTxt'
export { generateLlmsFullTxt, generateLlmsTxt } from './llmsTxt'
// Re-export pagination types and utilities
export type { PaginationInfo, PaginationLink } from './pagination'
export { getPaginationInfo } from './pagination'
// Re-export rehype plugin for version-aware links
export type { RehypeVersionLinksOptions } from './rehypeVersionLinks'
export { rehypeVersionLinks } from './rehypeVersionLinks'
// Re-export remark plugin for git metadata
export type { RemarkGitMetadataOptions } from './remarkGitMetadata'
export { remarkGitMetadata } from './remarkGitMetadata'
export type { DocsEntry, DocsRouteConfig } from './routeHelpers'
// Re-export route helpers
export {
  createDeprecatedVersionSet,
  createVersionPathMap,
  findVersionConfig,
  getAvailableVersions,
  getCurrentVersion,
  getDocPath,
  getRouteParams,
  getStableVersion,
  getVersionedDocPath,
  getVersionedRouteParams,
  getVersionPath,
  isVersionDeprecated,
  switchVersionInPath,
} from './routeHelpers'
// Re-export types and utilities from sidebarEntries
export type { DocsData } from './sidebarEntries'
export { filterDocsForVersion, toSidebarEntries } from './sidebarEntries'
// Re-export version helpers
export {
  getVersionFromDocId,
  isVersionLikeString,
  stripVersionFromDocId,
} from './versionHelpers'

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

/**
 * Base docs schema object (before transforms/refinements).
 * Used internally for extending with additional fields.
 */
const docsSchemaBase = z.object({
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

  // === Internal Git Metadata (populated by remark plugin) ===
  /** @internal Last updated timestamp from git (ISO string) */
  _gitLastUpdated: z.string().optional(),
  /** @internal Last author from git */
  _gitLastAuthor: z.string().optional(),
})

/**
 * Transform function for docs schema to merge snake_case aliases into camelCase fields.
 */
const docsSchemaTransform = <T extends z.infer<typeof docsSchemaBase>>(
  data: T,
) => ({
  ...data,
  // Merge snake_case aliases into camelCase fields
  hideTitle: data.hide_title ?? data.hideTitle,
  hideTableOfContents: data.hide_table_of_contents ?? data.hideTableOfContents,
  canonicalUrl: data.canonical_url ?? data.canonicalUrl,
  customMetaTags: data.custom_meta_tags ?? data.customMetaTags,
  paginationLabel: data.pagination_label ?? data.paginationLabel,
  // For nullable fields, we need to check if the snake_case key exists (not just use ??)
  // because null ?? undefined = undefined, but we want null to be preserved
  paginationNext:
    'pagination_next' in data ? data.pagination_next : data.paginationNext,
  paginationPrev:
    'pagination_prev' in data ? data.pagination_prev : data.paginationPrev,
})

/**
 * Refinement for docs schema to validate TOC heading levels.
 */
const docsSchemaRefinement = {
  check: (data: { tocMinHeadingLevel: number; tocMaxHeadingLevel: number }) =>
    data.tocMinHeadingLevel <= data.tocMaxHeadingLevel,
  message: 'tocMinHeadingLevel must be <= tocMaxHeadingLevel',
}

export const docsSchema = docsSchemaBase
  .transform(docsSchemaTransform)
  .refine(docsSchemaRefinement.check, { message: docsSchemaRefinement.message })

/**
 * Schema for a single version entry in the versions configuration.
 */
export const singleVersionSchema = z.object({
  /**
   * The version identifier (e.g., "v1.0", "2.0.0", "latest").
   */
  version: z.string(),
  /**
   * Optional human-readable label for display in the UI.
   * If not provided, the version string will be used.
   * @example "Version 2.0" or "Latest"
   */
  label: z.string().optional(),
  /**
   * Path segment used in URLs for this version.
   * If not provided, defaults to the version string.
   * @example "v2" for a URL like /docs/v2/getting-started
   */
  path: z.string().optional(),
  /**
   * Optional banner to display when viewing this version.
   * Use "unreleased" for preview/beta versions, "unmaintained" for deprecated versions.
   */
  banner: z.enum(['unreleased', 'unmaintained']).optional(),
})

/**
 * Schema for version configuration in docs.
 * Allows configuring multiple documentation versions with routing and UI options.
 */
export const versionConfigSchema = z.object({
  /**
   * The current/default version of the documentation.
   * This version will be shown when users visit the docs without specifying a version.
   * @example "v2.0" or "latest"
   */
  current: z.string(),
  /**
   * List of all available versions with their configuration.
   * Order matters: versions are typically displayed in reverse chronological order.
   */
  available: z.array(singleVersionSchema).min(1),
  /**
   * List of version identifiers that are deprecated.
   * These versions will show a deprecation banner directing users to the current version.
   * @example ["v1.0", "v0.9"]
   */
  deprecated: z.array(z.string()).optional().default([]),
  /**
   * The stable version identifier.
   * This may differ from "current" - for example, current could be "latest"
   * while stable is "v2.0" (the last released version).
   * @example "v2.0"
   */
  stable: z.string().optional(),
})

/**
 * Configuration for a single documentation version.
 * Inferred from singleVersionSchema.
 */
export type SingleVersionConfig = z.infer<typeof singleVersionSchema>

/**
 * Configuration for documentation versioning.
 * Inferred from versionConfigSchema.
 *
 * @example
 * ```ts
 * const versions: VersionConfig = {
 *   current: 'v2.0',
 *   available: [
 *     { version: 'v2.0', label: 'Version 2.0 (Latest)' },
 *     { version: 'v1.0', label: 'Version 1.0', banner: 'unmaintained' },
 *   ],
 *   deprecated: ['v1.0'],
 *   stable: 'v2.0',
 * }
 * ```
 */
export type VersionConfig = z.infer<typeof versionConfigSchema>

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
   * Requires remarkGitMetadata plugin to be configured in markdown.remarkPlugins.
   * @default false
   */
  showLastUpdateTime?: boolean
  /**
   * Whether to show the last update author on each page.
   * Uses git history to determine who last modified the file.
   * Requires remarkGitMetadata plugin to be configured in markdown.remarkPlugins.
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
  /**
   * Configuration for documentation versioning.
   * When provided, enables multi-version documentation support with version selectors
   * and version-specific content.
   *
   * @example
   * ```ts
   * shipyardDocs({
   *   versions: {
   *     current: 'v2.0',
   *     available: [
   *       { version: 'v2.0', label: 'Version 2.0 (Latest)' },
   *       { version: 'v1.0', label: 'Version 1.0', banner: 'unmaintained' },
   *     ],
   *     deprecated: ['v1.0'],
   *     stable: 'v2.0',
   *   }
   * })
   * ```
   */
  versions?: VersionConfig
  /**
   * Whether to prerender docs pages at build time.
   * When not specified, this is automatically determined from Astro's output mode:
   * - `output: 'server'` → defaults to `false` (SSR)
   * - `output: 'static'` or `output: 'hybrid'` → defaults to `true` (prerender)
   *
   * Set explicitly to `false` for SSR sites with auth middleware that need access to request headers/cookies.
   */
  prerender?: boolean
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
 * Schema for versioned docs that includes version metadata.
 * Extends docsSchema with a version field extracted from the file path.
 */
export const versionedDocsSchema = docsSchemaBase
  .extend({
    /**
     * The version this document belongs to.
     * Automatically extracted from the directory structure when using createVersionedDocsCollection.
     * @example "v1.0", "v2.0", "latest"
     */
    version: z.string().optional(),
  })
  .transform(docsSchemaTransform)
  .refine(docsSchemaRefinement.check, { message: docsSchemaRefinement.message })

/**
 * Options for configuring a versioned docs collection.
 */
export interface VersionedDocsCollectionOptions {
  /**
   * List of version identifiers to include.
   * Each version should have a corresponding directory in the basePath.
   * @example ["v1.0", "v2.0", "latest"]
   */
  versions: string[]
  /**
   * The fallback version to use when a page doesn't exist in the requested version.
   * Documents from this version will be used as defaults.
   * @example "latest" or "v2.0"
   */
  fallbackVersion?: string
}

/**
 * Helper function to create a versioned docs content collection configuration.
 * Use this when you need multiple versions of documentation.
 *
 * The expected directory structure is:
 * ```
 * basePath/
 *   [version]/
 *     [locale]/
 *       [...slug].md
 * ```
 *
 * For example:
 * ```
 * docs/
 *   v1.0/
 *     en/
 *       getting-started.md
 *     de/
 *       getting-started.md
 *   v2.0/
 *     en/
 *       getting-started.md
 *       new-feature.md
 * ```
 *
 * @param basePath - The base directory path where versioned docs are located
 * @param options - Configuration for versions
 * @returns A loader and schema configuration for use with defineCollection
 *
 * @example
 * ```ts
 * import { defineCollection } from 'astro:content'
 * import { createVersionedDocsCollection } from '@levino/shipyard-docs'
 *
 * const docs = defineCollection(createVersionedDocsCollection('./docs', {
 *   versions: ['v1.0', 'v2.0', 'latest'],
 *   fallbackVersion: 'latest',
 * }))
 *
 * export const collections = { docs }
 * ```
 */
export const createVersionedDocsCollection = (
  basePath: string,
  options: VersionedDocsCollectionOptions,
) => {
  const { versions } = options

  // Create a glob pattern that matches all version directories
  // Pattern: {v1.0,v2.0,latest}/**/*.md
  const versionPattern =
    versions.length === 1 ? versions[0] : `{${versions.join(',')}}`
  const pattern = `${versionPattern}/**/*.md`

  return {
    schema: versionedDocsSchema,
    loader: glob({ pattern, base: basePath }),
  }
}

// Import version helpers for use in document filter functions
import {
  getVersionFromDocId as getVersionFromDocIdHelper,
  stripVersionFromDocId as stripVersionFromDocIdHelper,
} from './versionHelpers'

/**
 * Filters versioned docs to return only documents for a specific version.
 * Useful for building version-specific sidebars and navigation.
 *
 * @param docs - Array of document entries
 * @param version - The version to filter by
 * @param idAccessor - Function to extract the document ID (defaults to doc.id)
 * @returns Documents matching the specified version
 *
 * @example
 * ```ts
 * const allDocs = await getCollection('docs')
 * const v2Docs = filterDocsByVersion(allDocs, 'v2.0')
 * ```
 */
export const filterDocsByVersion = <T extends { id: string }>(
  docs: readonly T[],
  version: string,
): T[] => {
  return docs.filter((doc) => {
    const docVersion = getVersionFromDocIdHelper(doc.id)
    return docVersion === version
  })
}

/**
 * Groups versioned documents by their version.
 * Useful for building version overviews or managing content across versions.
 *
 * @param docs - Array of document entries
 * @returns A Map with version strings as keys and arrays of documents as values
 *
 * @example
 * ```ts
 * const allDocs = await getCollection('docs')
 * const byVersion = groupDocsByVersion(allDocs)
 * // Map { "v1.0" => [...], "v2.0" => [...] }
 * ```
 */
export const groupDocsByVersion = <T extends { id: string }>(
  docs: readonly T[],
): Map<string | undefined, T[]> => {
  const groups = new Map<string | undefined, T[]>()
  for (const doc of docs) {
    const version = getVersionFromDocIdHelper(doc.id)
    const existing = groups.get(version) ?? []
    existing.push(doc)
    groups.set(version, existing)
  }
  return groups
}

/**
 * Finds a document in a fallback version when it doesn't exist in the requested version.
 * Useful for gracefully handling missing version-specific content.
 *
 * @param docs - Array of all document entries
 * @param slug - The slug (path without version) to look for
 * @param requestedVersion - The version that was originally requested
 * @param fallbackVersions - Array of versions to check in order (first match wins)
 * @returns The document from the fallback version, or undefined if not found in any version
 *
 * @example
 * ```ts
 * const allDocs = await getCollection('docs')
 * // User requested v1.0/en/new-feature but it doesn't exist
 * // Fall back to v2.0 or latest
 * const fallbackDoc = findFallbackDoc(
 *   allDocs,
 *   'en/new-feature',
 *   'v1.0',
 *   ['v2.0', 'latest']
 * )
 * ```
 */
export const findFallbackDoc = <T extends { id: string }>(
  docs: readonly T[],
  slug: string,
  requestedVersion: string,
  fallbackVersions: string[],
): { doc: T; version: string } | undefined => {
  // Check each fallback version in order
  for (const version of fallbackVersions) {
    // Skip the requested version since we already know it doesn't exist there
    if (version === requestedVersion) continue

    const targetId = `${version}/${slug}`
    const doc = docs.find((d) => d.id === targetId)
    if (doc) {
      return { doc, version }
    }
  }
  return undefined
}

/**
 * Checks if a document exists for a specific version.
 * Useful for determining whether to use fallback logic.
 *
 * @param docs - Array of document entries
 * @param slug - The slug (path without version) to look for
 * @param version - The version to check
 * @returns True if the document exists in the specified version
 *
 * @example
 * ```ts
 * const allDocs = await getCollection('docs')
 * if (!docExistsInVersion(allDocs, 'en/new-feature', 'v1.0')) {
 *   // Handle missing document - show 404 or redirect to another version
 * }
 * ```
 */
export const docExistsInVersion = <T extends { id: string }>(
  docs: readonly T[],
  slug: string,
  version: string,
): boolean => {
  const targetId = `${version}/${slug}`
  return docs.some((d) => d.id === targetId)
}

/**
 * Gets all available versions for a specific slug.
 * Useful for showing a version switcher with only versions that have this document.
 *
 * @param docs - Array of document entries
 * @param slug - The slug (path without version) to look for
 * @returns Array of version strings where this document exists
 *
 * @example
 * ```ts
 * const allDocs = await getCollection('docs')
 * const versions = getDocVersions(allDocs, 'en/getting-started')
 * // ['v1.0', 'v2.0', 'latest'] - shows in which versions this doc exists
 * ```
 */
export const getDocVersions = <T extends { id: string }>(
  docs: readonly T[],
  slug: string,
): string[] => {
  const versions: string[] = []
  for (const doc of docs) {
    const docVersion = getVersionFromDocIdHelper(doc.id)
    if (docVersion) {
      const docSlug = stripVersionFromDocIdHelper(doc.id)
      if (docSlug === slug && !versions.includes(docVersion)) {
        versions.push(docVersion)
      }
    }
  }
  return versions
}

/**
 * shipyard Docs integration for Astro.
 *
 * Supports multiple documentation instances with configurable route mounting.
 * Uses pre-shipped route components - no file system writes required.
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
 * // Multiple docs instances
 * shipyardDocs({ routeBasePath: 'docs' })
 * shipyardDocs({ routeBasePath: 'guides' })
 * ```
 */
// Store all docs configurations keyed by routeBasePath
// This allows route components to look up config based on the current route
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
    llmsTxtConfig?: {
      projectName: string
      summary?: string
      description?: string
      sectionTitle: string
    }
    versions?: VersionConfig
    prerender?: boolean
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
    versions,
    prerender: prerenderConfig,
  } = config

  // Validate versions config if provided
  if (versions) {
    const parseResult = versionConfigSchema.safeParse(versions)
    if (!parseResult.success) {
      throw new Error(
        `Invalid versions configuration: ${parseResult.error.message}`,
      )
    }
  }

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

  // Prepare llmsTxt config if enabled
  const llmsTxtConfig = llmsTxt?.enabled
    ? {
        projectName: llmsTxt.projectName ?? 'Documentation',
        summary: llmsTxt.summary,
        description: llmsTxt.description,
        sectionTitle: llmsTxt.sectionTitle ?? 'Documentation',
      }
    : undefined

  return {
    name: `shipyard-docs${normalizedBasePath !== 'docs' ? `-${normalizedBasePath}` : ''}`,
    hooks: {
      'astro:config:setup': ({
        injectRoute,
        config: astroConfig,
        updateConfig,
      }) => {
        // Determine prerender value: if not explicitly set, derive from Astro's output mode
        // - 'server' output defaults to false (SSR)
        // - 'static' or 'hybrid' output defaults to true (prerender)
        const prerender =
          prerenderConfig !== undefined
            ? prerenderConfig
            : astroConfig.output !== 'server'

        // Register this config in the global registry
        // This must happen inside the hook so the config is available when routes are processed
        docsConfigs[normalizedBasePath] = {
          editUrl,
          showLastUpdateTime,
          showLastUpdateAuthor,
          routeBasePath: normalizedBasePath,
          collectionName: resolvedCollectionName,
          llmsTxtEnabled: !!llmsTxt?.enabled,
          llmsTxtConfig,
          versions,
          prerender,
        }

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
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                    // Generate the virtual module with docsConfigs and helper functions
                    const virtualModuleCode = `export const docsConfigs = ${JSON.stringify(docsConfigs)};

/**
 * Get the route configuration for a specific docs instance.
 * @param {string} routeBasePath - The route base path
 * @returns {object | undefined}
 */
export function getRouteConfig(routeBasePath) {
  return docsConfigs[routeBasePath];
}

/**
 * Get the version configuration for a specific docs instance.
 * @param {string} [routeBasePath='docs'] - The route base path
 * @returns {import('./index').VersionConfig | undefined}
 */
export function getVersionConfig(routeBasePath = 'docs') {
  return docsConfigs[routeBasePath]?.versions;
}

/**
 * Get the current/default version for a docs instance.
 * @param {string} [routeBasePath='docs'] - The route base path
 * @returns {string | undefined}
 */
export function getCurrentVersion(routeBasePath = 'docs') {
  return docsConfigs[routeBasePath]?.versions?.current;
}

/**
 * Get all available versions for a docs instance.
 * @param {string} [routeBasePath='docs'] - The route base path
 * @returns {import('./index').SingleVersionConfig[]}
 */
export function getAvailableVersions(routeBasePath = 'docs') {
  return docsConfigs[routeBasePath]?.versions?.available ?? [];
}

/**
 * Check if a version is deprecated.
 * @param {string} version - The version string to check
 * @param {string} [routeBasePath='docs'] - The route base path
 * @returns {boolean}
 */
export function isVersionDeprecated(version, routeBasePath = 'docs') {
  const config = docsConfigs[routeBasePath]?.versions;
  if (!config) return false;
  return config.deprecated?.includes(version) ?? false;
}

/**
 * Get the stable version for a docs instance.
 * @param {string} [routeBasePath='docs'] - The route base path
 * @returns {string | undefined}
 */
export function getStableVersion(routeBasePath = 'docs') {
  const config = docsConfigs[routeBasePath]?.versions;
  if (!config) return undefined;
  return config.stable ?? config.current;
}

/**
 * Check if versioning is enabled for a docs instance.
 * @param {string} [routeBasePath='docs'] - The route base path
 * @returns {boolean}
 */
export function hasVersioning(routeBasePath = 'docs') {
  return !!docsConfigs[routeBasePath]?.versions;
}
`
                    return virtualModuleCode
                  }
                },
              },
            ],
          },
        })

        // Inject routes using pre-shipped components from the package
        const packagePrefix = '@levino/shipyard-docs/astro/routes'

        if (astroConfig.i18n) {
          // With i18n: use locale prefix
          if (versions) {
            // Versioned routes: /[locale]/[routeBasePath]/[version]/[...slug]
            injectRoute({
              pattern: `/[locale]/${normalizedBasePath}/[version]/[...slug]`,
              entrypoint: `${packagePrefix}/DocsEntryVersionedRoute.astro`,
              prerender,
            })

            // Redirect from docs root to current version
            injectRoute({
              pattern: `/[locale]/${normalizedBasePath}`,
              entrypoint: `${packagePrefix}/DocsRedirectRoute.astro`,
              prerender,
            })
          } else {
            // Non-versioned routes: /[locale]/[routeBasePath]/[...slug]
            injectRoute({
              pattern: `/[locale]/${normalizedBasePath}/[...slug]`,
              entrypoint: `${packagePrefix}/DocsEntryRoute.astro`,
              prerender,
            })
          }
        } else {
          // Without i18n: direct path
          if (versions) {
            // Versioned routes: /[routeBasePath]/[version]/[...slug]
            injectRoute({
              pattern: `/${normalizedBasePath}/[version]/[...slug]`,
              entrypoint: `${packagePrefix}/DocsEntryVersionedRoute.astro`,
              prerender,
            })

            // Redirect from docs root to current version
            injectRoute({
              pattern: `/${normalizedBasePath}`,
              entrypoint: `${packagePrefix}/DocsRedirectRoute.astro`,
              prerender,
            })
          } else {
            // Non-versioned routes: /[routeBasePath]/[...slug]
            injectRoute({
              pattern: `/${normalizedBasePath}/[...slug]`,
              entrypoint: `${packagePrefix}/DocsEntryRoute.astro`,
              prerender,
            })
          }
        }

        // Inject llms.txt routes if enabled
        if (llmsTxt?.enabled) {
          // Individual plain text pages
          injectRoute({
            pattern: `/${normalizedBasePath}/_llms-txt/[...slug].txt`,
            entrypoint: `${packagePrefix}/llms-txt-pages.ts`,
            prerender,
          })

          // llms.txt index
          injectRoute({
            pattern: `/${normalizedBasePath}/llms.txt`,
            entrypoint: `${packagePrefix}/llms-txt.ts`,
            prerender,
          })

          // llms-full.txt
          injectRoute({
            pattern: `/${normalizedBasePath}/llms-full.txt`,
            entrypoint: `${packagePrefix}/llms-full-txt.ts`,
            prerender,
          })
        }
      },
    },
  }
}
