import { describe, expect, it } from 'vitest'
import { docsSchema } from './index'

describe('docsSchema', () => {
  it('should accept valid sidebar configuration', () => {
    const validData = {
      sidebar: {
        position: 1,
        label: 'Test Label',
        className: 'custom-class',
        customProps: { badge: 'New' },
        collapsible: true,
        collapsed: false,
      },
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sidebar.position).toBe(1)
      expect(result.data.sidebar.label).toBe('Test Label')
      expect(result.data.sidebar.className).toBe('custom-class')
      expect(result.data.sidebar.customProps).toEqual({ badge: 'New' })
      expect(result.data.sidebar.collapsible).toBe(true)
      expect(result.data.sidebar.collapsed).toBe(false)
    }
  })

  it('should reject collapsed: true with collapsible: false', () => {
    const invalidData = {
      sidebar: {
        collapsible: false,
        collapsed: true,
      },
    }

    const result = docsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'sidebar.collapsed cannot be true when sidebar.collapsible is false',
      )
    }
  })

  it('should accept collapsible: false with collapsed: false', () => {
    const validData = {
      sidebar: {
        collapsible: false,
        collapsed: false,
      },
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject tocMinHeadingLevel > tocMaxHeadingLevel', () => {
    const invalidData = {
      tocMinHeadingLevel: 4,
      tocMaxHeadingLevel: 2,
    }

    const result = docsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'tocMinHeadingLevel must be <= tocMaxHeadingLevel',
      )
    }
  })

  it('should accept valid tocMinHeadingLevel <= tocMaxHeadingLevel', () => {
    const validData = {
      tocMinHeadingLevel: 2,
      tocMaxHeadingLevel: 4,
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should apply correct default values for sidebar', () => {
    const emptyData = {}

    const result = docsSchema.safeParse(emptyData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.sidebar.collapsible).toBe(true)
      expect(result.data.sidebar.collapsed).toBe(true)
    }
  })

  it('should apply correct default values for page rendering fields', () => {
    const emptyData = {}

    const result = docsSchema.safeParse(emptyData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.render).toBe(true)
      expect(result.data.draft).toBe(false)
      expect(result.data.unlisted).toBe(false)
    }
  })

  it('should apply correct default values for layout options', () => {
    const emptyData = {}

    const result = docsSchema.safeParse(emptyData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.hideTitle).toBe(false)
      expect(result.data.hideTableOfContents).toBe(false)
      expect(result.data.hideSidebar).toBe(false)
      expect(result.data.tocMinHeadingLevel).toBe(2)
      expect(result.data.tocMaxHeadingLevel).toBe(3)
    }
  })

  it('should accept all page metadata fields', () => {
    const validData = {
      id: 'custom-id',
      title: 'Page Title',
      description: 'Page description',
      keywords: ['keyword1', 'keyword2'],
      image: '/images/og-image.png',
      canonicalUrl: 'https://example.com/page',
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.id).toBe('custom-id')
      expect(result.data.title).toBe('Page Title')
      expect(result.data.description).toBe('Page description')
      expect(result.data.keywords).toEqual(['keyword1', 'keyword2'])
      expect(result.data.image).toBe('/images/og-image.png')
      expect(result.data.canonicalUrl).toBe('https://example.com/page')
    }
  })

  it('should accept page rendering fields', () => {
    const validData = {
      render: false,
      draft: true,
      unlisted: true,
      slug: 'custom-slug',
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.render).toBe(false)
      expect(result.data.draft).toBe(true)
      expect(result.data.unlisted).toBe(true)
      expect(result.data.slug).toBe('custom-slug')
    }
  })

  it('should accept pagination fields', () => {
    const validData = {
      paginationLabel: 'Custom Label',
      paginationNext: 'next-page.md',
      paginationPrev: null,
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.paginationLabel).toBe('Custom Label')
      expect(result.data.paginationNext).toBe('next-page.md')
      expect(result.data.paginationPrev).toBeNull()
    }
  })

  it('should transform pagination_label snake_case to camelCase', () => {
    const validData = {
      pagination_label: 'Custom Nav Label',
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.paginationLabel).toBe('Custom Nav Label')
    }
  })

  it('should accept git metadata override fields', () => {
    const validData = {
      lastUpdateAuthor: 'John Doe',
      lastUpdateTime: '2024-01-15',
      customEditUrl: 'https://github.com/org/repo/edit/main/docs/page.md',
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.lastUpdateAuthor).toBe('John Doe')
      expect(result.data.lastUpdateTime).toBeInstanceOf(Date)
      expect(result.data.customEditUrl).toBe(
        'https://github.com/org/repo/edit/main/docs/page.md',
      )
    }
  })

  it('should accept false for git metadata hide options', () => {
    const validData = {
      lastUpdateAuthor: false,
      lastUpdateTime: false,
      customEditUrl: null,
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.lastUpdateAuthor).toBe(false)
      expect(result.data.lastUpdateTime).toBe(false)
      expect(result.data.customEditUrl).toBeNull()
    }
  })

  it('should accept custom meta tags', () => {
    const validData = {
      customMetaTags: [
        { name: 'author', content: 'John Doe' },
        { property: 'og:type', content: 'article' },
        { content: 'some content' },
      ],
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.customMetaTags).toHaveLength(3)
      expect(result.data.customMetaTags?.[0]).toEqual({
        name: 'author',
        content: 'John Doe',
      })
    }
  })

  it('should reject invalid heading level values', () => {
    const invalidMin = { tocMinHeadingLevel: 0 }
    const invalidMax = { tocMaxHeadingLevel: 7 }

    const resultMin = docsSchema.safeParse(invalidMin)
    const resultMax = docsSchema.safeParse(invalidMax)

    expect(resultMin.success).toBe(false)
    expect(resultMax.success).toBe(false)
  })

  it('should accept valid heading level boundary values', () => {
    const validData = {
      tocMinHeadingLevel: 1,
      tocMaxHeadingLevel: 6,
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tocMinHeadingLevel).toBe(1)
      expect(result.data.tocMaxHeadingLevel).toBe(6)
    }
  })

  it('should transform hide_table_of_contents to hideTableOfContents', () => {
    const validData = {
      hide_table_of_contents: true,
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.hideTableOfContents).toBe(true)
    }
  })

  it('should transform hide_title to hideTitle', () => {
    const validData = {
      hide_title: true,
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.hideTitle).toBe(true)
    }
  })

  it('should transform canonical_url to canonicalUrl', () => {
    const validData = {
      canonical_url: 'https://example.com/canonical',
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.canonicalUrl).toBe('https://example.com/canonical')
    }
  })

  it('should transform custom_meta_tags to customMetaTags', () => {
    const validData = {
      custom_meta_tags: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'author', content: 'Test Author' },
      ],
    }

    const result = docsSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.customMetaTags).toHaveLength(2)
      expect(result.data.customMetaTags?.[0]).toEqual({
        name: 'robots',
        content: 'noindex, nofollow',
      })
    }
  })
})
