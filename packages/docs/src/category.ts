import fs from 'node:fs'
import path from 'node:path'
import type { CategoryMap, CategoryMetadata } from './sidebarEntries'

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.gemini',
  'dist',
  'build',
  '.astro',
  '.next',
  'coverage',
])

const safeStat = (p: string) => {
  try {
    return fs.statSync(p)
  } catch {
    return undefined
  }
}

const safeReadJson = <T>(p: string): T | undefined => {
  if (!fs.existsSync(p)) return undefined
  try {
    const content = fs.readFileSync(p, 'utf-8')
    return JSON.parse(content) as T
  } catch (e) {
    // biome-ignore lint/suspicious/noConsole: Log parsing errors
    console.warn(`Failed to parse ${p}`, e)
    return undefined
  }
}

export const loadCategoryMetadata = (rootDir: string): CategoryMap => {
  const traverse = (dir: string, relativePath: string): CategoryMap => {
    if (!fs.existsSync(dir)) {
      return {}
    }

    const files = fs.readdirSync(dir)

    return files.reduce<CategoryMap>((acc, file) => {
      if (IGNORED_DIRS.has(file)) return acc

      const fullPath = path.join(dir, file)
      const stat = safeStat(fullPath)

      if (!stat || !stat.isDirectory()) {
        return acc
      }

      const newRelative = relativePath ? `${relativePath}/${file}` : file
      const categoryFile = path.join(fullPath, '_category_.json')

      const data = safeReadJson<CategoryMetadata>(categoryFile)
      const currentMeta: CategoryMap = data ? { [newRelative]: data } : {}

      const childrenMeta = traverse(fullPath, newRelative)
      return Object.assign(acc, currentMeta, childrenMeta)
    }, {})
  }

  if (fs.existsSync(rootDir)) {
    return traverse(rootDir, '')
  }

  return {}
}
