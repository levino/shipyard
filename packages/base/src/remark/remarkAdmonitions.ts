import type { Root } from 'mdast'
import type { ContainerDirective } from 'mdast-util-directive'
// `mdast-util-to-hast` augments mdast's `Data` with `hName`/`hProperties`, which
// this plugin sets. Imported explicitly so the augmentation is present when a
// consumer compiles this file, not just via a transitive dev dependency.
import type {} from 'mdast-util-to-hast'
import { includes, pipe, toLower } from 'ramda'
import type { Plugin } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

/**
 * Admonition types supported by shipyard.
 * Maps to Docusaurus-style admonition types.
 */
export type AdmonitionType = 'note' | 'tip' | 'info' | 'warning' | 'danger'

const ADMONITION_TYPES: ReadonlyArray<AdmonitionType> = [
  'note',
  'tip',
  'info',
  'warning',
  'danger',
]

/**
 * Type guard to check if a string is a valid admonition type.
 */
const isAdmonitionType = (name: string): name is AdmonitionType =>
  pipe(toLower, (n: string) => includes(n, ADMONITION_TYPES))(name)

/**
 * Gets the default title for an admonition type.
 */
const getDefaultTitle = (type: AdmonitionType): string => {
  const titles: Record<AdmonitionType, string> = {
    note: 'Note',
    tip: 'Tip',
    info: 'Info',
    warning: 'Warning',
    danger: 'Danger',
  }
  return titles[type]
}

/**
 * Remark plugin to transform container directives into admonitions.
 *
 * This plugin is automatically registered by the shipyard integration.
 * You don't need to configure it manually.
 *
 * It works with remark-directive to transform:
 * ```markdown
 * :::note
 * This is a note
 * :::
 *
 * :::warning[Be Careful]
 * This is a warning with custom title
 * :::
 * ```
 *
 * Into properly structured admonition HTML.
 */
export const remarkAdmonitions: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      const directiveName = node.name

      if (!isAdmonitionType(directiveName)) {
        return
      }

      const type = toLower(directiveName) as AdmonitionType
      // NOTE: container directives carry no `label` field. `:::note[Custom]`
      // is parsed by mdast-util-directive into a first child paragraph with
      // `data.directiveLabel === true`, so custom titles are not picked up
      // here and the default title is used for every admonition.
      const title = getDefaultTitle(type)

      // Set up the data for hast transformation
      if (!node.data) {
        node.data = {}
      }
      const data = node.data

      // Transform to a div with admonition classes
      data.hName = 'div'
      data.hProperties = {
        className: [`admonition`, `admonition-${type}`],
        'data-admonition-type': type,
      }

      // Wrap the content with heading and content divs
      // We need to transform the children structure
      const headingNode = {
        type: 'paragraph' as const,
        data: {
          hName: 'div',
          hProperties: {
            className: ['admonition-heading'],
          },
        },
        children: [
          {
            type: 'text' as const,
            value: title,
          },
        ],
      }

      const contentNode = {
        type: 'paragraph' as const,
        data: {
          hName: 'div',
          hProperties: {
            className: ['admonition-content'],
          },
        },
        children: node.children,
      }

      // Replace children with our structured content
      node.children = [headingNode, contentNode] as typeof node.children

      return SKIP
    })
  }
}

export default remarkAdmonitions
