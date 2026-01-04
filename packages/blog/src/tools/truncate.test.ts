import { describe, expect, it } from 'vitest'
import {
  getAllTags,
  groupPostsByYear,
  tagToSlug,
  truncateAtMarker,
} from './truncate'

describe('truncateAtMarker', () => {
  it('truncates content at default marker', () => {
    const content = `
This is the excerpt.

<!--truncate-->

This is the rest of the content.
    `
    const result = truncateAtMarker(content)

    expect(result.isTruncated).toBe(true)
    expect(result.excerpt).toContain('This is the excerpt.')
    expect(result.excerpt).not.toContain('This is the rest')
  })

  it('truncates content at custom marker', () => {
    const content = `
Excerpt here.

<!-- more -->

Rest of content.
    `
    const result = truncateAtMarker(content, '<!-- more -->')

    expect(result.isTruncated).toBe(true)
    expect(result.excerpt).toContain('Excerpt here.')
    expect(result.excerpt).not.toContain('Rest of content')
  })

  it('returns full content when no marker found', () => {
    const content = 'Full content without any marker.'
    const result = truncateAtMarker(content)

    expect(result.isTruncated).toBe(false)
    expect(result.excerpt).toBe(content)
  })
})

describe('getAllTags', () => {
  it('collects all tags from posts', () => {
    const posts = [
      { id: '1', data: { tags: ['javascript', 'react'] } },
      { id: '2', data: { tags: ['javascript', 'typescript'] } },
      { id: '3', data: { tags: ['react'] } },
    ]

    const result = getAllTags(posts)

    expect(result.get('javascript')?.count).toBe(2)
    expect(result.get('react')?.count).toBe(2)
    expect(result.get('typescript')?.count).toBe(1)
  })

  it('handles posts without tags', () => {
    const posts = [
      { id: '1', data: { tags: ['javascript'] } },
      { id: '2', data: {} },
      { id: '3', data: { tags: undefined } },
    ]

    const result = getAllTags(posts)

    expect(result.size).toBe(1)
    expect(result.get('javascript')?.count).toBe(1)
  })

  it('returns empty map for no posts', () => {
    const result = getAllTags([])

    expect(result.size).toBe(0)
  })
})

describe('tagToSlug', () => {
  it('converts tag to lowercase slug', () => {
    expect(tagToSlug('JavaScript')).toBe('javascript')
  })

  it('replaces spaces with hyphens', () => {
    expect(tagToSlug('Web Development')).toBe('web-development')
  })

  it('removes special characters', () => {
    expect(tagToSlug('C#')).toBe('c')
    expect(tagToSlug('Node.js')).toBe('node-js')
  })

  it('handles multiple consecutive special characters', () => {
    expect(tagToSlug('Hello   World')).toBe('hello-world')
    expect(tagToSlug('Hello---World')).toBe('hello-world')
  })

  it('removes leading and trailing hyphens', () => {
    expect(tagToSlug('-hello-')).toBe('hello')
  })
})

describe('groupPostsByYear', () => {
  it('groups posts by year', () => {
    const posts = [
      { data: { date: new Date('2024-01-15') } },
      { data: { date: new Date('2024-06-20') } },
      { data: { date: new Date('2023-12-01') } },
    ]

    const result = groupPostsByYear(posts)

    expect(result.get(2024)?.length).toBe(2)
    expect(result.get(2023)?.length).toBe(1)
  })

  it('sorts years in descending order', () => {
    const posts = [
      { data: { date: new Date('2022-01-01') } },
      { data: { date: new Date('2024-01-01') } },
      { data: { date: new Date('2023-01-01') } },
    ]

    const result = groupPostsByYear(posts)
    const years = [...result.keys()]

    expect(years).toEqual([2024, 2023, 2022])
  })

  it('handles empty array', () => {
    const result = groupPostsByYear([])

    expect(result.size).toBe(0)
  })
})
