/**
 * Strips HTML tags from content using a loop-based approach to handle nested tags.
 * This avoids incomplete sanitization vulnerabilities where patterns like "<scr<script>ipt>"
 * could bypass simple regex replacements.
 *
 * @param html - The HTML content to strip tags from
 * @returns The text content with all HTML tags removed
 */
const stripHtmlTags = (html: string): string => {
  let result = html
  let previousLength: number

  // Keep removing tags until no more are found
  // This handles cases like "<scr<script>ipt>" which would become "<script>" after first pass
  do {
    previousLength = result.length
    result = result.replace(/<[^>]*>/g, '')
  } while (result.length !== previousLength)

  return result
}

/**
 * Calculates the estimated reading time for a given text.
 *
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed in words per minute (default: 200)
 * @returns An object containing the reading time in minutes and a formatted string
 */
export const calculateReadingTime = (
  text: string,
  wordsPerMinute: number = 200,
): { minutes: number; text: string } => {
  // Remove markdown/HTML tags for more accurate word count
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove links/images
    .replace(/[#*_~`]/g, '') // Remove markdown formatting

  // Use loop-based HTML stripping to handle nested/incomplete tags
  const strippedText = stripHtmlTags(cleanText)

  // Count words
  const words = strippedText.split(/\s+/).filter((word) => word.length > 0)
  const wordCount = words.length

  // Calculate reading time
  const minutes = Math.ceil(wordCount / wordsPerMinute)

  // Format the reading time string
  const formattedText = minutes === 1 ? '1 min read' : `${minutes} min read`

  return {
    minutes,
    text: formattedText,
  }
}

export default calculateReadingTime
