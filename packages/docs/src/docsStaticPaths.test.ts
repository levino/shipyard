import { describe, expect, it } from 'vitest'
import {
  computeDocsEntryPaths,
  type DocsConfigsRegistry,
  type DocsEntryLike,
  getDocsInstanceConfig,
} from './docsStaticPaths'
import type { VersionConfig } from './index'

const makeConfig = (
  routeBasePath: string,
  versions?: VersionConfig,
): DocsConfigsRegistry[string] => ({
  showLastUpdateTime: false,
  showLastUpdateAuthor: false,
  routeBasePath,
  collectionName: routeBasePath,
  llmsTxtEnabled: false,
  versions,
})

describe('getDocsInstanceConfig', () => {
  const registry: DocsConfigsRegistry = {
    docs: makeConfig('docs'),
    'api/reference': makeConfig('api/reference'),
  }

  it('matches non-i18n route pattern', () => {
    expect(
      getDocsInstanceConfig('/docs/[...slug]', registry).routeBasePath,
    ).toBe('docs')
  })

  it('matches i18n route pattern', () => {
    expect(
      getDocsInstanceConfig('/[locale]/docs/[...slug]', registry).routeBasePath,
    ).toBe('docs')
  })

  it('matches multi-segment basePath', () => {
    expect(
      getDocsInstanceConfig('/api/reference/[...slug]', registry).routeBasePath,
    ).toBe('api/reference')
  })

  it('matches multi-segment basePath with i18n', () => {
    expect(
      getDocsInstanceConfig('/[locale]/api/reference/[...slug]', registry)
        .routeBasePath,
    ).toBe('api/reference')
  })

  it('matches versioned route pattern', () => {
    expect(
      getDocsInstanceConfig('/docs/[version]/[...slug]', registry)
        .routeBasePath,
    ).toBe('docs')
  })

  it('matches the bare basePath pattern (redirect route)', () => {
    expect(
      getDocsInstanceConfig('/[locale]/docs', registry).routeBasePath,
    ).toBe('docs')
  })

  it('throws when no instance matches', () => {
    expect(() => getDocsInstanceConfig('/blog/[...slug]', registry)).toThrow(
      /No docs instance found/,
    )
  })
})

describe('computeDocsEntryPaths', () => {
  const docs: DocsEntryLike[] = [
    { id: 'getting-started', data: {} },
    { id: 'guides/intro', data: {} },
    { id: 'hidden', data: { render: false } },
  ]

  it('computes non-i18n paths', () => {
    const paths = computeDocsEntryPaths(docs, {
      collectionName: 'docs',
      routeBasePath: 'docs',
      hasI18n: false,
    })
    expect(paths).toHaveLength(2)
    expect(paths[0].params).toEqual({ slug: 'getting-started' })
    expect(paths[0].props.routeBasePath).toBe('docs')
    expect(paths[0].props.isLatestAlias).toBe(false)
    expect(paths[1].params).toEqual({ slug: 'guides/intro' })
  })

  it('computes i18n paths with locale + slug split', () => {
    const i18nDocs: DocsEntryLike[] = [
      { id: 'en/getting-started', data: {} },
      // Astro's glob loader strips "index" so an index page has id "en"
      { id: 'en', data: {} },
    ]
    const paths = computeDocsEntryPaths(i18nDocs, {
      collectionName: 'docs',
      routeBasePath: 'docs',
      hasI18n: true,
    })
    expect(paths).toHaveLength(2)
    expect(paths[0].params).toEqual({ locale: 'en', slug: 'getting-started' })
    expect(paths[0].props.docLocale).toBe('en')
    // "en" (locale-root index) -> slug undefined
    expect(paths[1].params).toEqual({ locale: 'en', slug: undefined })
  })

  it('generates a latest alias for current-version docs', () => {
    const versions: VersionConfig = {
      current: 'v2.0',
      available: [
        { version: 'v2.0', path: 'v2' },
        { version: 'v1.0', path: 'v1' },
      ],
      deprecated: [],
    }
    const versionedDocs: DocsEntryLike[] = [
      { id: 'v2.0/en/getting-started', data: {} },
      { id: 'v1.0/en/getting-started', data: {} },
    ]
    const paths = computeDocsEntryPaths(versionedDocs, {
      collectionName: 'docs',
      routeBasePath: 'docs',
      versions,
      hasI18n: true,
    })

    // v2.0 doc -> main (version path 'v2') + latest alias
    // v1.0 doc -> main only ('v1')
    expect(paths).toHaveLength(3)

    const v2Main = paths.find(
      (p) => p.params.version === 'v2' && !p.props.isLatestAlias,
    )
    expect(v2Main).toBeDefined()
    expect(v2Main?.params).toEqual({
      locale: 'en',
      slug: 'getting-started',
      version: 'v2',
    })

    const latestAlias = paths.find((p) => p.props.isLatestAlias)
    expect(latestAlias).toBeDefined()
    expect(latestAlias?.params.version).toBe('latest')
    expect(latestAlias?.props.actualVersion).toBe('v2')

    const v1Main = paths.find((p) => p.params.version === 'v1')
    expect(v1Main).toBeDefined()
    expect(v1Main?.props.isLatestAlias).toBe(false)
  })
})
