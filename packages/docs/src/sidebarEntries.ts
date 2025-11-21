import type { Entry } from '@levino/shipyard-base'

export interface DocsData {
  id: string
  title: string
  path: string
  link?: boolean
  sidebarPosition?: number
  sidebarLabel?: string
  sidebarClassName?: string
  sidebarCustomProps?: Record<string, unknown>
}

export interface CategoryMetadata {
  label?: string
  position?: number
  className?: string
  customProps?: Record<string, unknown>
  link?: { type: 'doc'; id: string } | { type: 'generated-index' }
}

export type CategoryMap = Record<string, CategoryMetadata>

interface TreeNode {
  key: string
  label: string
  href?: string
  position: number
  className?: string
  customProps?: Record<string, unknown>
  children: Record<string, TreeNode>
}

const DEFAULT_POSITION = 0

const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
  return [...nodes].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position
    }
    return a.label.localeCompare(b.label)
  })
}

const nodeToEntry = (node: TreeNode): Entry[string] => {
  const item: Entry[string] = {
    label: node.label,
  }
  if (node.href) {
    item.href = node.href
  }
  if (node.className) {
    item.className = node.className
  }
  if (node.customProps) {
    // Casting to Record<string, any> as Entry likely expects looser types
    // biome-ignore lint/suspicious/noExplicitAny: Match Entry type
    item.customProps = node.customProps as Record<string, any>
  }

  const childrenKeys = Object.keys(node.children)
  if (childrenKeys.length > 0) {
    const sortedChildren = sortNodes(Object.values(node.children))
    item.subEntry = sortedChildren.reduce<Entry>((acc, child) => {
      acc[child.key] = nodeToEntry(child)
      return acc
    }, {})
  }
  return item
}

// Pure recursive insert function
const insertDoc = (
  root: Record<string, TreeNode>,
  pathParts: string[],
  doc: DocsData,
  categoryMap: CategoryMap,
  currentPath: string = '',
): Record<string, TreeNode> => {
  if (pathParts.length === 0) return root

  const [head, ...tail] = pathParts
  const nodePath = currentPath ? `${currentPath}/${head}` : head

  const existingNode = root[head]
  const meta = categoryMap[nodePath]

  // Create new node or copy existing one (immutable)
  const node: TreeNode = existingNode
    ? { ...existingNode }
    : {
        key: head,
        label: meta?.label ?? head,
        position: meta?.position ?? DEFAULT_POSITION,
        className: meta?.className,
        customProps: meta?.customProps,
        children: {},
      }

  // If leaf (doc)
  if (tail.length === 0) {
    return {
      ...root,
      [head]: {
        ...node,
        label: doc.sidebarLabel ?? doc.title ?? node.label,
        href: doc.link ? doc.path : undefined,
        position:
          doc.sidebarPosition !== undefined
            ? doc.sidebarPosition
            : node.position,
        className: doc.sidebarClassName ?? node.className,
        customProps: doc.sidebarCustomProps ?? node.customProps,
      },
    }
  }

  // Recurse
  return {
    ...root,
    [head]: {
      ...node,
      children: insertDoc(node.children, tail, doc, categoryMap, nodePath),
    },
  }
}

export const toSidebarEntries = (
  docs: DocsData[],
  categoryMap: CategoryMap = {},
): Entry => {
  const rootTree = docs.reduce<Record<string, TreeNode>>((acc, doc) => {
    const cleanId = doc.id.replace(/\.[^/.]+$/, '')
    const parts = cleanId.split('/')
    const filename = parts[parts.length - 1]
    const isIndex = filename === 'index'
    const pathParts = isIndex ? parts.slice(0, -1) : parts

    return insertDoc(acc, pathParts, doc, categoryMap)
  }, {})

  const sortedNodes = sortNodes(Object.values(rootTree))

  return sortedNodes.reduce<Entry>((acc, node) => {
    acc[node.key] = nodeToEntry(node)
    return acc
  }, {})
}
