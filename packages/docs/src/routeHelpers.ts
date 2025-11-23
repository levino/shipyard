import type { CollectionEntry } from 'astro:content'

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
