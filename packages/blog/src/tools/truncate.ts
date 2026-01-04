/**
 * Truncates content at the specified marker.
 *
 * @param content - The full content to truncate
 * @param marker - The truncation marker to look for (default: '<!--truncate-->')
 * @returns An object containing the excerpt and whether the content was truncated
 */
export const truncateAtMarker = (
  content: string,
  marker: string = '<!--truncate-->',
): { excerpt: string; isTruncated: boolean } => {
  const markerIndex = content.indexOf(marker)

  if (markerIndex === -1) {
    return {
      excerpt: content,
      isTruncated: false,
    }
  }

  return {
    excerpt: content.slice(0, markerIndex).trim(),
    isTruncated: true,
  }
}

/**
 * Gets all tags from a collection of blog posts.
 *
 * @param posts - Array of blog posts with optional tags
 * @returns A map of tag names to their count and associated posts
 */
export const getAllTags = <T extends { data: { tags?: string[] }; id: string }>(
  posts: readonly T[],
): Map<string, { count: number; posts: T[] }> => {
  const tagMap = new Map<string, { count: number; posts: T[] }>()

  for (const post of posts) {
    const tags = post.data.tags ?? []
    for (const tag of tags) {
      const existing = tagMap.get(tag)
      if (existing) {
        existing.count++
        existing.posts.push(post)
      } else {
        tagMap.set(tag, { count: 1, posts: [post] })
      }
    }
  }

  return tagMap
}

/**
 * Creates a URL-safe slug from a tag name.
 *
 * @param tag - The tag name to slugify
 * @returns A URL-safe slug
 */
export const tagToSlug = (tag: string): string => {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Groups posts by year for archive display.
 *
 * @param posts - Array of blog posts with dates
 * @returns Posts grouped by year, sorted in descending order
 */
export const groupPostsByYear = <T extends { data: { date: Date } }>(
  posts: readonly T[],
): Map<number, T[]> => {
  const yearMap = new Map<number, T[]>()

  for (const post of posts) {
    const year = post.data.date.getFullYear()
    const existing = yearMap.get(year)
    if (existing) {
      existing.push(post)
    } else {
      yearMap.set(year, [post])
    }
  }

  // Sort by year descending
  return new Map(
    [...yearMap.entries()].sort(([yearA], [yearB]) => yearB - yearA),
  )
}

export default truncateAtMarker
