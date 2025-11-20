import { describe, expect, it } from 'vitest'
import { toSidebarEntries } from './sidebarEntries'
import type { DocsData, CategoryMap } from './sidebarEntries'

describe('toSidebarEntries', () => {
  it('should create a basic sidebar structure from flat docs', () => {
    const docs: DocsData[] = [
      { id: 'guide/intro.md', title: 'Introduction', path: '/docs/guide/intro' },
      { id: 'guide/advanced/topic.md', title: 'Topic', path: '/docs/guide/advanced/topic' },
      { id: 'api.md', title: 'API', path: '/docs/api' },
    ]

    const entries = toSidebarEntries(docs)

    expect(entries).toMatchObject({
      guide: {
        label: 'guide',
        subEntry: {
          intro: { label: 'Introduction', href: '/docs/guide/intro' },
          advanced: {
            label: 'advanced',
            subEntry: {
              topic: { label: 'Topic', href: '/docs/guide/advanced/topic' }
            }
          }
        }
      },
      api: { label: 'API', href: '/docs/api' }
    })
  })

  it('should respect sidebar_label', () => {
    const docs: DocsData[] = [
      { 
        id: 'guide/intro.md', 
        title: 'Introduction', 
        path: '/docs/guide/intro',
        sidebarLabel: 'Intro'
      },
    ]

    const entries = toSidebarEntries(docs)
    expect(entries.guide.subEntry?.intro.label).toBe('Intro')
  })

  it('should respect sidebar_position', () => {
    const docs: DocsData[] = [
      { 
        id: 'guide/b.md', 
        title: 'B', 
        path: '/docs/guide/b',
        sidebarPosition: 2
      },
      { 
        id: 'guide/a.md', 
        title: 'A', 
        path: '/docs/guide/a',
        sidebarPosition: 1
      },
      { 
        id: 'guide/c.md', 
        title: 'C', 
        path: '/docs/guide/c' 
        // default position 0
      },
    ]

    const entries = toSidebarEntries(docs)
    const guideSub = entries.guide.subEntry
    const keys = Object.keys(guideSub || {})
    
    // Expected order: C (0), A (1), B (2)
    expect(keys).toEqual(['c', 'a', 'b'])
  })

  it('should apply category metadata from map', () => {
    const docs: DocsData[] = [
      { id: 'guide/intro.md', title: 'Introduction', path: '/docs/guide/intro' },
    ]

    const categoryMap: CategoryMap = {
      'guide': {
        label: 'User Guide',
        className: 'guide-section'
      }
    }

    const entries = toSidebarEntries(docs, categoryMap)
    expect(entries.guide.label).toBe('User Guide')
    expect(entries.guide.className).toBe('guide-section')
  })

  it('should apply sidebar_class_name and sidebar_custom_props', () => {
    const docs: DocsData[] = [
      { 
        id: 'page.md', 
        title: 'Page', 
        path: '/docs/page',
        sidebarClassName: 'special-page',
        sidebarCustomProps: { icon: 'star' }
      },
    ]

    const entries = toSidebarEntries(docs)
    expect(entries.page.className).toBe('special-page')
    expect(entries.page.customProps).toEqual({ icon: 'star' })
  })
  
  it('should handle index files correctly', () => {
     const docs: DocsData[] = [
      { id: 'guide/index.md', title: 'Guide Index', path: '/docs/guide' },
      { id: 'guide/other.md', title: 'Other', path: '/docs/guide/other' },
    ]
    
    const entries = toSidebarEntries(docs)
    // 'guide' should be a link now because of index.md
    expect(entries.guide.href).toBe('/docs/guide')
    expect(entries.guide.label).toBe('Guide Index')
    expect(entries.guide.subEntry).toBeDefined()
    expect(entries.guide.subEntry?.other).toBeDefined()
  })

  it('should sort alphabetically when positions match', () => {
     const docs: DocsData[] = [
      { id: 'z.md', title: 'Zebra', path: '/z' },
      { id: 'a.md', title: 'Apple', path: '/a' },
    ]
    const entries = toSidebarEntries(docs)
    const keys = Object.keys(entries)
    expect(keys).toEqual(['a', 'z'])
  })
})
