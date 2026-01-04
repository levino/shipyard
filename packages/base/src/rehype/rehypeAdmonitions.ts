import type { Element, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export type AdmonitionType =
  | 'note'
  | 'tip'
  | 'info'
  | 'warning'
  | 'danger'
  | 'caution'

const TYPE_CONFIG: Record<
  AdmonitionType,
  { icon: string; defaultTitle: string; borderClass: string; bgClass: string }
> = {
  note: {
    icon: '📝',
    defaultTitle: 'Note',
    borderClass: 'border-info',
    bgClass: 'bg-info/10',
  },
  tip: {
    icon: '💡',
    defaultTitle: 'Tip',
    borderClass: 'border-success',
    bgClass: 'bg-success/10',
  },
  info: {
    icon: 'ℹ️',
    defaultTitle: 'Info',
    borderClass: 'border-info',
    bgClass: 'bg-info/10',
  },
  warning: {
    icon: '⚠️',
    defaultTitle: 'Warning',
    borderClass: 'border-warning',
    bgClass: 'bg-warning/10',
  },
  danger: {
    icon: '🚨',
    defaultTitle: 'Danger',
    borderClass: 'border-error',
    bgClass: 'bg-error/10',
  },
  caution: {
    icon: '⚠️',
    defaultTitle: 'Caution',
    borderClass: 'border-warning',
    bgClass: 'bg-warning/10',
  },
}

const rehypeAdmonitions: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(
      tree,
      'element',
      (
        node: Element,
        index: number | undefined,
        parent: Element | Root | undefined,
      ) => {
        if (
          node.tagName !== 'admonition' ||
          index === undefined ||
          parent === undefined
        )
          return

        const properties = node.properties as {
          name?: AdmonitionType
          title?: string
        }
        const admonitionType = (properties.name ?? 'note') as AdmonitionType
        const config = TYPE_CONFIG[admonitionType] ?? TYPE_CONFIG.note
        const displayTitle = properties.title ?? config.defaultTitle

        const admonitionElement: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: [
              'admonition',
              'my-4',
              'rounded-lg',
              'border-l-4',
              'p-4',
              config.borderClass,
              config.bgClass,
            ],
            role: 'note',
            ariaLabel: displayTitle,
          },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: [
                  'admonition-heading',
                  'mb-2',
                  'flex',
                  'items-center',
                  'gap-2',
                  'font-semibold',
                ],
              },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    className: ['admonition-icon'],
                    ariaHidden: 'true',
                  },
                  children: [{ type: 'text', value: config.icon }],
                },
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { className: ['admonition-title'] },
                  children: [{ type: 'text', value: displayTitle }],
                },
              ],
            },
            {
              type: 'element',
              tagName: 'div',
              properties: {
                className: [
                  'admonition-content',
                  'prose',
                  'prose-sm',
                  'max-w-none',
                ],
              },
              children: node.children,
            },
          ],
        }

        if ('children' in parent && Array.isArray(parent.children)) {
          parent.children[index] = admonitionElement
        }
      },
    )
  }
}

export default rehypeAdmonitions
