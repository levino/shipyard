import { describe, expect, test } from 'vitest'
import { getTitle } from './title'

describe('getTitle', () => {
  const siteTitle = 'shipyard'

  test('returns site title when page title is undefined', () => {
    expect(getTitle(siteTitle, undefined)).toBe('shipyard')
  })

  test('returns site title when page title is null', () => {
    expect(getTitle(siteTitle, null)).toBe('shipyard')
  })

  test('returns site title when page title is empty', () => {
    expect(getTitle(siteTitle, '')).toBe('shipyard')
  })

  test('returns site title when page title equals site title', () => {
    expect(getTitle(siteTitle, 'shipyard')).toBe('shipyard')
  })

  test('returns combined title when page title differs', () => {
    expect(getTitle(siteTitle, 'Blog')).toBe('shipyard - Blog')
    expect(getTitle(siteTitle, 'First Blog Post')).toBe(
      'shipyard - First Blog Post',
    )
  })

  test('handles whitespace-only page titles', () => {
    expect(getTitle(siteTitle, '   ')).toBe('shipyard')
  })

  test('trims page title before comparison', () => {
    expect(getTitle(siteTitle, '  shipyard  ')).toBe('shipyard')
    expect(getTitle(siteTitle, '  Blog  ')).toBe('shipyard - Blog')
  })

  test('is case sensitive', () => {
    expect(getTitle(siteTitle, 'SHIPYARD')).toBe('shipyard - SHIPYARD')
  })

  test('handles special characters', () => {
    expect(getTitle(siteTitle, 'FAQ & Help')).toBe('shipyard - FAQ & Help')
  })
})
