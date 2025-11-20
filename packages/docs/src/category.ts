import fs from 'node:fs'
import path from 'node:path'
import type { CategoryMap } from './sidebarEntries'

export const loadCategoryMetadata = (rootDir: string): CategoryMap => {
  const map: CategoryMap = {}
  
  const traverse = (dir: string, relativePath: string) => {
    if (!fs.existsSync(dir)) return

    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const fullPath = path.join(dir, file)
      let stat
      try {
        stat = fs.statSync(fullPath)
      } catch {
        continue
      }
      
      if (stat.isDirectory()) {
        const newRelative = relativePath ? `${relativePath}/${file}` : file
        
        // Check for _category_.json
        const categoryFile = path.join(fullPath, '_category_.json')
        if (fs.existsSync(categoryFile)) {
          try {
            const content = fs.readFileSync(categoryFile, 'utf-8')
            const data = JSON.parse(content)
            map[newRelative] = data
          } catch (e) {
            console.warn(`Failed to parse ${categoryFile}`, e)
          }
        }
        
        traverse(fullPath, newRelative)
      }
    }
  }
  
  if (fs.existsSync(rootDir)) {
    traverse(rootDir, '')
  }
  
  return map
}
