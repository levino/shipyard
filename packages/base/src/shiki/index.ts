/**
 * Shiki transformers for enhanced code blocks.
 * Supports Docusaurus-style features like line numbers, line highlighting, and code block titles.
 */

import {
  complement,
  filter,
  includes,
  isEmpty,
  isNil,
  map,
  match,
  pipe,
  split,
  test,
  trim,
} from 'ramda'
import type { ShikiTransformer } from 'shiki'

/**
 * Parse line range string into array of line numbers.
 * Supports formats: "1", "1,3,5", "1-3", "1,3-5,7"
 *
 * @example
 * parseLineRange("1,3-5,7") // [1, 3, 4, 5, 7]
 */
const parseLineRange = (rangeStr: string): number[] => {
  const parseSegment = (segment: string): number[] => {
    const trimmed = trim(segment)
    if (test(/-/, trimmed)) {
      const [start, end] = split('-', trimmed).map(Number)
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }
    return [Number(trimmed)]
  }

  return pipe(
    split(','),
    filter(complement(isEmpty)),
    map(parseSegment),
    (arrays: number[][]) => arrays.flat(),
  )(rangeStr)
}

/**
 * Extract metadata from code block meta string.
 * Parses Docusaurus-style meta like: title="filename.js" {1,3-5} showLineNumbers
 */
interface CodeMeta {
  title?: string
  highlightLines: number[]
  showLineNumbers: boolean
  startLineNumber: number
}

const extractCodeMeta = (meta: string | undefined): CodeMeta => {
  if (isNil(meta) || isEmpty(meta)) {
    return {
      highlightLines: [],
      showLineNumbers: false,
      startLineNumber: 1,
    }
  }

  // Extract title from title="..." or title='...'
  const titleMatch = match(/title=["']([^"']+)["']/, meta)
  const title = titleMatch[1]

  // Extract line highlights from {1,3-5}
  const highlightMatch = match(/\{([^}]+)\}/, meta)
  const highlightLines = highlightMatch[1]
    ? parseLineRange(highlightMatch[1])
    : []

  // Check for showLineNumbers or showLineNumbers=N
  const showLineNumbers = test(/showLineNumbers/, meta)
  const startLineMatch = match(/showLineNumbers=(\d+)/, meta)
  const startLineNumber = startLineMatch[1] ? Number(startLineMatch[1]) : 1

  return {
    title,
    highlightLines,
    showLineNumbers,
    startLineNumber,
  }
}

/**
 * Transformer that adds a title bar above the code block.
 * Usage: ```js title="example.js"
 */
export const transformerCodeBlockTitle = (): ShikiTransformer => ({
  name: 'shipyard:code-block-title',
  pre(node) {
    const meta = extractCodeMeta(this.options.meta?.__raw)
    if (meta.title) {
      // Add data attribute for CSS styling
      node.properties['data-title'] = meta.title
      // Add class for styling
      const existingClass = (node.properties.class as string) || ''
      node.properties.class = `${existingClass} has-title`.trim()
    }
  },
})

/**
 * Transformer that adds line numbers to code blocks.
 * Usage: ```js showLineNumbers or ```js showLineNumbers=5
 */
export const transformerLineNumbers = (): ShikiTransformer => ({
  name: 'shipyard:line-numbers',
  pre(node) {
    const meta = extractCodeMeta(this.options.meta?.__raw)
    if (meta.showLineNumbers) {
      const existingClass = (node.properties.class as string) || ''
      node.properties.class = `${existingClass} line-numbers`.trim()
      node.properties['data-start-line'] = String(meta.startLineNumber)
      // Set CSS counter-reset for starting line number
      const existingStyle = (node.properties.style as string) || ''
      node.properties.style =
        `${existingStyle}; counter-reset: line ${meta.startLineNumber - 1};`.replace(
          /^;\s*/,
          '',
        )
    }
  },
  line(node, _line) {
    const meta = extractCodeMeta(this.options.meta?.__raw)
    if (meta.showLineNumbers) {
      // Add line class for CSS counter
      const existingClass = (node.properties.class as string) || ''
      node.properties.class = `${existingClass} line`.trim()
    }
  },
})

/**
 * Transformer that highlights specific lines.
 * Usage: ```js {1,3-5}
 */
export const transformerLineHighlight = (): ShikiTransformer => ({
  name: 'shipyard:line-highlight',
  line(node, line) {
    const meta = extractCodeMeta(this.options.meta?.__raw)
    if (includes(line, meta.highlightLines)) {
      const existingClass = (node.properties.class as string) || ''
      node.properties.class = `${existingClass} line highlighted`.trim()
    }
  },
})

/**
 * Transformer that processes magic comments for line highlighting.
 * Supports Docusaurus-style comments:
 * - // highlight-next-line
 * - // highlight-start / // highlight-end
 * - /* highlight-next-line * /
 * - # highlight-next-line (for bash/python)
 * - <!-- highlight-next-line --> (for HTML/Markdown)
 */
export const transformerMagicComments = (): ShikiTransformer => {
  const magicCommentPatterns = [
    /\/\/\s*highlight-next-line\s*$/,
    /\/\*\s*highlight-next-line\s*\*\/\s*$/,
    /#\s*highlight-next-line\s*$/,
    /<!--\s*highlight-next-line\s*-->\s*$/,
    /\/\/\s*highlight-start\s*$/,
    /\/\/\s*highlight-end\s*$/,
    /\/\*\s*highlight-start\s*\*\/\s*$/,
    /\/\*\s*highlight-end\s*\*\/\s*$/,
    /#\s*highlight-start\s*$/,
    /#\s*highlight-end\s*$/,
    /<!--\s*highlight-start\s*-->\s*$/,
    /<!--\s*highlight-end\s*-->\s*$/,
  ]

  const isMagicComment = (text: string): boolean =>
    magicCommentPatterns.some((pattern) => test(pattern, text))

  const isHighlightNext = (text: string): boolean =>
    test(/highlight-next-line/, text)

  const isHighlightStart = (text: string): boolean =>
    test(/highlight-start/, text)

  const isHighlightEnd = (text: string): boolean => test(/highlight-end/, text)

  return {
    name: 'shipyard:magic-comments',
    code(node) {
      let inHighlightBlock = false
      let highlightNextLine = false
      const linesToHighlight: number[] = []
      const linesToRemove: number[] = []

      // First pass: identify lines to highlight and magic comment lines
      const lines = node.children.filter((child) => child.type === 'element')
      lines.forEach((lineNode, index) => {
        // Extract text content from line
        const getText = (n: typeof lineNode): string => {
          if (n.type === 'text') return n.value
          if (n.type === 'element' && n.children) {
            return n.children.map(getText).join('')
          }
          return ''
        }
        const lineText = getText(lineNode)

        if (isMagicComment(lineText)) {
          linesToRemove.push(index)

          if (isHighlightNext(lineText)) {
            highlightNextLine = true
          } else if (isHighlightStart(lineText)) {
            inHighlightBlock = true
          } else if (isHighlightEnd(lineText)) {
            inHighlightBlock = false
          }
        } else {
          if (highlightNextLine || inHighlightBlock) {
            linesToHighlight.push(index)
          }
          highlightNextLine = false
        }
      })

      // Second pass: apply highlighting classes
      lines.forEach((lineNode, index) => {
        if (
          linesToHighlight.includes(index) &&
          lineNode.type === 'element' &&
          !linesToRemove.includes(index)
        ) {
          const existingClass = (lineNode.properties?.class as string) || ''
          lineNode.properties = lineNode.properties || {}
          lineNode.properties.class = `${existingClass} line highlighted`.trim()
        }
      })

      // Third pass: mark magic comment lines for hiding via CSS
      linesToRemove.forEach((index) => {
        const lineNode = lines[index]
        if (lineNode && lineNode.type === 'element') {
          const existingClass = (lineNode.properties?.class as string) || ''
          lineNode.properties = lineNode.properties || {}
          lineNode.properties.class =
            `${existingClass} magic-comment-line`.trim()
        }
      })
    },
  }
}

/**
 * Combined transformer that includes all code block enhancements.
 * Convenience export for easy configuration.
 */
export const shipyardCodeBlockTransformers = (): ShikiTransformer[] => [
  transformerCodeBlockTitle(),
  transformerLineNumbers(),
  transformerLineHighlight(),
  transformerMagicComments(),
]

export default shipyardCodeBlockTransformers
