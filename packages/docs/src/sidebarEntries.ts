import type { Entry } from '@levino/shipyard-base'
import { getVersionFromDocId, stripVersionFromDocId } from './versionHelpers'

export interface DocsData {
  id: string
  /** Custom document ID from frontmatter (for referencing in pagination) */
  customId?: string
  title: string
  path: string
  link?: boolean
  sidebarPosition?: number
  sidebarLabel?: string
  sidebarClassName?: string
  sidebarCustomProps?: Record<string, unknown>
  collapsible?: boolean
  collapsed?: boolean
  unlisted?: boolean
  paginationLabel?: string
  paginationNext?: string | null
  paginationPrev?: string | null
}

/**
 * Filters docs data to only include entries for a specific version
 * and strips the version prefix from doc IDs for proper sidebar tree building.
 *
 * @param docs - Array of DocsData entries
 * @param version - The version to filter by
 * @returns Filtered docs with version prefix stripped from IDs
 *
 * @example
 * ```ts
 * // Input: [{ id: 'v2/getting-started', path: '/docs/v2/getting-started', ... }]
 * // Output: [{ id: 'getting-started', path: '/docs/v2/getting-started', ... }]
 * const sidebarDocs = filterDocsForVersion(allDocs, 'v2')
 * ```
 */
export const filterDocsForVersion = (
  docs: readonly DocsData[],
  version: string,
): DocsData[] => {
  return docs
    .filter((doc) => {
      const docVersion = getVersionFromDocId(doc.id)
      return docVersion === version
    })
    .map((doc) => ({
      ...doc,
      // Strip version from ID so tree builds correctly
      // e.g., "v2/en/getting-started" -> "en/getting-started"
      id: stripVersionFromDocId(doc.id),
    }))
}

interface TreeNode {
  readonly key: string
  readonly label: string
  readonly href?: string
  readonly position: number
  readonly className?: string
  readonly customProps?: Record<string, unknown>
  readonly collapsible: boolean
  readonly collapsed: boolean
  readonly children: Readonly<Record<string, TreeNode>>
}

const DEFAULT_POSITION = Number.POSITIVE_INFINITY

const createLeafNode = (key: string, doc: DocsData): TreeNode => ({
  key,
  label: doc.sidebarLabel ?? doc.title ?? key,
  href: doc.link !== false ? doc.path : undefined,
  position: doc.sidebarPosition ?? DEFAULT_POSITION,
  className: doc.sidebarClassName,
  customProps: doc.sidebarCustomProps,
  collapsible: doc.collapsible ?? true,
  collapsed: doc.collapsed ?? true,
  children: {},
})

const createBranchNode = (key: string): TreeNode => ({
  key,
  label: key,
  position: DEFAULT_POSITION,
  collapsible: true,
  collapsed: true,
  children: {},
})

const mergeNodeWithDoc = (node: TreeNode, doc: DocsData): TreeNode => ({
  ...node,
  label: doc.sidebarLabel ?? doc.title ?? node.label,
  href: doc.link !== false ? doc.path : node.href,
  position: doc.sidebarPosition ?? node.position,
  className: doc.sidebarClassName ?? node.className,
  customProps: doc.sidebarCustomProps ?? node.customProps,
  collapsible: doc.collapsible ?? node.collapsible,
  collapsed: doc.collapsed ?? node.collapsed,
})

const insertAtPath = (
  root: Readonly<Record<string, TreeNode>>,
  pathParts: readonly string[],
  doc: DocsData,
): Readonly<Record<string, TreeNode>> => {
  if (pathParts.length === 0) return root

  const [head, ...tail] = pathParts
  const existingNode = root[head]

  if (tail.length === 0) {
    const newNode = existingNode
      ? mergeNodeWithDoc(existingNode, doc)
      : createLeafNode(head, doc)
    return { ...root, [head]: newNode }
  }

  const currentNode = existingNode ?? createBranchNode(head)
  const updatedChildren = insertAtPath(currentNode.children, tail, doc)

  return {
    ...root,
    [head]: { ...currentNode, children: updatedChildren },
  }
}

const sortByPositionThenLabel = (
  nodes: readonly TreeNode[],
): readonly TreeNode[] =>
  [...nodes].sort((a, b) =>
    a.position !== b.position
      ? a.position - b.position
      : a.label.localeCompare(b.label),
  )

const treeNodeToEntry = (node: TreeNode): Entry[string] => {
  const childNodes = Object.values(node.children)
  const sortedChildren = sortByPositionThenLabel(childNodes)

  const subEntry =
    sortedChildren.length > 0
      ? Object.fromEntries(
          sortedChildren.map((child) => [child.key, treeNodeToEntry(child)]),
        )
      : undefined

  // Only include collapsible/collapsed for nodes with children (category nodes)
  const hasChildren = sortedChildren.length > 0

  return {
    label: node.label,
    ...(node.href && { href: node.href }),
    ...(node.className && { className: node.className }),
    ...(node.customProps && { customProps: node.customProps }),
    ...(subEntry && { subEntry }),
    ...(hasChildren && { collapsible: node.collapsible }),
    ...(hasChildren && { collapsed: node.collapsed }),
  }
}

const parseDocPath = (id: string): readonly string[] => {
  const cleanId = id.replace(/\.[^/.]+$/, '')
  const parts = cleanId.split('/')
  const filename = parts[parts.length - 1]
  return filename === 'index' ? parts.slice(0, -1) : parts
}

export const toSidebarEntries = (docs: readonly DocsData[]): Entry => {
  // Filter out unlisted pages from the sidebar
  const visibleDocs = docs.filter((doc) => !doc.unlisted)

  const rootTree = visibleDocs.reduce<Readonly<Record<string, TreeNode>>>(
    (acc, doc) => insertAtPath(acc, parseDocPath(doc.id), doc),
    {},
  )

  const sortedNodes = sortByPositionThenLabel(Object.values(rootTree))

  return Object.fromEntries(
    sortedNodes.map((node) => [node.key, treeNodeToEntry(node)]),
  )
}
