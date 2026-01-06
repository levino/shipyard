import type { CollectionEntry } from 'astro:content'
import type { SingleVersionConfig, VersionConfig } from './index'

/**
 * Configuration for generating static paths for a docs collection.
 */
export interface DocsRouteConfig {
  /**
   * The base path for the docs routes (without leading/trailing slashes).
   * @example 'docs', 'guides', 'api/reference'
   */
  routeBasePath: string

  /**
   * Whether i18n is enabled for this docs instance.
   * When true, expects docs to have locale prefixes in their IDs.
   */
  hasI18n: boolean
}

/**
 * Generate route parameters from a doc entry's slug.
 *
 * @param slug - The slug from the doc entry (e.g., 'en/getting-started' or 'getting-started')
 * @param hasI18n - Whether i18n is enabled
 * @returns Route parameters object
 */
export const getRouteParams = (slug: string, hasI18n: boolean) => {
  if (hasI18n) {
    const [locale, ...rest] = slug.split('/')
    return {
      slug: rest.length ? rest.join('/') : undefined,
      locale,
    }
  }
  return {
    slug: slug || undefined,
  }
}

/**
 * Generate the full URL path for a doc entry.
 *
 * @param id - The doc entry ID
 * @param routeBasePath - The base path for routes
 * @param hasI18n - Whether i18n is enabled
 * @param currentLocale - The current locale (for i18n)
 * @returns The full URL path
 */
export const getDocPath = (
  id: string,
  routeBasePath: string,
  hasI18n: boolean,
  currentLocale?: string,
) => {
  // Remove leading and trailing slashes safely (avoid polynomial regex)
  let normalizedBasePath = routeBasePath
  while (normalizedBasePath.startsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(1)
  }
  while (normalizedBasePath.endsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(0, -1)
  }

  if (hasI18n && currentLocale) {
    // Remove locale prefix from id (e.g., 'en/guide/intro' -> 'guide/intro')
    const pathWithoutLocale = id.includes('/')
      ? id.slice(id.indexOf('/') + 1)
      : id
    return `/${currentLocale}/${normalizedBasePath}/${pathWithoutLocale}`
  }

  return `/${normalizedBasePath}/${id}`
}

/**
 * Type for docs collection entry with inferred data structure.
 */
export type DocsEntry = CollectionEntry<'docs'>

/**
 * Get the URL path segment for a version.
 * Uses the version's `path` property if defined, otherwise uses the version string.
 *
 * @param version - The version string to look up
 * @param versions - The version configuration
 * @returns The path segment to use in URLs, or undefined if version not found
 */
export const getVersionPath = (
  version: string,
  versions: VersionConfig,
): string | undefined => {
  const versionConfig = versions.available.find((v) => v.version === version)
  if (!versionConfig) return undefined
  return versionConfig.path ?? versionConfig.version
}

/**
 * Get the current/default version from version configuration.
 *
 * @param versions - The version configuration
 * @returns The current version string
 */
export const getCurrentVersion = (versions: VersionConfig): string => {
  return versions.current
}

/**
 * Get all available versions from version configuration.
 *
 * @param versions - The version configuration
 * @returns Array of available version configurations
 */
export const getAvailableVersions = (
  versions: VersionConfig,
): SingleVersionConfig[] => {
  return versions.available
}

/**
 * Check if a version is deprecated.
 *
 * @param version - The version string to check
 * @param versions - The version configuration
 * @returns True if the version is in the deprecated list
 */
export const isVersionDeprecated = (
  version: string,
  versions: VersionConfig,
): boolean => {
  return versions.deprecated?.includes(version) ?? false
}

/**
 * Get the stable version from configuration.
 * Falls back to current if stable is not explicitly set.
 *
 * @param versions - The version configuration
 * @returns The stable version string
 */
export const getStableVersion = (versions: VersionConfig): string => {
  return versions.stable ?? versions.current
}

/**
 * Find a version configuration by its version string or path.
 *
 * @param versionOrPath - The version string or path segment
 * @param versions - The version configuration
 * @returns The matching version config, or undefined if not found
 */
export const findVersionConfig = (
  versionOrPath: string,
  versions: VersionConfig,
): SingleVersionConfig | undefined => {
  return versions.available.find(
    (v) => v.version === versionOrPath || v.path === versionOrPath,
  )
}

/**
 * Generate the full URL path for a versioned doc entry.
 *
 * URL structure with versions:
 * - Without i18n: /[routeBasePath]/[version]/[...slug]
 * - With i18n: /[locale]/[routeBasePath]/[version]/[...slug]
 *
 * @param id - The doc entry ID
 * @param routeBasePath - The base path for routes
 * @param hasI18n - Whether i18n is enabled
 * @param version - The version path segment (not the version string, use getVersionPath first)
 * @param currentLocale - The current locale (for i18n)
 * @returns The full URL path including version
 */
export const getVersionedDocPath = (
  id: string,
  routeBasePath: string,
  hasI18n: boolean,
  version: string,
  currentLocale?: string,
): string => {
  // Normalize base path - remove leading and trailing slashes
  let normalizedBasePath = routeBasePath
  while (normalizedBasePath.startsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(1)
  }
  while (normalizedBasePath.endsWith('/')) {
    normalizedBasePath = normalizedBasePath.slice(0, -1)
  }

  // Normalize version - remove leading and trailing slashes
  let normalizedVersion = version
  while (normalizedVersion.startsWith('/')) {
    normalizedVersion = normalizedVersion.slice(1)
  }
  while (normalizedVersion.endsWith('/')) {
    normalizedVersion = normalizedVersion.slice(0, -1)
  }

  if (hasI18n && currentLocale) {
    // Remove locale prefix from id (e.g., 'en/guide/intro' -> 'guide/intro')
    const pathWithoutLocale = id.includes('/')
      ? id.slice(id.indexOf('/') + 1)
      : id
    return `/${currentLocale}/${normalizedBasePath}/${normalizedVersion}/${pathWithoutLocale}`
  }

  return `/${normalizedBasePath}/${normalizedVersion}/${id}`
}

/**
 * Generate route parameters from a versioned doc entry's slug.
 *
 * @param slug - The slug from the doc entry (may include version prefix)
 * @param hasI18n - Whether i18n is enabled
 * @param version - The version path segment
 * @returns Route parameters object including version
 */
export const getVersionedRouteParams = (
  slug: string,
  hasI18n: boolean,
  version: string,
) => {
  const baseParams = getRouteParams(slug, hasI18n)
  return {
    ...baseParams,
    version,
  }
}

/**
 * Convert a path from one version to another.
 * Useful for "view this page in another version" links.
 *
 * @param currentPath - The current full URL path
 * @param targetVersion - The target version path segment
 * @param currentVersion - The current version path segment
 * @returns The path with version replaced
 */
export const switchVersionInPath = (
  currentPath: string,
  targetVersion: string,
  currentVersion: string,
): string => {
  // Replace the version segment in the path
  // Handle both /docs/v1/page and /en/docs/v1/page patterns
  return currentPath.replace(
    new RegExp(`/${escapeRegex(currentVersion)}/`),
    `/${targetVersion}/`,
  )
}

/**
 * Escape special regex characters in a string.
 * @internal
 */
const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Creates a Map for efficient version path lookups.
 * Use this when processing many documents to avoid repeated array.find() calls.
 *
 * @param versions - The version configuration
 * @returns A Map from version string to URL path segment
 *
 * @example
 * ```ts
 * const versionPathMap = createVersionPathMap(versionsConfig)
 * // Now use versionPathMap.get(version) instead of getVersionPath(version, versionsConfig)
 * for (const doc of docs) {
 *   const version = getVersionFromDocId(doc.id)
 *   const versionPath = versionPathMap.get(version) ?? version
 * }
 * ```
 */
export const createVersionPathMap = (
  versions: VersionConfig,
): Map<string, string> => {
  const map = new Map<string, string>()
  for (const v of versions.available) {
    map.set(v.version, v.path ?? v.version)
  }
  return map
}

/**
 * Creates a Set of deprecated versions for efficient lookup.
 * Use this when checking many documents for deprecation status.
 *
 * @param versions - The version configuration
 * @returns A Set of deprecated version strings
 */
export const createDeprecatedVersionSet = (
  versions: VersionConfig,
): Set<string> => {
  return new Set(versions.deprecated ?? [])
}
