import { describe, expect, it } from 'vitest'
import type { VersionConfig } from './index'
import {
  findVersionConfig,
  getAvailableVersions,
  getCurrentVersion,
  getDocPath,
  getRouteParams,
  getStableVersion,
  getVersionedDocPath,
  getVersionedRouteParams,
  getVersionPath,
  isVersionDeprecated,
  switchVersionInPath,
} from './routeHelpers'

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

// Sample version config for testing
const sampleVersionConfig: VersionConfig = {
  current: 'v2.0',
  available: [
    { version: 'v3.0', label: 'Version 3.0 (Preview)', banner: 'unreleased' },
    { version: 'v2.0', label: 'Version 2.0' },
    {
      version: 'v1.0',
      label: 'Version 1.0',
      path: 'v1',
      banner: 'unmaintained',
    },
  ],
  deprecated: ['v1.0'],
  stable: 'v2.0',
}

describe('getVersionPath', () => {
  it('should return version string when path is not defined', () => {
    const path = getVersionPath('v2.0', sampleVersionConfig)
    expect(path).toBe('v2.0')
  })

  it('should return custom path when defined', () => {
    const path = getVersionPath('v1.0', sampleVersionConfig)
    expect(path).toBe('v1')
  })

  it('should return undefined for non-existent version', () => {
    const path = getVersionPath('v0.5', sampleVersionConfig)
    expect(path).toBeUndefined()
  })
})

describe('getCurrentVersion', () => {
  it('should return the current version', () => {
    expect(getCurrentVersion(sampleVersionConfig)).toBe('v2.0')
  })
})

describe('getAvailableVersions', () => {
  it('should return all available versions', () => {
    const versions = getAvailableVersions(sampleVersionConfig)
    expect(versions).toHaveLength(3)
    expect(versions[0].version).toBe('v3.0')
    expect(versions[1].version).toBe('v2.0')
    expect(versions[2].version).toBe('v1.0')
  })
})

describe('isVersionDeprecated', () => {
  it('should return true for deprecated versions', () => {
    expect(isVersionDeprecated('v1.0', sampleVersionConfig)).toBe(true)
  })

  it('should return false for non-deprecated versions', () => {
    expect(isVersionDeprecated('v2.0', sampleVersionConfig)).toBe(false)
  })

  it('should return false for non-existent versions', () => {
    expect(isVersionDeprecated('v0.5', sampleVersionConfig)).toBe(false)
  })

  it('should handle config without deprecated array', () => {
    const configWithoutDeprecated: VersionConfig = {
      current: 'v1.0',
      available: [{ version: 'v1.0' }],
    }
    expect(isVersionDeprecated('v1.0', configWithoutDeprecated)).toBe(false)
  })
})

describe('getStableVersion', () => {
  it('should return stable version when defined', () => {
    expect(getStableVersion(sampleVersionConfig)).toBe('v2.0')
  })

  it('should fall back to current when stable is not defined', () => {
    const configWithoutStable: VersionConfig = {
      current: 'v3.0',
      available: [{ version: 'v3.0' }],
    }
    expect(getStableVersion(configWithoutStable)).toBe('v3.0')
  })
})

describe('findVersionConfig', () => {
  it('should find version by version string', () => {
    const config = findVersionConfig('v2.0', sampleVersionConfig)
    expect(config).toBeDefined()
    expect(config?.version).toBe('v2.0')
    expect(config?.label).toBe('Version 2.0')
  })

  it('should find version by path', () => {
    const config = findVersionConfig('v1', sampleVersionConfig)
    expect(config).toBeDefined()
    expect(config?.version).toBe('v1.0')
  })

  it('should return undefined for non-existent version', () => {
    const config = findVersionConfig('v0.5', sampleVersionConfig)
    expect(config).toBeUndefined()
  })
})

describe('getVersionedDocPath', () => {
  describe('without i18n', () => {
    it('should generate versioned path', () => {
      const path = getVersionedDocPath('getting-started', 'docs', false, 'v2.0')
      expect(path).toBe('/docs/v2.0/getting-started')
    })

    it('should handle nested paths', () => {
      const path = getVersionedDocPath('guides/advanced', 'docs', false, 'v1')
      expect(path).toBe('/docs/v1/guides/advanced')
    })

    it('should normalize base path', () => {
      const path = getVersionedDocPath('intro', '/docs/', false, 'v2.0')
      expect(path).toBe('/docs/v2.0/intro')
    })

    it('should normalize version path', () => {
      const path = getVersionedDocPath('intro', 'docs', false, '/v2.0/')
      expect(path).toBe('/docs/v2.0/intro')
    })
  })

  describe('with i18n', () => {
    it('should generate versioned localized path', () => {
      const path = getVersionedDocPath(
        'en/getting-started',
        'docs',
        true,
        'v2.0',
        'en',
      )
      expect(path).toBe('/en/docs/v2.0/getting-started')
    })

    it('should handle nested paths with locale', () => {
      const path = getVersionedDocPath(
        'de/guides/advanced',
        'docs',
        true,
        'v1',
        'de',
      )
      expect(path).toBe('/de/docs/v1/guides/advanced')
    })

    it('should handle custom base path', () => {
      const path = getVersionedDocPath(
        'en/tutorial',
        'guides',
        true,
        'v3.0',
        'en',
      )
      expect(path).toBe('/en/guides/v3.0/tutorial')
    })
  })
})

describe('getVersionedRouteParams', () => {
  it('should include version in params without i18n', () => {
    const params = getVersionedRouteParams('getting-started', false, 'v2.0')
    expect(params).toEqual({
      slug: 'getting-started',
      version: 'v2.0',
    })
  })

  it('should include version and locale in params with i18n', () => {
    const params = getVersionedRouteParams('en/getting-started', true, 'v2.0')
    expect(params).toEqual({
      locale: 'en',
      slug: 'getting-started',
      version: 'v2.0',
    })
  })
})

describe('switchVersionInPath', () => {
  it('should switch version in simple path', () => {
    const newPath = switchVersionInPath('/docs/v1.0/intro', 'v2.0', 'v1.0')
    expect(newPath).toBe('/docs/v2.0/intro')
  })

  it('should switch version in localized path', () => {
    const newPath = switchVersionInPath(
      '/en/docs/v1.0/getting-started',
      'v2.0',
      'v1.0',
    )
    expect(newPath).toBe('/en/docs/v2.0/getting-started')
  })

  it('should handle special regex characters in version', () => {
    const newPath = switchVersionInPath(
      '/docs/v1.0-beta/intro',
      'v2.0',
      'v1.0-beta',
    )
    expect(newPath).toBe('/docs/v2.0/intro')
  })

  it('should handle custom path aliases', () => {
    const newPath = switchVersionInPath('/docs/v1/intro', 'v2', 'v1')
    expect(newPath).toBe('/docs/v2/intro')
  })

  it('should only replace first occurrence', () => {
    // Edge case: if version appears multiple times, only first is replaced
    const newPath = switchVersionInPath('/docs/v1/v1/intro', 'v2', 'v1')
    expect(newPath).toBe('/docs/v2/v1/intro')
  })
})
