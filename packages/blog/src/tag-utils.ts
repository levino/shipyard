import type { Tag } from './index.ts'

/**
 * Type definition for a tags map (tag key -> Tag data)
 */
export type TagsMap = Map<string, Tag>

/**
 * Build a tags map from collection entries.
 * This helper processes tag entries and creates a map for quick lookup.
 *
 * @param tagsEntries - The entries from getCollection('tags')
 * @param options - Configuration options
 * @param options.i18n - Whether i18n is enabled
 * @param options.currentLocale - The current locale (required if i18n is true)
 * @returns A map of tag keys to tag data
 */
export const buildTagsMap = <T extends { id: string; data: unknown }>(
  tagsEntries: T[],
  options: { i18n: boolean; currentLocale?: string },
): TagsMap => {
  const tagsMap = new Map<string, Tag>()

  for (const entry of tagsEntries) {
    if (options.i18n) {
      // For i18n, filter by current locale (entry.id format: "locale/tag-key")
      const [locale, ...rest] = entry.id.split('/')
      if (locale === options.currentLocale) {
        const tagKey = rest.join('/')
        tagsMap.set(tagKey, entry.data as Tag)
      }
    } else {
      // For non-i18n, use entry.id directly as the tag key
      tagsMap.set(entry.id, entry.data as Tag)
    }
  }

  return tagsMap
}

/**
 * Get the display label for a tag.
 *
 * @param tagValue - The tag value/key
 * @param tagsMap - The tags map built from the collection
 * @returns The display label, or the tag value if not found in the map
 */
export const getTagLabel = (tagValue: string, tagsMap: TagsMap): string => {
  const tagDef = tagsMap.get(tagValue)
  return tagDef?.label || tagValue
}

/**
 * Get the permalink URL for a tag.
 *
 * @param tagValue - The tag value/key
 * @param tagsMap - The tags map built from the collection
 * @param options - Configuration options
 * @param options.i18n - Whether i18n is enabled
 * @param options.currentLocale - The current locale (required if i18n is true)
 * @returns The full URL path for the tag page
 */
export const getTagPermalink = (
  tagValue: string,
  tagsMap: TagsMap,
  options: { i18n: boolean; currentLocale?: string },
): string => {
  const tagDef = tagsMap.get(tagValue)
  const permalink = tagDef?.permalink || tagValue
  const basePath = options.i18n
    ? `/${options.currentLocale}/blog/tags`
    : '/blog/tags'
  return `${basePath}/${encodeURIComponent(permalink)}`
}
