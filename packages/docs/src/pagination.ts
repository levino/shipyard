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
  // Find the current doc to check for pagination overrides
  const currentDoc = allDocs.find((doc) => doc.path === currentPath)

  // Check for explicit pagination overrides in frontmatter
  const paginationNext = currentDoc?.['pagination_next' as keyof DocsData]
  const paginationPrev = currentDoc?.['pagination_prev' as keyof DocsData]

  // If explicitly disabled (null), return empty pagination
  if (paginationNext === null && paginationPrev === null) {
    return {}
  }

  // Flatten the sidebar to get ordered list of pages
  const flatPages = flattenSidebarEntries(sidebarEntries)

  // Find current page index
  const currentIndex = flatPages.findIndex((page) => page.href === currentPath)

  if (currentIndex === -1) {
    // Current page not found in sidebar - no pagination
    return {}
  }

  const result: PaginationInfo = {}

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
