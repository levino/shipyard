import type { TagLocaleData } from './index.ts'

/**
 * Type definition for a tags map (tag key -> TagLocaleData for the current locale)
 */
export type TagsMap = Map<string, TagLocaleData>

/**
 * Check if a value is a flat structure (TagLocaleData) or locale-nested
 */
const isTagLocaleData = (value: unknown): value is TagLocaleData => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'label' in value &&
    typeof (value as Record<string, unknown>).label === 'string'
  )
}

/**
 * Build a tags map from collection entries.
 * Handles both flat structure (non-i18n) and nested locale structure (i18n).
 *
 * With file loader, each entry has:
 * - id: the tag key (e.g., "harvest-report")
 * - data: either { label, description } or { en: { label }, de: { label } }
 *
 * @param tagsEntries - The entries from getCollection('tags')
 * @param options - Configuration options
 * @param options.i18n - Whether i18n is enabled
 * @param options.currentLocale - The current locale (required if i18n is true)
 * @returns A map of tag keys to tag locale data
 */
export const buildTagsMap = <T extends { id: string; data: unknown }>(
  tagsEntries: T[],
  options: { i18n: boolean; currentLocale?: string },
): TagsMap => {
  const tagsMap = new Map<string, TagLocaleData>()

  for (const entry of tagsEntries) {
    const tagKey = entry.id
    const data = entry.data

    if (isTagLocaleData(data)) {
      // Non-i18n: flat structure with label/description/permalink
      tagsMap.set(tagKey, data)
    } else if (typeof data === 'object' && data !== null) {
      // i18n: locale-nested structure where keys are locale codes
      if (options.i18n && options.currentLocale) {
        const localeData = (data as Record<string, TagLocaleData>)[
          options.currentLocale
        ]
        if (localeData && isTagLocaleData(localeData)) {
          tagsMap.set(tagKey, localeData)
        }
      }
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
