import { compose, filter, isEmpty, length, not, pipe, split } from 'ramda'

/**
 * Reading time result with minutes and word count.
 */
export interface ReadingTime {
  /**
   * Estimated reading time in minutes.
   */
  minutes: number
  /**
   * Total word count.
   */
  words: number
  /**
   * Formatted reading time string (e.g., "5 min read")
   */
  text: string
}

/**
 * Average words per minute for reading speed calculation.
 * This is a standard estimate for technical content.
 */
const WORDS_PER_MINUTE = 200

/**
 * Strips markdown syntax from text for accurate word counting.
 * Removes:
 * - Code blocks
 * - Inline code
 * - Links (keeps text)
 * - Images
 * - HTML tags
 * - Frontmatter
 * - Headers markdown syntax
 */
const stripMarkdown = (text: string): string => {
  let cleaned = text
  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---/m, '')
  // Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '')
  // Remove inline code
  cleaned = cleaned.replace(/`[^`]+`/g, '')
  // Remove images
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '')
  // Remove links but keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  // Remove HTML tags (repeat until stable to avoid incomplete multi-character sanitization)
  {
    let previous: string
    do {
      previous = cleaned
      cleaned = cleaned.replace(/<[^>]+>/g, '')
    } while (cleaned !== previous)
  }
  // Remove markdown headers
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '')
  // Remove emphasis markers
  cleaned = cleaned.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
  // Remove horizontal rules
  cleaned = cleaned.replace(/^[-*_]{3,}$/gm, '')
  // Remove blockquotes
  cleaned = cleaned.replace(/^>\s+/gm, '')
  // Remove list markers
  cleaned = cleaned.replace(/^[-*+]\s+/gm, '')
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '')
  return cleaned
}

/**
 * Counts words in a string.
 */
const countWords: (text: string) => number = pipe(
  stripMarkdown,
  split(/\s+/),
  filter(compose(not, isEmpty)),
  length,
)

/**
 * Calculates reading time from word count.
 */
const calculateMinutes = (wordCount: number): number =>
  Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))

/**
 * Formats reading time as a human-readable string.
 */
const formatReadingTime = (minutes: number): string =>
  minutes === 1 ? '1 min read' : `${minutes} min read`

/**
 * Calculates reading time for markdown content.
 *
 * @param content - The markdown content (including frontmatter)
 * @returns Reading time information
 *
 * @example
 * ```ts
 * const readingTime = getReadingTime(post.body)
 * console.log(readingTime.text) // "5 min read"
 * console.log(readingTime.minutes) // 5
 * console.log(readingTime.words) // 1000
 * ```
 */
export const getReadingTime = (content: string): ReadingTime => {
  const words = countWords(content)
  const minutes = calculateMinutes(words)

  return {
    minutes,
    words,
    text: formatReadingTime(minutes),
  }
}

export default getReadingTime
