import type { VersionConfig } from './index'
import { createVersionPathMap } from './routeHelpers'
import { getVersionFromDocId, stripVersionFromDocId } from './versionHelpers'

/**
 * Minimal shape of a docs collection entry needed for path computation.
 */
export interface DocsEntryLike {
  id: string
  data: {
    render?: boolean
  }
}

interface I18nConfig {
  locales: (string | { codes: string[] })[]
}

/**
 * Shape of a single docs instance config stored in the
 * `virtual:shipyard-docs-configs` registry.
 */
export interface DocsInstanceConfig {
  editUrl?: string
  showLastUpdateTime: boolean
  showLastUpdateAuthor: boolean
  routeBasePath: string
  collectionName: string
  llmsTxtEnabled: boolean
  versions?: VersionConfig
}

export type DocsConfigsRegistry = Record<string, DocsInstanceConfig>

/**
 * Resolve which docs instance a given route pattern belongs to.
 *
 * Mirrors the blog package's `getInstanceConfig`: strips an optional
 * `/[locale]/` prefix and the leading slash, then matches against the known
 * basePaths in the registry. basePaths may contain slashes (e.g.
 * `api/reference`), so we match against registered keys rather than splitting
 * on `/`.
 */
export const getDocsInstanceConfig = (
  routePattern: string,
  docsConfigs: DocsConfigsRegistry,
): DocsInstanceConfig => {
  const stripped = routePattern.replace(/^\/?(\[locale\]\/)?/, '')
  for (const [basePath, config] of Object.entries(docsConfigs)) {
    if (stripped === basePath || stripped.startsWith(`${basePath}/`)) {
      return config
    }
  }
  throw new Error(`No docs instance found for route pattern: ${routePattern}`)
}

export interface ComputeDocsEntryPathsOptions {
  collectionName: string
  routeBasePath: string
  versions?: VersionConfig | null
  hasI18n: boolean
}

/**
 * Compute the static paths for the DocsEntry route.
 *
 * Behaviour is identical to the previously generated `getStaticPaths`:
 * - one main path per rendered doc
 * - for versioned docs that belong to the current version, an additional
 *   `latest` alias path that redirects to the canonical version URL
 */
export const computeDocsEntryPaths = (
  allDocs: readonly DocsEntryLike[],
  {
    collectionName: _collectionName,
    routeBasePath,
    versions,
    hasI18n,
  }: ComputeDocsEntryPathsOptions,
) => {
  const hasVersions = !!versions
  const docs = allDocs.filter((doc) => doc.data.render !== false)

  const versionPathMap =
    hasVersions && versions ? createVersionPathMap(versions) : null

  const getParams = (slug: string, version?: string) => {
    if (hasI18n) {
      const [locale, ...rest] = slug.split('/')
      const baseParams = {
        slug: rest.length ? rest.join('/') : undefined,
        locale,
      }
      return version ? { ...baseParams, version } : baseParams
    }
    const baseParams = {
      slug: slug || undefined,
    }
    return version ? { ...baseParams, version } : baseParams
  }

  const paths: {
    params: Record<string, string | undefined>
    props: {
      entry: DocsEntryLike
      routeBasePath: string
      version?: string
      actualVersion?: string
      isLatestAlias: boolean
      docLocale?: string
    }
  }[] = []

  for (const entry of docs) {
    let version: string | undefined
    let docIdWithoutVersion = entry.id

    if (hasVersions && versions && versionPathMap) {
      const extractedVersion = getVersionFromDocId(entry.id)
      if (extractedVersion) {
        version = versionPathMap.get(extractedVersion) ?? extractedVersion
        docIdWithoutVersion = stripVersionFromDocId(entry.id)
      }
    }

    const docLocale = hasI18n ? docIdWithoutVersion.split('/')[0] : undefined

    paths.push({
      params: getParams(docIdWithoutVersion, version),
      props: {
        entry,
        routeBasePath,
        version,
        isLatestAlias: false,
        docLocale,
      },
    })

    if (hasVersions && versions && version) {
      const extractedVersion = getVersionFromDocId(entry.id)
      const currentVersion = versions.current
      if (extractedVersion === currentVersion) {
        paths.push({
          params: getParams(docIdWithoutVersion, 'latest'),
          props: {
            entry,
            routeBasePath,
            version: 'latest',
            actualVersion: version,
            isLatestAlias: true,
            docLocale,
          },
        })
      }
    }
  }

  return paths
}

export interface LatestAliasRedirectInput {
  isLatestAlias?: boolean
  actualVersion?: string
  routeBasePath: string
  docLocale?: string
  pageSlug?: string
}

/**
 * Build the SEO-friendly redirect descriptor for a `/latest/` alias URL.
 * Returns `null` when the current request is not a latest alias.
 *
 * The `/latest/` alias paths are only generated as static paths (props come
 * from getStaticPaths), so this is driven entirely by props — SSR requests
 * never carry `isLatestAlias`.
 */
export const buildLatestAliasRedirect = ({
  isLatestAlias,
  actualVersion,
  routeBasePath,
  docLocale,
  pageSlug,
}: LatestAliasRedirectInput): { targetUrl: string; fromUrl: string } | null => {
  if (!isLatestAlias || !actualVersion) return null
  const targetUrl = docLocale
    ? pageSlug
      ? `/${docLocale}/${routeBasePath}/${actualVersion}/${pageSlug}`
      : `/${docLocale}/${routeBasePath}/${actualVersion}/`
    : pageSlug
      ? `/${routeBasePath}/${actualVersion}/${pageSlug}`
      : `/${routeBasePath}/${actualVersion}/`
  const fromUrl = docLocale
    ? pageSlug
      ? `/${docLocale}/${routeBasePath}/latest/${pageSlug}`
      : `/${docLocale}/${routeBasePath}/latest/`
    : pageSlug
      ? `/${routeBasePath}/latest/${pageSlug}`
      : `/${routeBasePath}/latest/`
  return { targetUrl, fromUrl }
}

/**
 * Render the minimal redirect HTML page body for a latest-alias redirect.
 */
export const renderLatestAliasRedirectHtml = (
  targetUrl: string,
  fromUrl: string,
  canonicalHref: string,
): string =>
  `<!doctype html><title>Redirecting to: ${targetUrl}</title><meta http-equiv="refresh" content="0;url=${targetUrl}"><meta name="robots" content="noindex"><link rel="canonical" href="${canonicalHref}"><body>\t<a href="${targetUrl}">Redirecting from <code>${fromUrl}</code> to <code>${targetUrl}</code></a></body>`

/**
 * Compute static paths for the versioned-root redirect route.
 * Returns one path per locale when i18n is enabled, else a single empty path.
 */
export const getDocsRedirectPaths = (
  i18n: I18nConfig | null | undefined | false,
) => {
  if (i18n) {
    return i18n.locales.map((locale) => {
      const localeCode = typeof locale === 'string' ? locale : locale.codes[0]
      return { params: { locale: localeCode } }
    })
  }
  return [{ params: {} }]
}
