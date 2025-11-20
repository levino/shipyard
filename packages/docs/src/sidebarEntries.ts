import type { Entry } from '@levino/shipyard-base'

export interface DocsData {
  id: string
  title: string
  path: string
  link?: boolean
  sidebarPosition?: number
  sidebarLabel?: string
  sidebarClassName?: string
  sidebarCustomProps?: Record<string, any>
}

export interface CategoryMetadata {
  label?: string
  position?: number
  className?: string
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
  customProps?: Record<string, any>
  children: Record<string, TreeNode>
}

const DEFAULT_POSITION = 0

export const toSidebarEntries = (
  docs: DocsData[],
  categoryMap: CategoryMap = {}
): Entry => {
  const root: Record<string, TreeNode> = {}

  // Helper to get or create node
  const getNode = (
    current: Record<string, TreeNode>,
    key: string,
    fullPath: string
  ): TreeNode => {
    if (!current[key]) {
      // Check category metadata
      const categoryMeta = categoryMap[fullPath]
      current[key] = {
        key,
        label: categoryMeta?.label ?? key, // Default label to key, will update if it's a doc later or if category has label
        position: categoryMeta?.position ?? DEFAULT_POSITION,
        className: categoryMeta?.className,
        customProps: categoryMeta?.customProps,
        children: {},
      }
    }
    return current[key]
  }

  for (const doc of docs) {
    // id is like 'guide/getting-started.md' or 'guide/index.md'
    // We want to split by '/'
    // Remove extension? id usually has extension in Astro content collections.
    const cleanId = doc.id.replace(/\.[^/.]+$/, '')
    const parts = cleanId.split('/')
    const filename = parts[parts.length - 1]

    // Handle 'index' files: they represent the directory itself.
    // If filename is 'index', the doc belongs to the parent folder.
    const isIndex = filename === 'index'
    const pathParts = isIndex ? parts.slice(0, -1) : parts

    let currentLevel = root
    let currentPath = ''

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]
      // Construct path relative to docs root, e.g. 'guide' or 'guide/advanced'
      currentPath = currentPath ? `${currentPath}/${part}` : part
      
      const node = getNode(currentLevel, part, currentPath)

      // If this is the last part (and it's the doc), update its metadata
      if (i === pathParts.length - 1) {
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

  // Function to convert tree to Entry and sort
  const processLevel = (level: Record<string, TreeNode>): Entry => {
    const nodes = Object.values(level)
    
    // Sort
    nodes.sort((a, b) => {
      if (a.position !== b.position) {
        return a.position - b.position
      }
      return a.label.localeCompare(b.label)
    })

    const entry: Entry = {}
    for (const node of nodes) {
      const childEntry: any = {
        label: node.label,
      }
      if (node.href) {
        childEntry.href = node.href
      }
      if (node.className) {
        childEntry.className = node.className
      }
      if (node.customProps) {
        childEntry.customProps = node.customProps
      }
      
      if (Object.keys(node.children).length > 0) {
        childEntry.subEntry = processLevel(node.children)
      }
      
      entry[node.key] = childEntry
    }
    return entry
  }

  return processLevel(root)
}
