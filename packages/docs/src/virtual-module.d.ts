import type { SingleVersionConfig, VersionConfig } from './index'

declare module 'virtual:shipyard-docs-configs' {
  /**
   * Registry of all docs configurations keyed by routeBasePath.
   */
  export const docsConfigs: Record<
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
  >

  /**
   * Get the route configuration for a specific docs instance.
   *
   * @param routeBasePath - The route base path of the docs instance
   * @returns The route configuration or undefined
   */
  export function getRouteConfig(
    routeBasePath: string,
  ): (typeof docsConfigs)[string] | undefined

  /**
   * Get the version configuration for a specific docs instance.
   * Returns undefined if versioning is not enabled for this routeBasePath.
   *
   * @param routeBasePath - The route base path of the docs instance (default: 'docs')
   * @returns The version configuration or undefined
   */
  export function getVersionConfig(
    routeBasePath?: string,
  ): VersionConfig | undefined

  /**
   * Get the current/default version for a docs instance.
   * Returns undefined if versioning is not enabled.
   *
   * @param routeBasePath - The route base path of the docs instance (default: 'docs')
   * @returns The current version string or undefined
   */
  export function getCurrentVersion(routeBasePath?: string): string | undefined

  /**
   * Get all available versions for a docs instance.
   * Returns an empty array if versioning is not enabled.
   *
   * @param routeBasePath - The route base path of the docs instance (default: 'docs')
   * @returns Array of available version configurations
   */
  export function getAvailableVersions(
    routeBasePath?: string,
  ): SingleVersionConfig[]

  /**
   * Check if a version is deprecated.
   * Returns false if versioning is not enabled or version not found.
   *
   * @param version - The version string to check
   * @param routeBasePath - The route base path of the docs instance (default: 'docs')
   * @returns True if the version is deprecated
   */
  export function isVersionDeprecated(
    version: string,
    routeBasePath?: string,
  ): boolean

  /**
   * Get the stable version for a docs instance.
   * Returns undefined if versioning is not enabled.
   *
   * @param routeBasePath - The route base path of the docs instance (default: 'docs')
   * @returns The stable version string or undefined
   */
  export function getStableVersion(routeBasePath?: string): string | undefined

  /**
   * Check if versioning is enabled for a docs instance.
   *
   * @param routeBasePath - The route base path of the docs instance (default: 'docs')
   * @returns True if versioning is enabled
   */
  export function hasVersioning(routeBasePath?: string): boolean
}
