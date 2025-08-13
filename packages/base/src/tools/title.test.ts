import { describe, expect, test } from 'vitest'
import { getTitle } from './title'

describe('getTitle', () => {
  const siteTitle = 'Shipyard'

  test('returns site title when page title is undefined', () => {
    expect(getTitle(siteTitle, undefined)).toBe('Shipyard')
  })

  test('returns site title when page title is null', () => {
    expect(getTitle(siteTitle, null)).toBe('Shipyard')
  })

  test('returns site title when page title is empty', () => {
    expect(getTitle(siteTitle, '')).toBe('Shipyard')
  })

  test('returns site title when page title equals site title', () => {
    expect(getTitle(siteTitle, 'Shipyard')).toBe('Shipyard')
  })

  test('returns combined title when page title differs', () => {
    expect(getTitle(siteTitle, 'Blog')).toBe('Shipyard - Blog')
    expect(getTitle(siteTitle, 'First Blog Post')).toBe(
      'Shipyard - First Blog Post',
    )
  })

  test('handles whitespace-only page titles', () => {
    expect(getTitle(siteTitle, '   ')).toBe('Shipyard')
  })

  test('trims page title before comparison', () => {
    expect(getTitle(siteTitle, '  Shipyard  ')).toBe('Shipyard')
    expect(getTitle(siteTitle, '  Blog  ')).toBe('Shipyard - Blog')
  })

  test('is case sensitive', () => {
    expect(getTitle(siteTitle, 'shipyard')).toBe('Shipyard - shipyard')
  })

  test('handles special characters', () => {
    expect(getTitle(siteTitle, 'FAQ & Help')).toBe('Shipyard - FAQ & Help')
  })
})
