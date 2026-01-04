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
  let cleanText = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove links/images

  // Remove HTML tags iteratively to handle nested/obfuscated tags like <scr<script>ipt>
  let previousText: string
  do {
    previousText = cleanText
    cleanText = cleanText.replace(/<[^>]+>/g, '')
  } while (cleanText !== previousText)

  cleanText = cleanText.replace(/[#*_~`]/g, '') // Remove markdown formatting

  // Count words
  const words = cleanText.split(/\s+/).filter((word) => word.length > 0)
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
