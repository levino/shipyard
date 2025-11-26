import type { Entry } from '@levino/shipyard-base'
import type { DocsData } from './sidebarEntries'

export interface PaginationLink {
  title: string
  href: string
}

export interface PaginationInfo {
  prev?: PaginationLink
  next?: PaginationLink
}

interface FlattenedEntry {
  title: string
  href: string
}

/**
 * Normalizes a path by removing trailing slashes (except for root path).
 * This ensures consistent path comparison regardless of trailing slash variations.
 */
const normalizePath = (path: string): string => {
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}

/**
 * Flattens a hierarchical sidebar entry structure into an ordered array of pages.
 * This preserves the order in which pages appear in the sidebar, including nested items.
 *
 * @param entries - The hierarchical sidebar entries
 * @returns An array of flattened entries with title and href
 */
const flattenSidebarEntries = (entries: Entry): FlattenedEntry[] => {
  const result: FlattenedEntry[] = []

  const traverse = (entryRecord: Entry) => {
    for (const [_key, value] of Object.entries(entryRecord)) {
      // Add the current entry if it has an href (i.e., it's a page, not just a category)
      if (value.href && value.label) {
        result.push({
          title: value.label,
          href: value.href,
        })
      }

      // Recursively traverse children
      if (value.subEntry) {
        traverse(value.subEntry)
      }
    }
  }

  traverse(entries)
  return result
}

/**
 * Finds the previous and next pages for a given document based on its position
 * in the sidebar navigation.
 *
 * @param currentPath - The path of the current page (e.g., '/docs/getting-started')
 * @param sidebarEntries - The hierarchical sidebar entries
 * @param allDocs - All documentation pages (for looking up frontmatter overrides)
 * @returns An object containing prev and/or next pagination links
 */
export const getPaginationInfo = (
  currentPath: string,
  sidebarEntries: Entry,
  allDocs: readonly DocsData[],
): PaginationInfo => {
  // Normalize the current path to handle trailing slash variations
  const normalizedCurrentPath = normalizePath(currentPath)

  // Find the current doc to check for pagination overrides
  const currentDoc = allDocs.find(
    (doc) => normalizePath(doc.path) === normalizedCurrentPath,
  )

  // Check for explicit pagination overrides in frontmatter
  const paginationNext = currentDoc?.['pagination_next' as keyof DocsData]
  const paginationPrev = currentDoc?.['pagination_prev' as keyof DocsData]

  // If explicitly disabled (null), return empty pagination
  if (paginationNext === null && paginationPrev === null) {
    return {}
  }

  // Flatten the sidebar to get ordered list of pages
  const flatPages = flattenSidebarEntries(sidebarEntries)

  // Find current page index (using normalized paths for comparison)
  const currentIndex = flatPages.findIndex(
    (page) => normalizePath(page.href) === normalizedCurrentPath,
  )

  // Check if this is an index/landing page not in the sidebar
  // Index pages are identified by having a doc but not being in the sidebar.
  // They typically have a path like /en/docs or /docs (the base docs path).
  // We detect this by checking if the current doc exists but isn't in flatPages.
  // Additionally, check if the doc ID matches common index patterns:
  // - Just a locale (e.g., 'en' from 'en/index.md')
  // - Empty or 'index'
  const docIdParts = currentDoc?.id?.split('/') ?? []
  const lastIdPart = docIdParts[docIdParts.length - 1]
  const isIndexPage =
    currentIndex === -1 &&
    currentDoc &&
    // Doc exists but not in sidebar - could be an index page
    // Check if the doc ID suggests it's an index (locale-only ID, 'index', or empty after locale)
    (docIdParts.length === 1 || lastIdPart === 'index' || lastIdPart === '')

  if (currentIndex === -1 && !isIndexPage) {
    // Current page not found in sidebar and not an index page - no pagination
    return {}
  }

  const result: PaginationInfo = {}

  // Special handling for index pages: they come before all sidebar items
  if (isIndexPage) {
    // Index page has no previous, and first sidebar item as next
    if (paginationPrev !== null && typeof paginationPrev === 'string') {
      const targetDoc = allDocs.find((doc) => doc.id === paginationPrev)
      if (targetDoc?.path) {
        result.prev = {
          title: targetDoc.sidebarLabel ?? targetDoc.title,
          href: targetDoc.path,
        }
      }
    }
    // No prev for index page (unless explicitly set above)

    if (paginationNext === null) {
      // Explicitly disabled
      result.next = undefined
    } else if (typeof paginationNext === 'string') {
      const targetDoc = allDocs.find((doc) => doc.id === paginationNext)
      if (targetDoc?.path) {
        result.next = {
          title: targetDoc.sidebarLabel ?? targetDoc.title,
          href: targetDoc.path,
        }
      }
    } else if (flatPages.length > 0) {
      // Use the first sidebar item as next
      result.next = flatPages[0]
    }

    return result
  }

  // Handle previous page
  if (paginationPrev === null) {
    // Explicitly disabled
    result.prev = undefined
  } else if (typeof paginationPrev === 'string') {
    // Explicitly set to a specific page ID
    const targetDoc = allDocs.find((doc) => doc.id === paginationPrev)
    if (targetDoc?.path) {
      result.prev = {
        title: targetDoc.sidebarLabel ?? targetDoc.title,
        href: targetDoc.path,
      }
    }
  } else if (currentIndex > 0) {
    // Use the previous page in sidebar order
    result.prev = flatPages[currentIndex - 1]
  }

  // Handle next page
  if (paginationNext === null) {
    // Explicitly disabled
    result.next = undefined
  } else if (typeof paginationNext === 'string') {
    // Explicitly set to a specific page ID
    const targetDoc = allDocs.find((doc) => doc.id === paginationNext)
    if (targetDoc?.path) {
      result.next = {
        title: targetDoc.sidebarLabel ?? targetDoc.title,
        href: targetDoc.path,
      }
    }
  } else if (currentIndex < flatPages.length - 1) {
    // Use the next page in sidebar order
    result.next = flatPages[currentIndex + 1]
  }

  return result
}
