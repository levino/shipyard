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
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/[#*_~`]/g, '') // Remove markdown formatting

  // Count words
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0)
  const wordCount = words.length

  // Calculate reading time
  const minutes = Math.ceil(wordCount / wordsPerMinute)

  // Format the reading time string
  const text_result = minutes === 1 ? '1 min read' : `${minutes} min read`

  return {
    minutes,
    text: text_result,
  }
}

export default calculateReadingTime
