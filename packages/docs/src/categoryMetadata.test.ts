import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  buildCategoryMetadataMap,
  clearCategoryMetadataCache,
  readCategoryMetadata,
} from './categoryMetadata'

describe('categoryMetadata', () => {
  const testDir = join(tmpdir(), 'shipyard-category-test')

  beforeEach(() => {
    clearCategoryMetadataCache()
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true })
    }
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    clearCategoryMetadataCache()
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true })
    }
  })

  describe('readCategoryMetadata', () => {
    it('reads _category_.json file', () => {
      const categoryPath = join(testDir, 'getting-started')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.json'),
        JSON.stringify({
          label: 'Getting Started',
          position: 1,
          collapsible: true,
          collapsed: false,
        }),
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata).toEqual({
        label: 'Getting Started',
        position: 1,
        collapsible: true,
        collapsed: false,
      })
    })

    it('reads _category_.yml file', () => {
      const categoryPath = join(testDir, 'guides')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.yml'),
        `label: Guides
position: 2
collapsed: true`,
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata).toEqual({
        label: 'Guides',
        position: 2,
        collapsed: true,
      })
    })

    it('reads _category_.yaml file', () => {
      const categoryPath = join(testDir, 'api')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.yaml'),
        `label: "API Reference"
position: 3`,
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata).toEqual({
        label: 'API Reference',
        position: 3,
      })
    })

    it('prefers _category_.json over _category_.yml', () => {
      const categoryPath = join(testDir, 'mixed')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.json'),
        JSON.stringify({ label: 'From JSON', position: 1 }),
      )
      writeFileSync(
        join(categoryPath, '_category_.yml'),
        `label: From YAML
position: 2`,
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata?.label).toBe('From JSON')
      expect(metadata?.position).toBe(1)
    })

    it('returns null when no category file exists', () => {
      const categoryPath = join(testDir, 'no-metadata')
      mkdirSync(categoryPath, { recursive: true })

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata).toBeNull()
    })

    it('caches metadata to avoid repeated reads', () => {
      const categoryPath = join(testDir, 'cached')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.json'),
        JSON.stringify({ label: 'Cached', position: 1 }),
      )

      // First read
      const metadata1 = readCategoryMetadata(categoryPath)
      expect(metadata1?.label).toBe('Cached')

      // Delete the file
      rmSync(join(categoryPath, '_category_.json'))

      // Second read should still return cached value
      const metadata2 = readCategoryMetadata(categoryPath)
      expect(metadata2?.label).toBe('Cached')
    })
  })

  describe('buildCategoryMetadataMap', () => {
    it('builds map from document paths', () => {
      // Create category directories with metadata
      const gettingStartedPath = join(testDir, 'getting-started')
      const nestedPath = join(testDir, 'getting-started', 'advanced')

      mkdirSync(gettingStartedPath, { recursive: true })
      mkdirSync(nestedPath, { recursive: true })

      writeFileSync(
        join(gettingStartedPath, '_category_.json'),
        JSON.stringify({ label: 'Getting Started', position: 1 }),
      )
      writeFileSync(
        join(nestedPath, '_category_.json'),
        JSON.stringify({ label: 'Advanced Topics', position: 2 }),
      )

      const docPaths = [
        'getting-started/intro.md',
        'getting-started/installation.md',
        'getting-started/advanced/deep-dive.md',
      ]

      const metadataMap = buildCategoryMetadataMap(testDir, docPaths)

      expect(metadataMap.get('getting-started')).toEqual({
        label: 'Getting Started',
        position: 1,
      })
      expect(metadataMap.get('getting-started/advanced')).toEqual({
        label: 'Advanced Topics',
        position: 2,
      })
    })

    it('handles missing category files gracefully', () => {
      const guidesPath = join(testDir, 'guides')
      mkdirSync(guidesPath, { recursive: true })
      // No _category_ file created

      const docPaths = ['guides/first-guide.md', 'guides/second-guide.md']

      const metadataMap = buildCategoryMetadataMap(testDir, docPaths)

      expect(metadataMap.has('guides')).toBe(false)
    })
  })

  describe('YAML parsing', () => {
    it('parses boolean values', () => {
      const categoryPath = join(testDir, 'booleans')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.yml'),
        `collapsible: true
collapsed: false`,
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata?.collapsible).toBe(true)
      expect(metadata?.collapsed).toBe(false)
    })

    it('parses numeric values', () => {
      const categoryPath = join(testDir, 'numbers')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(join(categoryPath, '_category_.yml'), `position: 42`)

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata?.position).toBe(42)
    })

    it('handles quoted strings', () => {
      const categoryPath = join(testDir, 'quoted')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.yml'),
        `label: "Hello World"
className: 'my-class'`,
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata?.label).toBe('Hello World')
      expect(metadata?.className).toBe('my-class')
    })

    it('ignores comments', () => {
      const categoryPath = join(testDir, 'comments')
      mkdirSync(categoryPath, { recursive: true })
      writeFileSync(
        join(categoryPath, '_category_.yml'),
        `# This is a comment
label: Category
# Another comment
position: 1`,
      )

      const metadata = readCategoryMetadata(categoryPath)

      expect(metadata?.label).toBe('Category')
      expect(metadata?.position).toBe(1)
    })
  })
})
