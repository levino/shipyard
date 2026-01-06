/**
 * Utility functions for fallback values in documentation pages.
 * Used when frontmatter fields are not explicitly provided.
 */

/**
 * Extracts the first paragraph from markdown content.
 * Used as a fallback for the description field when not provided in frontmatter.
 *
 * @param body - The markdown content body (without frontmatter)
 * @returns The first paragraph text, or undefined if no paragraph found
 */
export const extractFirstParagraph = (body: string): string | undefined => {
  // Skip headings (lines starting with `#`)
  // Return first non-empty paragraph text
  const lines = body.split('\n')
  const paragraphLines: string[] = []
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Track code block state
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }

    // Skip content inside code blocks
    if (inCodeBlock) {
      continue
    }

    // Skip empty lines before we've started collecting
    if (!trimmed) {
      if (paragraphLines.length > 0) {
        // End of first paragraph
        break
      }
      continue
    }

    // Skip headings
    if (trimmed.startsWith('#')) {
      continue
    }

    // Skip images
    if (trimmed.startsWith('![')) {
      continue
    }

    // Skip HTML comments
    if (trimmed.startsWith('<!--')) {
      continue
    }

    // Skip list items (they're not paragraphs)
    if (
      trimmed.startsWith('-') ||
      trimmed.startsWith('*') ||
      /^\d+\./.test(trimmed)
    ) {
      continue
    }

    // Skip blockquotes
    if (trimmed.startsWith('>')) {
      continue
    }

    // Skip horizontal rules
    if (/^[-*_]{3,}$/.test(trimmed)) {
      continue
    }

    // This is part of a paragraph
    paragraphLines.push(trimmed)
  }

  return paragraphLines.length > 0 ? paragraphLines.join(' ') : undefined
}
