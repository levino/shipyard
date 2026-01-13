import { describe, expect, it } from 'vitest'
import type { DocsData } from './sidebarEntries'
import { filterDocsForVersion, toSidebarEntries } from './sidebarEntries'

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

  it('should respect sidebar.label', () => {
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

  it('should respect sidebar.position', () => {
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

  it('should apply sidebar.className', () => {
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

  it('should apply index.md sidebar.position to parent category for top-level sorting', () => {
    const docs: DocsData[] = [
      // "zebra" folder with index.md that has sidebar.position: 1
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

  it('should position category first when index.md has explicit sidebar.position', () => {
    const docs: DocsData[] = [
      // A category with index.md having sidebar.position: 0
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

  it('should include collapsible/collapsed in category entries', () => {
    const docs: DocsData[] = [
      {
        id: 'guide/index.md',
        title: 'Guide',
        path: '/docs/guide',
        collapsible: true,
        collapsed: false,
      },
      {
        id: 'guide/intro.md',
        title: 'Introduction',
        path: '/docs/guide/intro',
      },
    ]

    const entries = toSidebarEntries(docs)

    expect(entries.guide.collapsible).toBe(true)
    expect(entries.guide.collapsed).toBe(false)
  })

  it('should apply default collapsible/collapsed values when not specified', () => {
    const docs: DocsData[] = [
      {
        id: 'guide/index.md',
        title: 'Guide',
        path: '/docs/guide',
      },
      {
        id: 'guide/intro.md',
        title: 'Introduction',
        path: '/docs/guide/intro',
      },
    ]

    const entries = toSidebarEntries(docs)

    // Default values: collapsible: true, collapsed: true
    expect(entries.guide.collapsible).toBe(true)
    expect(entries.guide.collapsed).toBe(true)
  })

  it('should filter unlisted pages from sidebar', () => {
    const docs: DocsData[] = [
      {
        id: 'guide/intro.md',
        title: 'Introduction',
        path: '/docs/guide/intro',
      },
      {
        id: 'guide/hidden.md',
        title: 'Hidden Page',
        path: '/docs/guide/hidden',
        unlisted: true,
      },
      {
        id: 'guide/visible.md',
        title: 'Visible Page',
        path: '/docs/guide/visible',
      },
    ]

    const entries = toSidebarEntries(docs)
    const guideSubKeys = Object.keys(entries.guide.subEntry || {})

    // hidden should not be in the sidebar
    expect(guideSubKeys).toContain('intro')
    expect(guideSubKeys).toContain('visible')
    expect(guideSubKeys).not.toContain('hidden')
  })

  it('should create non-clickable entries for render: false (no href)', () => {
    const docs: DocsData[] = [
      {
        id: 'guide/index.md',
        title: 'Guide',
        path: '/docs/guide',
        link: false, // render: false translates to link: false
      },
      {
        id: 'guide/intro.md',
        title: 'Introduction',
        path: '/docs/guide/intro',
      },
    ]

    const entries = toSidebarEntries(docs)

    // Category should exist but not have an href
    expect(entries.guide.label).toBe('Guide')
    expect(entries.guide.href).toBeUndefined()
    expect(entries.guide.subEntry?.intro.href).toBe('/docs/guide/intro')
  })

  it('should apply index.md metadata including collapsible state to parent category', () => {
    const docs: DocsData[] = [
      {
        id: 'advanced/index.md',
        title: 'Advanced Topics',
        path: '/docs/advanced',
        sidebarLabel: 'Advanced',
        sidebarPosition: 5,
        sidebarClassName: 'advanced-section',
        collapsible: false,
        collapsed: false,
      },
      {
        id: 'advanced/topic1.md',
        title: 'Topic 1',
        path: '/docs/advanced/topic1',
      },
    ]

    const entries = toSidebarEntries(docs)

    expect(entries.advanced.label).toBe('Advanced')
    expect(entries.advanced.className).toBe('advanced-section')
    expect(entries.advanced.collapsible).toBe(false)
    expect(entries.advanced.collapsed).toBe(false)
  })

  it('should not include collapsible/collapsed for leaf nodes', () => {
    const docs: DocsData[] = [
      {
        id: 'page.md',
        title: 'Page',
        path: '/docs/page',
      },
    ]

    const entries = toSidebarEntries(docs)

    // Leaf nodes should not have collapsible/collapsed properties
    expect(entries.page.collapsible).toBeUndefined()
    expect(entries.page.collapsed).toBeUndefined()
  })
})

describe('filterDocsForVersion', () => {
  it('should filter docs to only include entries for the specified version', () => {
    const docs: DocsData[] = [
      { id: 'v1/intro.md', title: 'Intro v1', path: '/docs/v1/intro' },
      { id: 'v1/guide.md', title: 'Guide v1', path: '/docs/v1/guide' },
      { id: 'v2/intro.md', title: 'Intro v2', path: '/docs/v2/intro' },
      { id: 'v2/guide.md', title: 'Guide v2', path: '/docs/v2/guide' },
      {
        id: 'v2/new-feature.md',
        title: 'New Feature',
        path: '/docs/v2/new-feature',
      },
    ]

    const v1Docs = filterDocsForVersion(docs, 'v1')
    expect(v1Docs).toHaveLength(2)
    expect(v1Docs.map((d) => d.title)).toEqual(['Intro v1', 'Guide v1'])

    const v2Docs = filterDocsForVersion(docs, 'v2')
    expect(v2Docs).toHaveLength(3)
    expect(v2Docs.map((d) => d.title)).toEqual([
      'Intro v2',
      'Guide v2',
      'New Feature',
    ])
  })

  it('should strip version prefix from doc IDs', () => {
    const docs: DocsData[] = [
      {
        id: 'v2/getting-started.md',
        title: 'Getting Started',
        path: '/docs/v2/getting-started',
      },
      {
        id: 'v2/en/intro.md',
        title: 'Introduction',
        path: '/docs/v2/en/intro',
      },
    ]

    const filtered = filterDocsForVersion(docs, 'v2')

    expect(filtered[0].id).toBe('getting-started.md')
    expect(filtered[1].id).toBe('en/intro.md')
  })

  it('should preserve other doc properties unchanged', () => {
    const docs: DocsData[] = [
      {
        id: 'v1/page.md',
        title: 'Page Title',
        path: '/docs/v1/page',
        sidebarPosition: 5,
        sidebarLabel: 'Custom Label',
        sidebarClassName: 'special-class',
        pagination_next: 'next-page',
        pagination_prev: 'prev-page',
        link: true,
      },
    ]

    const filtered = filterDocsForVersion(docs, 'v1')
    expect(filtered[0]).toEqual({
      id: 'page.md',
      title: 'Page Title',
      path: '/docs/v1/page',
      sidebarPosition: 5,
      sidebarLabel: 'Custom Label',
      sidebarClassName: 'special-class',
      pagination_next: 'next-page',
      pagination_prev: 'prev-page',
      link: true,
    })
  })

  it('should return empty array when no docs match the version', () => {
    const docs: DocsData[] = [
      { id: 'v1/intro.md', title: 'Intro', path: '/docs/v1/intro' },
    ]

    const filtered = filterDocsForVersion(docs, 'v3')
    expect(filtered).toEqual([])
  })

  it('should handle versioned docs with i18n locale prefixes', () => {
    const docs: DocsData[] = [
      {
        id: 'v2/en/getting-started.md',
        title: 'Getting Started (EN)',
        path: '/en/docs/v2/getting-started',
      },
      {
        id: 'v2/de/getting-started.md',
        title: 'Erste Schritte (DE)',
        path: '/de/docs/v2/getting-started',
      },
      {
        id: 'v1/en/getting-started.md',
        title: 'Getting Started v1',
        path: '/en/docs/v1/getting-started',
      },
    ]

    const filtered = filterDocsForVersion(docs, 'v2')
    expect(filtered).toHaveLength(2)
    // IDs should have version stripped but locale preserved
    expect(filtered.map((d) => d.id)).toEqual([
      'en/getting-started.md',
      'de/getting-started.md',
    ])
  })

  it('should work correctly with semantic version strings', () => {
    const docs: DocsData[] = [
      { id: 'v1.0/intro.md', title: 'Intro v1.0', path: '/docs/v1.0/intro' },
      {
        id: 'v2.0.0/intro.md',
        title: 'Intro v2.0.0',
        path: '/docs/v2.0.0/intro',
      },
    ]

    const v1Docs = filterDocsForVersion(docs, 'v1.0')
    expect(v1Docs).toHaveLength(1)
    expect(v1Docs[0].title).toBe('Intro v1.0')

    const v2Docs = filterDocsForVersion(docs, 'v2.0.0')
    expect(v2Docs).toHaveLength(1)
    expect(v2Docs[0].title).toBe('Intro v2.0.0')
  })

  it('should work with special version names like latest and next', () => {
    const docs: DocsData[] = [
      {
        id: 'latest/intro.md',
        title: 'Latest Intro',
        path: '/docs/latest/intro',
      },
      { id: 'next/intro.md', title: 'Next Intro', path: '/docs/next/intro' },
      { id: 'v1/intro.md', title: 'V1 Intro', path: '/docs/v1/intro' },
    ]

    const latestDocs = filterDocsForVersion(docs, 'latest')
    expect(latestDocs).toHaveLength(1)
    expect(latestDocs[0].title).toBe('Latest Intro')

    const nextDocs = filterDocsForVersion(docs, 'next')
    expect(nextDocs).toHaveLength(1)
    expect(nextDocs[0].title).toBe('Next Intro')
  })
})
