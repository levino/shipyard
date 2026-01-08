/**
 * Helper functions for parsing and manipulating version strings in doc IDs.
 * These are low-level utilities used by other modules.
 */

/**
 * Checks if a string looks like a version identifier.
 * Matches: v1.0, v2.0.0, latest, next, main, etc.
 */
export const isVersionLikeString = (str: string): boolean => {
  // Match common version patterns
  return /^(v?\d+(\.\d+)*|latest|next|main|master|canary|beta|alpha|rc\d*|stable)$/i.test(
    str,
  )
}

/**
 * Extracts the version from a versioned document ID.
 * The version is expected to be the first path segment.
 *
 * @param docId - The document ID (e.g., "v1.0/en/getting-started")
 * @returns The version string or undefined if not found
 *
 * @example
 * ```ts
 * getVersionFromDocId("v1.0/en/getting-started") // "v1.0"
 * getVersionFromDocId("latest/en/index") // "latest"
 * getVersionFromDocId("en/getting-started") // undefined (non-versioned)
 * ```
 */
export const getVersionFromDocId = (docId: string): string | undefined => {
  const parts = docId.split('/')
  // For versioned docs, first part is the version
  // We check if it looks like a version (starts with 'v' and has numbers, or is 'latest', 'next', etc.)
  if (parts.length > 0) {
    const potentialVersion = parts[0]
    if (isVersionLikeString(potentialVersion)) {
      return potentialVersion
    }
  }
  return undefined
}

/**
 * Strips the version prefix from a versioned document ID.
 * Returns the ID without the version for use in routing.
 *
 * @param docId - The document ID (e.g., "v1.0/en/getting-started")
 * @returns The ID without version prefix (e.g., "en/getting-started")
 *
 * @example
 * ```ts
 * stripVersionFromDocId("v1.0/en/getting-started") // "en/getting-started"
 * stripVersionFromDocId("latest/en/index") // "en/index"
 * stripVersionFromDocId("en/getting-started") // "en/getting-started" (unchanged)
 * ```
 */
export const stripVersionFromDocId = (docId: string): string => {
  const version = getVersionFromDocId(docId)
  if (version) {
    return docId.slice(version.length + 1) // +1 for the slash
  }
  return docId
}
