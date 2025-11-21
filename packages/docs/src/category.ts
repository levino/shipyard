import fs from 'node:fs'
import path from 'node:path'
import type { CategoryMap, CategoryMetadata } from './sidebarEntries'

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.gemini',
  'dist',
  'build',
])

export const loadCategoryMetadata = (rootDir: string): CategoryMap => {
  const traverse = (dir: string, relativePath: string): CategoryMap => {
    if (!fs.existsSync(dir)) {
      return {}
    }

    const files = fs.readdirSync(dir)

    return files.reduce<CategoryMap>((acc, file) => {
      const fullPath = path.join(dir, file)
      let stat
      try {
        stat = fs.statSync(fullPath)
      } catch {
        // Ignore files we can't stat
        return acc
      }

      if (!stat.isDirectory() || IGNORED_DIRS.has(file)) {
        return acc
      }

      const newRelative = relativePath ? `${relativePath}/${file}` : file
      const categoryFile = path.join(fullPath, '_category_.json')

      let currentMeta: CategoryMap = {}

      if (fs.existsSync(categoryFile)) {
        try {
          const content = fs.readFileSync(categoryFile, 'utf-8')
          const data = JSON.parse(content) as CategoryMetadata
          currentMeta = { [newRelative]: data }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(`Failed to parse ${categoryFile}`, e)
        }
      }

      const childrenMeta = traverse(fullPath, newRelative)
      return { ...acc, ...currentMeta, ...childrenMeta }
    }, {})
  }

  if (fs.existsSync(rootDir)) {
    return traverse(rootDir, '')
  }

  return {}
}
