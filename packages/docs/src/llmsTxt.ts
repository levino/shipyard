/**
 * llms.txt generation utilities for shipyard-docs.
 *
 * This module provides utilities to generate llms.txt and llms-full.txt files
 * following the specification at https://llmstxt.org/
 *
 * The llms.txt format helps LLMs efficiently parse and understand documentation
 * by providing a structured markdown index of all documentation pages.
 */

/**
 * Configuration for llms.txt generation.
 */
export interface LlmsTxtConfig {
  /**
   * Whether to enable llms.txt generation.
   * @default false
   */
  enabled?: boolean
  /**
   * The project name to use as the H1 heading.
   * If not provided, the title from the shipyard-base configuration will be used.
   */
  projectName?: string
  /**
   * A concise summary of the project displayed as a blockquote.
   * This should help LLMs quickly understand what the project is about.
   */
  summary?: string
  /**
   * Optional additional description paragraphs.
   * Displayed after the summary blockquote.
   */
  description?: string
  /**
   * Custom section title for the documentation links.
   * @default 'Documentation'
   */
  sectionTitle?: string
}

/**
 * Represents a documentation page for llms.txt generation.
 */
export interface LlmsDocEntry {
  /**
   * The URL path to the documentation page.
   */
  path: string
  /**
   * The title of the documentation page.
   */
  title: string
  /**
   * Optional description of what the page covers.
   */
  description?: string
  /**
   * The full rendered content of the page (used for llms-full.txt).
   */
  content?: string
  /**
   * Position for sorting (lower numbers come first).
   */
  position?: number
}

/**
 * Generates the content for llms.txt following the specification.
 *
 * @param entries - Array of documentation entries to include
 * @param config - Configuration options
 * @param baseUrl - Base URL of the site (e.g., 'https://docs.example.com')
 * @returns The generated llms.txt content as a string
 */
export function generateLlmsTxt(
  entries: LlmsDocEntry[],
  config: LlmsTxtConfig,
  baseUrl: string,
): string {
  const lines: string[] = []

  // H1 title (required)
  const projectName = config.projectName ?? 'Documentation'
  lines.push(`# ${projectName}`)
  lines.push('')

  // Blockquote summary (recommended)
  if (config.summary) {
    lines.push(`> ${config.summary}`)
    lines.push('')
  }

  // Additional description
  if (config.description) {
    lines.push(config.description)
    lines.push('')
  }

  // Documentation section
  const sectionTitle = config.sectionTitle ?? 'Documentation'
  lines.push(`## ${sectionTitle}`)
  lines.push('')

  // Sort entries by position, then by title
  const sortedEntries = [...entries].sort((a, b) => {
    const posA = a.position ?? Number.POSITIVE_INFINITY
    const posB = b.position ?? Number.POSITIVE_INFINITY
    if (posA !== posB) return posA - posB
    return a.title.localeCompare(b.title)
  })

  // Generate links
  for (const entry of sortedEntries) {
    const url = new URL(entry.path, baseUrl).toString()
    const description = entry.description ? `: ${entry.description}` : ''
    lines.push(`- [${entry.title}](${url})${description}`)
  }

  lines.push('')
  return lines.join('\n')
}

/**
 * Generates the content for llms-full.txt with complete documentation content.
 *
 * @param entries - Array of documentation entries with content
 * @param config - Configuration options
 * @param baseUrl - Base URL of the site
 * @returns The generated llms-full.txt content as a string
 */
export function generateLlmsFullTxt(
  entries: LlmsDocEntry[],
  config: LlmsTxtConfig,
  baseUrl: string,
): string {
  const lines: string[] = []

  // H1 title (required)
  const projectName = config.projectName ?? 'Documentation'
  lines.push(`# ${projectName}`)
  lines.push('')

  // Blockquote summary (recommended)
  if (config.summary) {
    lines.push(`> ${config.summary}`)
    lines.push('')
  }

  // Additional description
  if (config.description) {
    lines.push(config.description)
    lines.push('')
  }

  lines.push('---')
  lines.push('')

  // Sort entries by position, then by title
  const sortedEntries = [...entries].sort((a, b) => {
    const posA = a.position ?? Number.POSITIVE_INFINITY
    const posB = b.position ?? Number.POSITIVE_INFINITY
    if (posA !== posB) return posA - posB
    return a.title.localeCompare(b.title)
  })

  // Include full content of each document
  for (const entry of sortedEntries) {
    const url = new URL(entry.path, baseUrl).toString()
    lines.push(`## ${entry.title}`)
    lines.push('')
    lines.push(`URL: ${url}`)
    lines.push('')
    if (entry.content) {
      lines.push(entry.content.trim())
      lines.push('')
    }
    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}
