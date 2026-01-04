import type { Paragraph, Parent, Root, Text } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export type AdmonitionType =
  | 'note'
  | 'tip'
  | 'info'
  | 'warning'
  | 'danger'
  | 'caution'

const ADMONITION_TYPES = new Set<string>([
  'note',
  'tip',
  'info',
  'warning',
  'danger',
  'caution',
])

interface AdmonitionNode {
  type: 'admonition'
  name: AdmonitionType
  title?: string
  children: Parent['children']
}

declare module 'mdast' {
  interface RootContentMap {
    admonition: AdmonitionNode
  }
}

const ADMONITION_REGEX =
  /^:::(note|tip|info|warning|danger|caution)(?:\[(.+?)\])?\s*$/

const remarkAdmonitions: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const nodesToReplace: Array<{
      parent: Parent
      startIndex: number
      endIndex: number
      admonition: AdmonitionNode
    }> = []

    visit(
      tree,
      'paragraph',
      (
        node: Paragraph,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (index === undefined || parent === undefined) return

        const firstChild = node.children[0]
        if (!firstChild || firstChild.type !== 'text') return

        const textContent = firstChild.value
        const match = textContent.match(ADMONITION_REGEX)

        if (!match) return

        const admonitionType = match[1] as AdmonitionType
        const customTitle = match[2]

        let endIndex = -1
        for (
          let searchIndex = index + 1;
          searchIndex < parent.children.length;
          searchIndex++
        ) {
          const searchNode = parent.children[searchIndex]
          if (searchNode.type === 'paragraph') {
            const searchFirstChild = (searchNode as Paragraph).children[0]
            if (searchFirstChild && searchFirstChild.type === 'text') {
              const searchText = (searchFirstChild as Text).value
              if (searchText.trim() === ':::') {
                endIndex = searchIndex
                break
              }
            }
          }
        }

        if (endIndex === -1) return

        const contentNodes = parent.children.slice(index + 1, endIndex)

        nodesToReplace.push({
          parent,
          startIndex: index,
          endIndex,
          admonition: {
            type: 'admonition',
            name: admonitionType,
            title: customTitle,
            children: contentNodes as Parent['children'],
          },
        })
      },
    )

    for (
      let replacementIndex = nodesToReplace.length - 1;
      replacementIndex >= 0;
      replacementIndex--
    ) {
      const { parent, startIndex, endIndex, admonition } =
        nodesToReplace[replacementIndex]
      const count = endIndex - startIndex + 1
      parent.children.splice(
        startIndex,
        count,
        admonition as unknown as (typeof parent.children)[number],
      )
    }
  }
}

export default remarkAdmonitions
