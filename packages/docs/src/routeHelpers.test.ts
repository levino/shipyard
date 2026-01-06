import { describe, expect, it } from 'vitest'
import type { VersionConfig } from './index'
import {
  docExistsInVersion,
  filterDocsByVersion,
  findFallbackDoc,
  getDocVersions,
  getVersionFromDocId,
  groupDocsByVersion,
  stripVersionFromDocId,
} from './index'
import {
  createDeprecatedVersionSet,
  createVersionPathMap,
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

// Tests for versioned content collection helpers
describe('getVersionFromDocId', () => {
  describe('valid version patterns', () => {
    it('should extract version from v-prefixed semantic version', () => {
      expect(getVersionFromDocId('v1.0/en/getting-started')).toBe('v1.0')
      expect(getVersionFromDocId('v2.0.0/en/intro')).toBe('v2.0.0')
      expect(getVersionFromDocId('v10.20.30/guide')).toBe('v10.20.30')
    })

    it('should extract version without v prefix', () => {
      expect(getVersionFromDocId('1.0/en/getting-started')).toBe('1.0')
      expect(getVersionFromDocId('2.0.0/intro')).toBe('2.0.0')
    })

    it('should extract special version names', () => {
      expect(getVersionFromDocId('latest/en/intro')).toBe('latest')
      expect(getVersionFromDocId('next/guide')).toBe('next')
      expect(getVersionFromDocId('main/docs/index')).toBe('main')
      expect(getVersionFromDocId('master/en/intro')).toBe('master')
      expect(getVersionFromDocId('canary/en/intro')).toBe('canary')
      expect(getVersionFromDocId('beta/en/intro')).toBe('beta')
      expect(getVersionFromDocId('alpha/en/intro')).toBe('alpha')
      expect(getVersionFromDocId('stable/en/intro')).toBe('stable')
    })

    it('should extract release candidate versions', () => {
      expect(getVersionFromDocId('rc1/en/intro')).toBe('rc1')
      expect(getVersionFromDocId('rc/guide')).toBe('rc')
    })
  })

  describe('non-versioned paths', () => {
    it('should return undefined for locale-only paths', () => {
      expect(getVersionFromDocId('en/getting-started')).toBeUndefined()
      expect(getVersionFromDocId('de/intro')).toBeUndefined()
    })

    it('should return undefined for paths not starting with version', () => {
      expect(getVersionFromDocId('docs/v1.0/intro')).toBeUndefined()
      expect(getVersionFromDocId('guide')).toBeUndefined()
    })

    it('should return undefined for empty paths', () => {
      expect(getVersionFromDocId('')).toBeUndefined()
    })
  })
})

describe('stripVersionFromDocId', () => {
  it('should remove version prefix from doc id', () => {
    expect(stripVersionFromDocId('v1.0/en/getting-started')).toBe(
      'en/getting-started',
    )
    expect(stripVersionFromDocId('latest/en/index')).toBe('en/index')
    expect(stripVersionFromDocId('v2.0.0/guide/intro')).toBe('guide/intro')
  })

  it('should return unchanged path for non-versioned docs', () => {
    expect(stripVersionFromDocId('en/getting-started')).toBe(
      'en/getting-started',
    )
    expect(stripVersionFromDocId('guide')).toBe('guide')
  })

  it('should handle single segment versioned paths', () => {
    expect(stripVersionFromDocId('v1.0/index')).toBe('index')
    expect(stripVersionFromDocId('latest/readme')).toBe('readme')
  })
})

describe('filterDocsByVersion', () => {
  const mockDocs = [
    { id: 'v1.0/en/intro', data: {} },
    { id: 'v1.0/en/guide', data: {} },
    { id: 'v2.0/en/intro', data: {} },
    { id: 'v2.0/en/guide', data: {} },
    { id: 'v2.0/en/new-feature', data: {} },
    { id: 'latest/en/intro', data: {} },
  ]

  it('should filter docs by version', () => {
    const v1Docs = filterDocsByVersion(mockDocs, 'v1.0')
    expect(v1Docs).toHaveLength(2)
    expect(v1Docs.map((d) => d.id)).toEqual(['v1.0/en/intro', 'v1.0/en/guide'])
  })

  it('should return empty array for non-existent version', () => {
    const docs = filterDocsByVersion(mockDocs, 'v3.0')
    expect(docs).toHaveLength(0)
  })

  it('should handle special version names', () => {
    const latestDocs = filterDocsByVersion(mockDocs, 'latest')
    expect(latestDocs).toHaveLength(1)
    expect(latestDocs[0].id).toBe('latest/en/intro')
  })

  it('should handle empty docs array', () => {
    const docs = filterDocsByVersion([], 'v1.0')
    expect(docs).toHaveLength(0)
  })
})

describe('groupDocsByVersion', () => {
  const mockDocs = [
    { id: 'v1.0/en/intro', data: {} },
    { id: 'v1.0/de/intro', data: {} },
    { id: 'v2.0/en/intro', data: {} },
    { id: 'v2.0/en/guide', data: {} },
    { id: 'latest/en/intro', data: {} },
  ]

  it('should group docs by version', () => {
    const groups = groupDocsByVersion(mockDocs)

    expect(groups.size).toBe(3)
    expect(groups.get('v1.0')).toHaveLength(2)
    expect(groups.get('v2.0')).toHaveLength(2)
    expect(groups.get('latest')).toHaveLength(1)
  })

  it('should handle empty docs array', () => {
    const groups = groupDocsByVersion([])
    expect(groups.size).toBe(0)
  })

  it('should handle non-versioned docs', () => {
    const nonVersionedDocs = [
      { id: 'en/intro', data: {} },
      { id: 'de/guide', data: {} },
    ]
    const groups = groupDocsByVersion(nonVersionedDocs)

    expect(groups.size).toBe(1)
    expect(groups.get(undefined)).toHaveLength(2)
  })

  it('should handle mixed versioned and non-versioned docs', () => {
    const mixedDocs = [
      { id: 'v1.0/en/intro', data: {} },
      { id: 'en/guide', data: {} },
    ]
    const groups = groupDocsByVersion(mixedDocs)

    expect(groups.size).toBe(2)
    expect(groups.get('v1.0')).toHaveLength(1)
    expect(groups.get(undefined)).toHaveLength(1)
  })
})

describe('findFallbackDoc', () => {
  const mockDocs = [
    { id: 'v1.0/en/intro', data: { title: 'Intro v1' } },
    { id: 'v1.0/en/guide', data: { title: 'Guide v1' } },
    { id: 'v2.0/en/intro', data: { title: 'Intro v2' } },
    { id: 'v2.0/en/guide', data: { title: 'Guide v2' } },
    { id: 'v2.0/en/new-feature', data: { title: 'New Feature v2' } },
    { id: 'latest/en/intro', data: { title: 'Intro latest' } },
    { id: 'latest/en/guide', data: { title: 'Guide latest' } },
    { id: 'latest/en/new-feature', data: { title: 'New Feature latest' } },
    { id: 'latest/en/bleeding-edge', data: { title: 'Bleeding Edge' } },
  ]

  it('should find fallback doc in first matching version', () => {
    // new-feature doesn't exist in v1.0, should fall back to v2.0
    const result = findFallbackDoc(mockDocs, 'en/new-feature', 'v1.0', [
      'v2.0',
      'latest',
    ])
    expect(result).toBeDefined()
    expect(result?.version).toBe('v2.0')
    expect(result?.doc.id).toBe('v2.0/en/new-feature')
  })

  it('should return first matching fallback in order', () => {
    // intro exists in all versions, should return first fallback
    const result = findFallbackDoc(mockDocs, 'en/intro', 'v1.0', [
      'v2.0',
      'latest',
    ])
    expect(result?.version).toBe('v2.0')
  })

  it('should skip the requested version even if in fallback list', () => {
    const result = findFallbackDoc(mockDocs, 'en/intro', 'v1.0', [
      'v1.0',
      'v2.0',
    ])
    expect(result?.version).toBe('v2.0')
  })

  it('should return undefined when doc not found in any fallback', () => {
    // bleeding-edge only exists in latest
    const result = findFallbackDoc(mockDocs, 'en/bleeding-edge', 'v1.0', [
      'v2.0',
    ])
    expect(result).toBeUndefined()
  })

  it('should return undefined for empty fallback versions', () => {
    const result = findFallbackDoc(mockDocs, 'en/intro', 'v1.0', [])
    expect(result).toBeUndefined()
  })

  it('should handle empty docs array', () => {
    const result = findFallbackDoc([], 'en/intro', 'v1.0', ['v2.0', 'latest'])
    expect(result).toBeUndefined()
  })
})

describe('docExistsInVersion', () => {
  const mockDocs = [
    { id: 'v1.0/en/intro', data: {} },
    { id: 'v2.0/en/intro', data: {} },
    { id: 'v2.0/en/new-feature', data: {} },
  ]

  it('should return true when doc exists in version', () => {
    expect(docExistsInVersion(mockDocs, 'en/intro', 'v1.0')).toBe(true)
    expect(docExistsInVersion(mockDocs, 'en/intro', 'v2.0')).toBe(true)
    expect(docExistsInVersion(mockDocs, 'en/new-feature', 'v2.0')).toBe(true)
  })

  it('should return false when doc does not exist in version', () => {
    expect(docExistsInVersion(mockDocs, 'en/new-feature', 'v1.0')).toBe(false)
    expect(docExistsInVersion(mockDocs, 'en/intro', 'v3.0')).toBe(false)
    expect(docExistsInVersion(mockDocs, 'en/nonexistent', 'v1.0')).toBe(false)
  })

  it('should handle empty docs array', () => {
    expect(docExistsInVersion([], 'en/intro', 'v1.0')).toBe(false)
  })
})

describe('getDocVersions', () => {
  const mockDocs = [
    { id: 'v1.0/en/intro', data: {} },
    { id: 'v1.0/de/intro', data: {} },
    { id: 'v2.0/en/intro', data: {} },
    { id: 'v2.0/en/new-feature', data: {} },
    { id: 'latest/en/intro', data: {} },
    { id: 'latest/en/new-feature', data: {} },
    { id: 'latest/en/bleeding-edge', data: {} },
  ]

  it('should return all versions where doc exists', () => {
    const versions = getDocVersions(mockDocs, 'en/intro')
    expect(versions).toHaveLength(3)
    expect(versions).toContain('v1.0')
    expect(versions).toContain('v2.0')
    expect(versions).toContain('latest')
  })

  it('should return limited versions for version-specific doc', () => {
    const versions = getDocVersions(mockDocs, 'en/new-feature')
    expect(versions).toHaveLength(2)
    expect(versions).toContain('v2.0')
    expect(versions).toContain('latest')
    expect(versions).not.toContain('v1.0')
  })

  it('should return single version for doc only in one version', () => {
    const versions = getDocVersions(mockDocs, 'en/bleeding-edge')
    expect(versions).toHaveLength(1)
    expect(versions).toContain('latest')
  })

  it('should return empty array for nonexistent doc', () => {
    const versions = getDocVersions(mockDocs, 'en/nonexistent')
    expect(versions).toHaveLength(0)
  })

  it('should handle locale-specific docs', () => {
    // de/intro only exists in v1.0
    const versions = getDocVersions(mockDocs, 'de/intro')
    expect(versions).toHaveLength(1)
    expect(versions).toContain('v1.0')
  })

  it('should not return duplicates', () => {
    // Even if we have multiple docs with same version, should only list once
    const docsWithDuplicates = [
      { id: 'v1.0/en/intro', data: {} },
      { id: 'v1.0/en/intro', data: {} }, // Duplicate
    ]
    const versions = getDocVersions(docsWithDuplicates, 'en/intro')
    expect(versions).toHaveLength(1)
  })

  it('should handle empty docs array', () => {
    const versions = getDocVersions([], 'en/intro')
    expect(versions).toHaveLength(0)
  })
})

// Performance optimization helpers
describe('createVersionPathMap', () => {
  const testVersions: VersionConfig = {
    current: 'v2',
    available: [
      { version: 'v2', label: 'Version 2.0' },
      { version: 'v1', label: 'Version 1.0' },
    ],
    deprecated: ['v1'],
    stable: 'v2',
  }

  it('should create a Map from version to path', () => {
    const map = createVersionPathMap(testVersions)
    expect(map.get('v2')).toBe('v2')
    expect(map.get('v1')).toBe('v1')
  })

  it('should use custom path when specified', () => {
    const versionsWithCustomPaths: VersionConfig = {
      current: 'v2.0.0',
      available: [
        { version: 'v2.0.0', label: 'Version 2.0', path: 'v2' },
        { version: 'v1.0.0', label: 'Version 1.0', path: 'v1' },
      ],
      stable: 'v2.0.0',
    }
    const map = createVersionPathMap(versionsWithCustomPaths)
    expect(map.get('v2.0.0')).toBe('v2')
    expect(map.get('v1.0.0')).toBe('v1')
  })

  it('should return undefined for non-existent version', () => {
    const map = createVersionPathMap(testVersions)
    expect(map.get('v3')).toBeUndefined()
  })

  it('should handle empty available array', () => {
    const emptyVersions: VersionConfig = {
      current: 'v1',
      available: [],
      stable: 'v1',
    }
    const map = createVersionPathMap(emptyVersions)
    expect(map.size).toBe(0)
  })

  it('should handle many versions efficiently', () => {
    const manyVersions: VersionConfig = {
      current: 'v10',
      available: Array.from({ length: 10 }, (_, i) => ({
        version: `v${i + 1}`,
        label: `Version ${i + 1}`,
      })),
      stable: 'v10',
    }
    const map = createVersionPathMap(manyVersions)
    expect(map.size).toBe(10)
    expect(map.get('v1')).toBe('v1')
    expect(map.get('v10')).toBe('v10')
  })
})

describe('createDeprecatedVersionSet', () => {
  it('should create a Set from deprecated versions array', () => {
    const versions: VersionConfig = {
      current: 'v3',
      available: [{ version: 'v3' }, { version: 'v2' }, { version: 'v1' }],
      deprecated: ['v1', 'v2'],
      stable: 'v3',
    }
    const set = createDeprecatedVersionSet(versions)
    expect(set.has('v1')).toBe(true)
    expect(set.has('v2')).toBe(true)
    expect(set.has('v3')).toBe(false)
  })

  it('should return empty Set when deprecated is undefined', () => {
    const versions: VersionConfig = {
      current: 'v1',
      available: [{ version: 'v1' }],
      stable: 'v1',
    }
    const set = createDeprecatedVersionSet(versions)
    expect(set.size).toBe(0)
  })

  it('should return empty Set when deprecated is empty array', () => {
    const versions: VersionConfig = {
      current: 'v1',
      available: [{ version: 'v1' }],
      deprecated: [],
      stable: 'v1',
    }
    const set = createDeprecatedVersionSet(versions)
    expect(set.size).toBe(0)
  })

  it('should provide O(1) lookup for many deprecated versions', () => {
    const versions: VersionConfig = {
      current: 'v20',
      available: Array.from({ length: 20 }, (_, i) => ({
        version: `v${i + 1}`,
      })),
      deprecated: Array.from({ length: 15 }, (_, i) => `v${i + 1}`),
      stable: 'v20',
    }
    const set = createDeprecatedVersionSet(versions)
    expect(set.size).toBe(15)
    // Check O(1) lookups
    expect(set.has('v1')).toBe(true)
    expect(set.has('v15')).toBe(true)
    expect(set.has('v16')).toBe(false)
    expect(set.has('v20')).toBe(false)
  })
})
