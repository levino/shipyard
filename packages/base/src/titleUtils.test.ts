import { describe, expect, test } from 'vitest'
import { constructPageTitle } from './titleUtils'

describe('Page title construction', () => {
  const siteTitle = 'Shipyard'
  
  test('returns just site title when page title is undefined', () => {
    expect(constructPageTitle(siteTitle, undefined)).toBe('Shipyard')
  })
  
  test('returns just site title when page title is null', () => {
    expect(constructPageTitle(siteTitle, null)).toBe('Shipyard')
  })
  
  test('returns just site title when page title is empty string', () => {
    expect(constructPageTitle(siteTitle, '')).toBe('Shipyard')
  })
  
  test('returns just site title when page title equals site title', () => {
    expect(constructPageTitle(siteTitle, 'Shipyard')).toBe('Shipyard')
  })
  
  test('returns combined title when page title is different from site title', () => {
    expect(constructPageTitle(siteTitle, 'Blog')).toBe('Shipyard - Blog')
    expect(constructPageTitle(siteTitle, 'First Blog Post')).toBe('Shipyard - First Blog Post')
    expect(constructPageTitle(siteTitle, 'Documentation')).toBe('Shipyard - Documentation')
  })
  
  test('handles whitespace-only page titles', () => {
    expect(constructPageTitle(siteTitle, '   ')).toBe('Shipyard')
  })
  
  test('trims page title before comparison', () => {
    expect(constructPageTitle(siteTitle, '  Shipyard  ')).toBe('Shipyard')
    expect(constructPageTitle(siteTitle, '  Blog  ')).toBe('Shipyard - Blog')
  })
  
  test('is case sensitive when comparing titles', () => {
    expect(constructPageTitle(siteTitle, 'shipyard')).toBe('Shipyard - shipyard')
    expect(constructPageTitle('MyApp', 'MyApp')).toBe('MyApp')
    expect(constructPageTitle('MyApp', 'myapp')).toBe('MyApp - myapp')
  })
  
  test('handles special characters in titles', () => {
    expect(constructPageTitle(siteTitle, 'FAQ & Help')).toBe('Shipyard - FAQ & Help')
    expect(constructPageTitle(siteTitle, 'API Reference (v2)')).toBe('Shipyard - API Reference (v2)')
  })
})