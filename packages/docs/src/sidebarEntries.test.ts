import { describe, expect, it } from 'vitest'
import type { DocsData } from './sidebarEntries'
import { toSidebarEntries } from './sidebarEntries'

describe('toSidebarEntries', () => {
  it('should create a basic sidebar structure from flat docs', () => {
    const docs: DocsData[] = [
      {
        id: 'guide/intro.md',
        title: 'Introduction',
        path: '/docs/guide/intro',
      },
      {
        id: 'guide/advanced/topic.md',
        title: 'Topic',
        path: '/docs/guide/advanced/topic',
      },
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
              topic: { label: 'Topic', href: '/docs/guide/advanced/topic' },
            },
          },
        },
      },
      api: { label: 'API', href: '/docs/api' },
    })
  })

  it('should respect sidebar_label', () => {
    const docs: DocsData[] = [
      {
        id: 'guide/intro.md',
        title: 'Introduction',
        path: '/docs/guide/intro',
        sidebarLabel: 'Intro',
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
        sidebarPosition: 2,
      },
      {
        id: 'guide/a.md',
        title: 'A',
        path: '/docs/guide/a',
        sidebarPosition: 1,
      },
      {
        id: 'guide/c.md',
        title: 'C',
        path: '/docs/guide/c',
      },
    ]

    const entries = toSidebarEntries(docs)
    const guideSub = entries.guide.subEntry
    const keys = Object.keys(guideSub || {})

    // Items with explicit positions come first (1, 2), then items without position (Infinity) are sorted alphabetically
    expect(keys).toEqual(['a', 'b', 'c'])
  })

  it('should apply sidebar_class_name', () => {
    const docs: DocsData[] = [
      {
        id: 'page.md',
        title: 'Page',
        path: '/docs/page',
        sidebarClassName: 'special-page',
      },
    ]

    const entries = toSidebarEntries(docs)
    expect(entries.page.className).toBe('special-page')
  })

  it('should handle index files correctly', () => {
    const docs: DocsData[] = [
      { id: 'guide/index.md', title: 'Guide Index', path: '/docs/guide' },
      { id: 'guide/other.md', title: 'Other', path: '/docs/guide/other' },
    ]

    const entries = toSidebarEntries(docs)
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

  it('should apply index.md sidebar_position to parent category for top-level sorting', () => {
    const docs: DocsData[] = [
      // "zebra" folder with index.md that has sidebar_position: 1
      {
        id: 'zebra/index.md',
        title: 'Zebra Section',
        path: '/docs/zebra',
        sidebarPosition: 1,
      },
      { id: 'zebra/page.md', title: 'Zebra Page', path: '/docs/zebra/page' },
      // "apple" folder with no explicit position (defaults to Infinity)
      {
        id: 'apple/index.md',
        title: 'Apple Section',
        path: '/docs/apple',
      },
      { id: 'apple/page.md', title: 'Apple Page', path: '/docs/apple/page' },
    ]

    const entries = toSidebarEntries(docs)
    const keys = Object.keys(entries)

    // zebra has explicit position 1, apple defaults to Infinity
    // So zebra (position 1) comes before apple (Infinity)
    expect(keys).toEqual(['zebra', 'apple'])
  })

  it('should position category first when index.md has explicit sidebar_position', () => {
    const docs: DocsData[] = [
      // A category with index.md having sidebar_position: 0
      {
        id: 'sidebar-demo/index.md',
        title: 'Sidebar Demo',
        path: '/docs/sidebar-demo',
        sidebarPosition: 0,
      },
      {
        id: 'sidebar-demo/custom-class.md',
        title: 'Custom Class',
        path: '/docs/sidebar-demo/custom-class',
      },
      // Other top-level items with no position (default Infinity)
      { id: 'garden-beds.md', title: 'Garden Beds', path: '/docs/garden-beds' },
      { id: 'harvesting.md', title: 'Harvesting', path: '/docs/harvesting' },
    ]

    const entries = toSidebarEntries(docs)
    const keys = Object.keys(entries)

    // sidebar-demo has explicit position 0, others default to Infinity
    // So sidebar-demo comes first, then others alphabetically
    expect(keys).toEqual(['sidebar-demo', 'garden-beds', 'harvesting'])
  })
})
