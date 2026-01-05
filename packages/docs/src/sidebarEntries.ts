import type { Entry } from '@levino/shipyard-base'
import type { CategoryMetadata } from './categoryMetadata'

export interface DocsData {
  /**
   * Document ID used for referencing.
   * This is either the custom `id` frontmatter value or the file path-based ID.
   */
  id: string
  /**
   * The original file path-based ID from Astro.
   * Always the file path, regardless of custom ID.
   */
  fileId: string
  title: string
  path: string
  slug?: string
  link?: boolean
  sidebarPosition?: number
  sidebarLabel?: string
  sidebarClassName?: string
  sidebarCustomProps?: Record<string, unknown>
  pagination_next?: string | null
  pagination_prev?: string | null
  pagination_label?: string
}

interface TreeNode {
  readonly key: string
  readonly label: string
  readonly href?: string
  readonly position: number
  readonly className?: string
  readonly customProps?: Record<string, unknown>
  readonly collapsible?: boolean
  readonly collapsed?: boolean
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
  children: {},
})

const createBranchNode = (
  key: string,
  categoryMetadata?: CategoryMetadata,
): TreeNode => ({
  key,
  label: categoryMetadata?.label ?? key,
  position: categoryMetadata?.position ?? DEFAULT_POSITION,
  className: categoryMetadata?.className,
  customProps: categoryMetadata?.customProps,
  collapsible: categoryMetadata?.collapsible,
  collapsed: categoryMetadata?.collapsed,
  children: {},
})

const mergeNodeWithDoc = (node: TreeNode, doc: DocsData): TreeNode => ({
  ...node,
  label: doc.sidebarLabel ?? doc.title ?? node.label,
  href: doc.link !== false ? doc.path : node.href,
  position: doc.sidebarPosition ?? node.position,
  className: doc.sidebarClassName ?? node.className,
  customProps: doc.sidebarCustomProps ?? node.customProps,
})

const insertAtPath = (
  root: Readonly<Record<string, TreeNode>>,
  pathParts: readonly string[],
  doc: DocsData,
  categoryMetadataMap: Map<string, CategoryMetadata>,
  parentPath: string = '',
): Readonly<Record<string, TreeNode>> => {
  if (pathParts.length === 0) return root

  const [head, ...tail] = pathParts
  const existingNode = root[head]
  const currentPath = parentPath ? `${parentPath}/${head}` : head

  if (tail.length === 0) {
    const newNode = existingNode
      ? mergeNodeWithDoc(existingNode, doc)
      : createLeafNode(head, doc)
    return { ...root, [head]: newNode }
  }

  // Get category metadata for this directory path
  const categoryMetadata = categoryMetadataMap.get(currentPath)
  const currentNode = existingNode ?? createBranchNode(head, categoryMetadata)
  const updatedChildren = insertAtPath(
    currentNode.children,
    tail,
    doc,
    categoryMetadataMap,
    currentPath,
  )

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

  return {
    label: node.label,
    ...(node.href && { href: node.href }),
    ...(node.className && { className: node.className }),
    ...(node.customProps && { customProps: node.customProps }),
    ...(node.collapsible !== undefined && { collapsible: node.collapsible }),
    ...(node.collapsed !== undefined && { collapsed: node.collapsed }),
    ...(subEntry && { subEntry }),
  }
}

const parseDocPath = (id: string): readonly string[] => {
  const cleanId = id.replace(/\.[^/.]+$/, '')
  const parts = cleanId.split('/')
  const filename = parts[parts.length - 1]
  return filename === 'index' ? parts.slice(0, -1) : parts
}

/**
 * Convert docs data to sidebar entries with optional category metadata.
 *
 * @param docs - Array of document data
 * @param categoryMetadataMap - Optional map of category paths to their metadata from _category_.json/yml files
 * @returns Sidebar entry structure
 */
export const toSidebarEntries = (
  docs: readonly DocsData[],
  categoryMetadataMap: Map<string, CategoryMetadata> = new Map(),
): Entry => {
  const rootTree = docs.reduce<Readonly<Record<string, TreeNode>>>(
    // Use fileId for sidebar tree structure (based on file paths)
    (acc, doc) =>
      insertAtPath(acc, parseDocPath(doc.fileId), doc, categoryMetadataMap),
    {},
  )

  const sortedNodes = sortByPositionThenLabel(Object.values(rootTree))

  return Object.fromEntries(
    sortedNodes.map((node) => [node.key, treeNodeToEntry(node)]),
  )
}
