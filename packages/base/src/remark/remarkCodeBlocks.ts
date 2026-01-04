import type { Code, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export interface CodeBlockMeta {
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

/**
 * Parses the meta string from a code block fence.
 *
 * Supports:
 * - title="filename.js" or title='filename.js'
 * - showLineNumbers
 * - {1,3-5} for line highlighting
 *
 * @example
 * ```js title="example.js" showLineNumbers {1,3-5}
 */
export const parseCodeMeta = (meta: string | undefined): CodeBlockMeta => {
  if (!meta) return {}

  const result: CodeBlockMeta = {}

  // Extract title
  const titleMatch = meta.match(/title=["']([^"']+)["']/)
  if (titleMatch) {
    result.title = titleMatch[1]
  }

  // Check for showLineNumbers
  if (meta.includes('showLineNumbers')) {
    result.showLineNumbers = true
  }

  // Extract line highlights {1,3-5,7}
  // Use a specific pattern that only matches valid highlight syntax (numbers, commas, dashes, spaces)
  // to avoid ReDoS vulnerability with arbitrary content inside braces
  const highlightMatch = meta.match(/\{([\d\s,-]+)\}/)
  if (highlightMatch) {
    const highlightSpec = highlightMatch[1]
    const lines: number[] = []

    const parts = highlightSpec.split(',')
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        // Range: 3-5
        const [startStr, endStr] = trimmed.split('-')
        const start = parseInt(startStr, 10)
        const end = parseInt(endStr, 10)
        if (!isNaN(start) && !isNaN(end)) {
          for (let lineNum = start; lineNum <= end; lineNum++) {
            lines.push(lineNum)
          }
        }
      } else {
        // Single line
        const line = parseInt(trimmed, 10)
        if (!isNaN(line)) {
          lines.push(line)
        }
      }
    }

    if (lines.length > 0) {
      result.highlightLines = lines
    }
  }

  return result
}

/**
 * Remark plugin that enhances code blocks with metadata.
 *
 * Adds data attributes to code blocks for:
 * - Title/filename display
 * - Line numbers
 * - Line highlighting
 */
const remarkCodeBlocks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      const meta = parseCodeMeta(node.meta ?? undefined)

      // Store metadata in node data for use by rehype/rendering
      if (!node.data) {
        node.data = {}
      }

      const hProperties = (node.data.hProperties ?? {}) as Record<
        string,
        unknown
      >

      if (meta.title) {
        hProperties['data-code-title'] = meta.title
      }

      if (meta.showLineNumbers) {
        hProperties['data-line-numbers'] = 'true'
      }

      if (meta.highlightLines && meta.highlightLines.length > 0) {
        hProperties['data-highlight-lines'] = meta.highlightLines.join(',')
      }

      node.data.hProperties = hProperties
    })
  }
}

export default remarkCodeBlocks
