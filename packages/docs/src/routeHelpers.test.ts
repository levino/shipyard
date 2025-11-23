import { describe, expect, it } from 'vitest'
import { getDocPath, getRouteParams } from './routeHelpers'

describe('getRouteParams', () => {
  describe('without i18n', () => {
    it('should return slug from simple path', () => {
      const params = getRouteParams('getting-started', false)
      expect(params).toEqual({ slug: 'getting-started' })
    })

    it('should return slug from nested path', () => {
      const params = getRouteParams('guides/advanced/topic', false)
      expect(params).toEqual({ slug: 'guides/advanced/topic' })
    })

    it('should return undefined slug for empty path', () => {
      const params = getRouteParams('', false)
      expect(params).toEqual({ slug: undefined })
    })
  })

  describe('with i18n', () => {
    it('should extract locale and slug from path', () => {
      const params = getRouteParams('en/getting-started', true)
      expect(params).toEqual({ locale: 'en', slug: 'getting-started' })
    })

    it('should extract locale and nested slug', () => {
      const params = getRouteParams('de/guides/advanced/topic', true)
      expect(params).toEqual({ locale: 'de', slug: 'guides/advanced/topic' })
    })

    it('should handle locale-only path (index page)', () => {
      const params = getRouteParams('en', true)
      expect(params).toEqual({ locale: 'en', slug: undefined })
    })

    it('should handle path with locale and direct page', () => {
      const params = getRouteParams('fr/intro', true)
      expect(params).toEqual({ locale: 'fr', slug: 'intro' })
    })
  })
})

describe('getDocPath', () => {
  describe('without i18n', () => {
    it('should generate path with default base path', () => {
      const path = getDocPath('getting-started', 'docs', false)
      expect(path).toBe('/docs/getting-started')
    })

    it('should generate path with custom base path', () => {
      const path = getDocPath('getting-started', 'guides', false)
      expect(path).toBe('/guides/getting-started')
    })

    it('should handle nested paths', () => {
      const path = getDocPath('api/endpoints/users', 'docs', false)
      expect(path).toBe('/docs/api/endpoints/users')
    })

    it('should normalize base path with leading slash', () => {
      const path = getDocPath('intro', '/guides', false)
      expect(path).toBe('/guides/intro')
    })

    it('should normalize base path with trailing slash', () => {
      const path = getDocPath('intro', 'guides/', false)
      expect(path).toBe('/guides/intro')
    })

    it('should normalize base path with both slashes', () => {
      const path = getDocPath('intro', '/guides/', false)
      expect(path).toBe('/guides/intro')
    })

    it('should handle multiple leading/trailing slashes', () => {
      const path = getDocPath('intro', '///guides///', false)
      expect(path).toBe('/guides/intro')
    })
  })

  describe('with i18n', () => {
    it('should generate localized path', () => {
      const path = getDocPath('en/getting-started', 'docs', true, 'en')
      expect(path).toBe('/en/docs/getting-started')
    })

    it('should generate localized path for different locale', () => {
      const path = getDocPath('de/einfuehrung', 'docs', true, 'de')
      expect(path).toBe('/de/docs/einfuehrung')
    })

    it('should generate localized path with custom base path', () => {
      const path = getDocPath('en/tutorial', 'guides', true, 'en')
      expect(path).toBe('/en/guides/tutorial')
    })

    it('should handle nested paths with locale', () => {
      const path = getDocPath('en/api/endpoints/users', 'docs', true, 'en')
      expect(path).toBe('/en/docs/api/endpoints/users')
    })

    it('should handle index page (id without nested path)', () => {
      const path = getDocPath('en', 'docs', true, 'en')
      expect(path).toBe('/en/docs/en')
    })
  })

  describe('edge cases', () => {
    it('should handle empty id without i18n', () => {
      const path = getDocPath('', 'docs', false)
      expect(path).toBe('/docs/')
    })

    it('should handle deeply nested base path', () => {
      const path = getDocPath('intro', 'api/reference/v2', false)
      expect(path).toBe('/api/reference/v2/intro')
    })
  })
})
