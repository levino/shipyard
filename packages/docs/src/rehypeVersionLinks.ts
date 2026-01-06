import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * Options for the rehype version links plugin.
 */
export interface RehypeVersionLinksOptions {
  /**
   * The base path for docs routes (e.g., 'docs', 'guides').
   */
  routeBasePath: string
  /**
   * The current version being rendered.
   * Links without explicit version will resolve to this version.
   */
  currentVersion: string
  /**
   * Available versions for validation.
   * Cross-version links to non-existent versions will log warnings.
   */
  availableVersions?: string[]
  /**
   * Enable verbose logging for link transformations.
   * @default false
   */
  debug?: boolean
}

/**
 * Cross-version link syntax: @version:/path
 * Examples:
 * - @v1:/installation → /docs/v1/installation
 * - @v2:/guide/intro → /docs/v2/guide/intro
 * - @latest:/getting-started → /docs/latest/getting-started
 */
const CROSS_VERSION_LINK_REGEX = /^@([^:]+):(.+)$/

/**
 * Rehype plugin to handle version-aware link resolution in documentation.
 *
 * Features:
 * 1. Relative links (./page, ../other) resolve within the same version
 * 2. Cross-version links (@v1:/path) allow explicit version targeting
 * 3. Absolute docs links (/docs/page) automatically get versioned
 *
 * @example
 * ```ts
 * // In astro.config.mjs
 * export default defineConfig({
 *   markdown: {
 *     rehypePlugins: [
 *       [rehypeVersionLinks, {
 *         routeBasePath: 'docs',
 *         currentVersion: 'v2',
 *         availableVersions: ['v1', 'v2', 'latest'],
 *       }]
 *     ]
 *   }
 * })
 * ```
 */
export function rehypeVersionLinks(options: RehypeVersionLinksOptions) {
  const {
    routeBasePath,
    currentVersion,
    availableVersions = [],
    debug,
  } = options

  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      // Only process anchor elements
      if (node.tagName !== 'a') return

      const href = node.properties?.href
      if (typeof href !== 'string') return

      // Skip external links, anchors, and protocol links
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        href.startsWith('tel:')
      ) {
        return
      }

      let newHref = href

      // Check for cross-version link syntax: @version:/path
      const crossVersionMatch = href.match(CROSS_VERSION_LINK_REGEX)
      if (crossVersionMatch) {
        const [, targetVersion, targetPath] = crossVersionMatch
        const cleanPath = targetPath.startsWith('/')
          ? targetPath.slice(1)
          : targetPath

        // Validate version exists
        if (
          availableVersions.length > 0 &&
          !availableVersions.includes(targetVersion) &&
          targetVersion !== 'latest'
        ) {
          // biome-ignore lint/suspicious/noConsole: Intentional warning for invalid cross-version links
          console.warn(
            `[rehypeVersionLinks] Unknown version "${targetVersion}" in link: ${href}`,
          )
        }

        newHref = `/${routeBasePath}/${targetVersion}/${cleanPath}`

        if (debug) {
          // biome-ignore lint/suspicious/noConsole: Debug logging when enabled
          console.log(
            `[rehypeVersionLinks] Cross-version link: ${href} → ${newHref}`,
          )
        }
      }
      // Check if it's an absolute path starting with the docs base path
      // e.g., /docs/installation or /docs/guide/intro
      else if (href.startsWith(`/${routeBasePath}/`)) {
        const pathAfterBase = href.slice(`/${routeBasePath}/`.length)

        // Check if it already has a version
        const firstSegment = pathAfterBase.split('/')[0]
        const hasVersion =
          availableVersions.includes(firstSegment) ||
          firstSegment === 'latest' ||
          firstSegment === currentVersion

        if (!hasVersion) {
          // Add the current version to the path
          newHref = `/${routeBasePath}/${currentVersion}/${pathAfterBase}`

          if (debug) {
            // biome-ignore lint/suspicious/noConsole: Debug logging when enabled
            console.log(
              `[rehypeVersionLinks] Auto-versioned link: ${href} → ${newHref}`,
            )
          }
        }
      }
      // Relative paths are handled by the browser/Astro based on current URL
      // We don't need to transform them since they'll naturally stay in the same version

      // Update the href if changed
      if (newHref !== href) {
        node.properties = node.properties ?? {}
        node.properties.href = newHref
      }
    })
  }
}

export default rehypeVersionLinks
