import type { Entry } from '@levino/shipyard-base'
import { describe, expect, it } from 'vitest'
import { getPaginationInfo } from './pagination'
import type { DocsData } from './sidebarEntries'

describe('getPaginationInfo', () => {
  const createSidebar = (): Entry => ({
    intro: {
      label: 'Introduction',
      href: '/docs/intro',
    },
    guide: {
      label: 'Guide',
      subEntry: {
        'getting-started': {
          label: 'Getting Started',
          href: '/docs/guide/getting-started',
        },
        advanced: {
          label: 'Advanced',
          href: '/docs/guide/advanced',
        },
      },
    },
    api: {
      label: 'API Reference',
      href: '/docs/api',
    },
  })

  const createDocs = (): DocsData[] => [
    {
      id: 'intro.md',
      title: 'Introduction',
      path: '/docs/intro',
    },
    {
      id: 'guide/getting-started.md',
      title: 'Getting Started',
      path: '/docs/guide/getting-started',
    },
    {
      id: 'guide/advanced.md',
      title: 'Advanced',
      path: '/docs/guide/advanced',
    },
    {
      id: 'api.md',
      title: 'API Reference',
      path: '/docs/api',
    },
  ]

  it('should return prev and next for a middle page', () => {
    const sidebar = createSidebar()
    const docs = createDocs()
    const pagination = getPaginationInfo(
      '/docs/guide/getting-started',
      sidebar,
      docs,
    )

    expect(pagination.prev).toEqual({
      title: 'Introduction',
      href: '/docs/intro',
    })
    expect(pagination.next).toEqual({
      title: 'Advanced',
      href: '/docs/guide/advanced',
    })
  })

  it('should return only next for first page', () => {
    const sidebar = createSidebar()
    const docs = createDocs()
    const pagination = getPaginationInfo('/docs/intro', sidebar, docs)

    expect(pagination.prev).toBeUndefined()
    expect(pagination.next).toEqual({
      title: 'Getting Started',
      href: '/docs/guide/getting-started',
    })
  })

  it('should return only prev for last page', () => {
    const sidebar = createSidebar()
    const docs = createDocs()
    const pagination = getPaginationInfo('/docs/api', sidebar, docs)

    expect(pagination.prev).toEqual({
      title: 'Advanced',
      href: '/docs/guide/advanced',
    })
    expect(pagination.next).toBeUndefined()
  })

  it('should return empty object for page not in sidebar', () => {
    const sidebar = createSidebar()
    const docs = createDocs()
    const pagination = getPaginationInfo('/docs/unknown', sidebar, docs)

    expect(pagination).toEqual({})
  })

  it('should respect paginationNext override', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
        paginationNext: 'api.md', // Skip directly to api
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
      },
      {
        id: 'guide/advanced.md',
        title: 'Advanced',
        path: '/docs/guide/advanced',
      },
      {
        id: 'api.md',
        title: 'API Reference',
        path: '/docs/api',
      },
    ]

    const pagination = getPaginationInfo('/docs/intro', sidebar, docs)

    expect(pagination.prev).toBeUndefined()
    expect(pagination.next).toEqual({
      title: 'API Reference',
      href: '/docs/api',
    })
  })

  it('should respect paginationPrev override', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
      },
      {
        id: 'guide/advanced.md',
        title: 'Advanced',
        path: '/docs/guide/advanced',
      },
      {
        id: 'api.md',
        title: 'API Reference',
        path: '/docs/api',
        paginationPrev: 'intro.md', // Skip back to intro
      },
    ]

    const pagination = getPaginationInfo('/docs/api', sidebar, docs)

    expect(pagination.prev).toEqual({
      title: 'Introduction',
      href: '/docs/intro',
    })
    expect(pagination.next).toBeUndefined()
  })

  it('should disable next pagination when paginationNext is null', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
        paginationNext: null, // Explicitly disable
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
      },
    ]

    const pagination = getPaginationInfo('/docs/intro', sidebar, docs)

    expect(pagination.prev).toBeUndefined()
    expect(pagination.next).toBeUndefined()
  })

  it('should disable prev pagination when paginationPrev is null', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
        paginationPrev: null, // Explicitly disable
      },
    ]

    const pagination = getPaginationInfo(
      '/docs/guide/getting-started',
      sidebar,
      docs,
    )

    expect(pagination.prev).toBeUndefined()
    expect(pagination.next).toEqual({
      title: 'Advanced',
      href: '/docs/guide/advanced',
    })
  })

  it('should disable all pagination when both are null', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
        paginationNext: null,
        paginationPrev: null,
      },
    ]

    const pagination = getPaginationInfo(
      '/docs/guide/getting-started',
      sidebar,
      docs,
    )

    expect(pagination).toEqual({})
  })

  it('should use sidebarLabel when available', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
        sidebarLabel: 'Intro', // Custom label
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
      },
    ]

    const pagination = getPaginationInfo(
      '/docs/guide/getting-started',
      sidebar,
      docs,
    )

    expect(pagination.prev).toEqual({
      title: 'Introduction',
      href: '/docs/intro',
    })
  })

  it('should use paginationLabel when available', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
        sidebarLabel: 'Intro',
        paginationLabel: 'Start Here', // Custom pagination label takes priority
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
        paginationPrev: 'intro.md',
      },
    ]

    const pagination = getPaginationInfo(
      '/docs/guide/getting-started',
      sidebar,
      docs,
    )

    expect(pagination.prev).toEqual({
      title: 'Start Here',
      href: '/docs/intro',
    })
  })

  it('should handle nested sidebar structure correctly', () => {
    const sidebar: Entry = {
      guide: {
        label: 'Guide',
        subEntry: {
          basics: {
            label: 'Basics',
            subEntry: {
              'page-1': {
                label: 'Page 1',
                href: '/docs/guide/basics/page-1',
              },
              'page-2': {
                label: 'Page 2',
                href: '/docs/guide/basics/page-2',
              },
            },
          },
          advanced: {
            label: 'Advanced',
            subEntry: {
              'page-3': {
                label: 'Page 3',
                href: '/docs/guide/advanced/page-3',
              },
            },
          },
        },
      },
    }

    const docs: DocsData[] = [
      {
        id: 'guide/basics/page-1.md',
        title: 'Page 1',
        path: '/docs/guide/basics/page-1',
      },
      {
        id: 'guide/basics/page-2.md',
        title: 'Page 2',
        path: '/docs/guide/basics/page-2',
      },
      {
        id: 'guide/advanced/page-3.md',
        title: 'Page 3',
        path: '/docs/guide/advanced/page-3',
      },
    ]

    const pagination = getPaginationInfo(
      '/docs/guide/basics/page-2',
      sidebar,
      docs,
    )

    expect(pagination.prev).toEqual({
      title: 'Page 1',
      href: '/docs/guide/basics/page-1',
    })
    expect(pagination.next).toEqual({
      title: 'Page 3',
      href: '/docs/guide/advanced/page-3',
    })
  })

  it('should handle invalid paginationNext reference gracefully', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
        paginationNext: 'nonexistent.md', // Invalid reference
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
      },
    ]

    const pagination = getPaginationInfo('/docs/intro', sidebar, docs)

    // Should not have a next link because the reference is invalid
    expect(pagination.next).toBeUndefined()
  })

  it('should handle invalid paginationPrev reference gracefully', () => {
    const sidebar = createSidebar()
    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
      },
      {
        id: 'guide/getting-started.md',
        title: 'Getting Started',
        path: '/docs/guide/getting-started',
        paginationPrev: 'nonexistent.md', // Invalid reference
      },
    ]

    const pagination = getPaginationInfo(
      '/docs/guide/getting-started',
      sidebar,
      docs,
    )

    // Should not have a prev link because the reference is invalid
    expect(pagination.prev).toBeUndefined()
  })

  it('should exclude unlisted pages from pagination (via sidebar)', () => {
    // Note: unlisted pages are filtered from sidebar entries before being passed
    // to getPaginationInfo, so they won't appear in pagination
    const sidebar: Entry = {
      intro: {
        label: 'Introduction',
        href: '/docs/intro',
      },
      // Hidden page is NOT in sidebar
      visible: {
        label: 'Visible',
        href: '/docs/visible',
      },
    }

    const docs: DocsData[] = [
      {
        id: 'intro.md',
        title: 'Introduction',
        path: '/docs/intro',
      },
      {
        id: 'hidden.md',
        title: 'Hidden Page',
        path: '/docs/hidden',
        unlisted: true,
      },
      {
        id: 'visible.md',
        title: 'Visible',
        path: '/docs/visible',
      },
    ]

    const pagination = getPaginationInfo('/docs/intro', sidebar, docs)

    // Next should be 'visible', not 'hidden'
    expect(pagination.next).toEqual({
      title: 'Visible',
      href: '/docs/visible',
    })
  })
})
