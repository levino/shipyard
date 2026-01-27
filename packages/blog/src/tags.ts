import { existsSync, readFileSync } from 'node:fs'
import { z } from 'astro/zod'
import { parse as parseYaml } from 'yaml'

/**
 * Schema for tag definition in tags.yml file.
 */
export const tagSchema = z.object({
  /**
   * Display label for the tag. If not provided, uses the tag key.
   */
  label: z.string().optional(),
  /**
   * Description of the tag for the tag page.
   */
  description: z.string().optional(),
  /**
   * Custom permalink for the tag. If not provided, uses the tag key.
   */
  permalink: z.string().optional(),
})

export type Tag = z.infer<typeof tagSchema>

export type TagsMap = Record<string, Tag>

/**
 * Load and parse tags from a YAML file.
 *
 * @param tagsMapPath - Path to the tags.yml file (relative to project root)
 * @returns Parsed tags map, or empty object if file doesn't exist
 */
export const loadTagsMap = (tagsMapPath?: string): TagsMap => {
  if (!tagsMapPath) return {}

  // Resolve relative to CWD (project root)
  const resolvedPath = tagsMapPath.startsWith('/')
    ? tagsMapPath
    : `${process.cwd()}/${tagsMapPath}`

  if (!existsSync(resolvedPath)) {
    return {}
  }

  const fileContent = readFileSync(resolvedPath, 'utf-8')
  const rawData = parseYaml(fileContent)

  if (!rawData || typeof rawData !== 'object') {
    return {}
  }

  // Validate each tag against the schema
  const result: TagsMap = {}
  for (const [key, value] of Object.entries(rawData)) {
    const parsed = tagSchema.safeParse(value)
    if (parsed.success) {
      result[key.toLowerCase()] = parsed.data
    }
  }

  return result
}

/**
 * Get tag metadata by tag key.
 *
 * @param tagsMap - The loaded tags map
 * @param tagKey - The tag key to look up (case-insensitive)
 * @returns Tag metadata if found, undefined otherwise
 */
export const getTagMetadata = (
  tagsMap: TagsMap,
  tagKey: string,
): Tag | undefined => {
  return tagsMap[tagKey.toLowerCase()]
}

/**
 * Get the display label for a tag.
 *
 * @param tagsMap - The loaded tags map
 * @param tagKey - The tag key
 * @returns The display label (custom label or the tag key itself)
 */
export const getTagLabel = (tagsMap: TagsMap, tagKey: string): string => {
  const metadata = getTagMetadata(tagsMap, tagKey)
  return metadata?.label ?? tagKey
}

/**
 * Get the permalink for a tag.
 *
 * @param tagsMap - The loaded tags map
 * @param tagKey - The tag key
 * @returns The permalink (custom or tag key as lowercase)
 */
export const getTagPermalink = (tagsMap: TagsMap, tagKey: string): string => {
  const metadata = getTagMetadata(tagsMap, tagKey)
  return metadata?.permalink ?? tagKey.toLowerCase()
}

/**
 * Get the description for a tag.
 *
 * @param tagsMap - The loaded tags map
 * @param tagKey - The tag key
 * @returns The description if defined, undefined otherwise
 */
export const getTagDescription = (
  tagsMap: TagsMap,
  tagKey: string,
): string | undefined => {
  const metadata = getTagMetadata(tagsMap, tagKey)
  return metadata?.description
}
