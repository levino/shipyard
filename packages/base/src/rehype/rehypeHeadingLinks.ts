import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import type { Element, ElementContent, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/** Headings that get a link to their own anchor. */
const LINKED_HEADINGS = new Set(['h2', 'h3', 'h4'])

/** CSS class of the link that wraps a heading's content. */
export const HEADING_LINK_CLASS = 'heading-link'

const containsLink = (nodes: ElementContent[]): boolean =>
  nodes.some(
    (node) =>
      node.type === 'element' &&
      (node.tagName === 'a' || containsLink(node.children)),
  )

/**
 * Turns the content of every `h2`–`h4` into a link to the heading's own
 * anchor (`<h2 id="setup"><a href="#setup" class="heading-link">Setup</a></h2>`),
 * so readers can click a heading and copy its URL from the address bar.
 *
 * Heading IDs are normally added by Astro after all user rehype plugins have
 * run. This plugin adds them first with Astro's own `rehypeHeadingIds`, so the
 * IDs, the slugs in the table of contents and the link targets stay
 * identical. Headings that already contain a link are left alone, because
 * links cannot be nested.
 */
export const rehypeHeadingLinks: Plugin<[], Root> = () => {
  const addIds = rehypeHeadingIds()
  return (tree, file) => {
    // Astro's transformer is synchronous; the callback is never needed.
    addIds?.(tree, file, () => {})
    visit(tree, 'element', (node: Element) => {
      if (!LINKED_HEADINGS.has(node.tagName)) return
      const id = node.properties?.id
      if (typeof id !== 'string' || id === '') return
      if (node.children.length === 0 || containsLink(node.children)) return
      node.children = [
        {
          type: 'element',
          tagName: 'a',
          properties: { href: `#${id}`, className: [HEADING_LINK_CLASS] },
          children: node.children,
        },
      ]
    })
  }
}
