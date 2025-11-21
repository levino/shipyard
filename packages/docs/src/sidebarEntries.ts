import type { Entry } from '@levino/shipyard-base'

export interface DocsData {
  id: string
  title: string
  path: string
  link?: boolean
  sidebarPosition?: number
  sidebarLabel?: string
  sidebarClassName?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sidebarCustomProps?: Record<string, any>
}

export interface CategoryMetadata {
  label?: string
  position?: number
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customProps?: Record<string, any>
  link?: { type: 'doc'; id: string } | { type: 'generated-index' }
}

export type CategoryMap = Record<string, CategoryMetadata>

interface TreeNode {
  key: string
  label: string
  href?: string
  position: number
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customProps?: Record<string, any>
  children: Record<string, TreeNode>
}

const DEFAULT_POSITION = 0

// Helper to sort nodes
const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
  return [...nodes].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position - b.position
    }
    return a.label.localeCompare(b.label)
  })
}

// Helper to convert TreeNode to Entry
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
    item.customProps = node.customProps
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

export const toSidebarEntries = (
  docs: DocsData[],
  categoryMap: CategoryMap = {}
): Entry => {
  const buildTree = (docList: DocsData[]): Record<string, TreeNode> => {
    const root: Record<string, TreeNode> = {}

    // We use a local mutation for building the tree structure as it's most efficient
    // and encapsulated within this function.
    for (const doc of docList) {
      const cleanId = doc.id.replace(/\.[^/.]+$/, '')
      const parts = cleanId.split('/')
      const filename = parts[parts.length - 1]
      const isIndex = filename === 'index'
      const pathParts = isIndex ? parts.slice(0, -1) : parts

      let currentLevel = root
      let currentPath = ''

      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i]
        currentPath = currentPath ? `${currentPath}/${part}` : part

        if (!currentLevel[part]) {
          const meta = categoryMap[currentPath]
          currentLevel[part] = {
            key: part,
            label: meta?.label ?? part,
            position: meta?.position ?? DEFAULT_POSITION,
            className: meta?.className,
            customProps: meta?.customProps,
            children: {},
          }
        }

        const node = currentLevel[part]

        if (i === pathParts.length - 1) {
          // It's the doc itself
          node.label = doc.sidebarLabel ?? doc.title ?? node.label
          if (doc.link) {
            node.href = doc.path
          }
          if (doc.sidebarPosition !== undefined) {
            node.position = doc.sidebarPosition
          }
          if (doc.sidebarClassName) {
            node.className = doc.sidebarClassName
          }
          if (doc.sidebarCustomProps) {
            node.customProps = doc.sidebarCustomProps
          }
        }
        currentLevel = node.children
      }
    }
    return root
  }

  const rootTree = buildTree(docs)
  const sortedNodes = sortNodes(Object.values(rootTree))

  return sortedNodes.reduce<Entry>((acc, node) => {
    acc[node.key] = nodeToEntry(node)
    return acc
  }, {})
}
