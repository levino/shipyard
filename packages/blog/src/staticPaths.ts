/**
 * Shared static path computation functions for blog route components.
 * These are pure functions that accept pre-fetched data and return computed paths.
 * They don't import from astro:content so they can be used in any context.
 */

interface BlogPost {
  id: string
  data: {
    date: Date
    title: string
    draft?: boolean
    unlisted?: boolean
    tags?: string[]
    authors?: string | { name: string } | (string | { name: string })[]
    sidebar?: { label?: string }
  }
  body?: string
  filePath?: string
}

interface I18nConfig {
  locales: (string | { codes: string[] })[]
}

interface BlogConfigForPaths {
  routeBasePath: string
  includeDraftsInDev: boolean
  postsPerPage: number
  archiveEnabled?: boolean
  authorsEnabled?: boolean
}

function shouldIncludePost(
  post: BlogPost,
  isDev: boolean,
  includeDraftsInDev: boolean,
): boolean {
  if (post.data.draft && !(isDev && includeDraftsInDev)) return false
  return true
}

function shouldIncludeInListing(
  post: BlogPost,
  isDev: boolean,
  includeDraftsInDev: boolean,
): boolean {
  if (post.data.unlisted) return false
  return shouldIncludePost(post, isDev, includeDraftsInDev)
}

/**
 * Simple locale-based static paths (used by BlogIndex, BlogTagsIndex, BlogArchive, BlogAuthorsIndex).
 */
export function getLocalePaths(i18n: I18nConfig | null | undefined | false) {
  if (i18n) {
    return i18n.locales.map((locale) => {
      if (typeof locale !== 'string') {
        throw new Error('shipyard does only support strings as locales.')
      }
      return { params: { locale } }
    })
  }
  return [{ params: {} }]
}

/**
 * Compute static paths for BlogEntry (one path per blog post with prev/next pagination).
 */
export function computeBlogEntryPaths(
  allPosts: BlogPost[],
  blogConfig: BlogConfigForPaths,
  i18n: I18nConfig | null | undefined | false,
) {
  const isDev = import.meta.env?.DEV ?? false
  const blogPosts = allPosts.filter((post) =>
    shouldIncludePost(post, isDev, blogConfig.includeDraftsInDev),
  )
  const sortedPosts = blogPosts.toSorted(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  const getParams = (slug: string) => {
    if (i18n) {
      const [locale, ...rest] = slug.split('/')
      return { slug: rest.join('/'), locale }
    }
    return { slug }
  }

  const getPostUrl = (post: BlogPost) => {
    const { routeBasePath } = blogConfig
    if (i18n) {
      const [locale, ...rest] = post.id.split('/')
      return `/${locale}/${routeBasePath}/${rest.join('/')}`
    }
    return `/${routeBasePath}/${post.id}`
  }

  return sortedPosts.map((entry) => {
    let localePosts = sortedPosts
    if (i18n) {
      const [locale] = entry.id.split('/')
      localePosts = sortedPosts.filter((post) =>
        post.id.startsWith(`${locale}/`),
      )
    }

    const localeIndex = localePosts.findIndex((post) => post.id === entry.id)
    const newerPost = localeIndex > 0 ? localePosts[localeIndex - 1] : undefined
    const olderPost =
      localeIndex < localePosts.length - 1
        ? localePosts[localeIndex + 1]
        : undefined

    return {
      params: getParams(entry.id),
      props: {
        entry,
        older: olderPost
          ? { href: getPostUrl(olderPost), title: olderPost.data.title }
          : undefined,
        newer: newerPost
          ? { href: getPostUrl(newerPost), title: newerPost.data.title }
          : undefined,
      },
    }
  })
}

/**
 * Compute static paths for BlogIndexPaginated (one path per page, starting from page 2).
 */
export function computeBlogPaginatedPaths(
  allPosts: BlogPost[],
  blogConfig: BlogConfigForPaths,
  i18n: I18nConfig | null | undefined | false,
) {
  if (i18n) {
    const paths: { params: { locale: string; page: string } }[] = []
    for (const locale of i18n.locales) {
      if (typeof locale !== 'string') {
        throw new Error('shipyard does only support strings as locales.')
      }
      const localePosts = allPosts.filter(({ id }) => {
        const [postLocale] = id.split('/')
        return postLocale === locale
      })
      const totalPages = Math.ceil(localePosts.length / blogConfig.postsPerPage)
      for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
        paths.push({ params: { locale, page: String(pageNum) } })
      }
    }
    return paths
  }

  const totalPages = Math.ceil(allPosts.length / blogConfig.postsPerPage)
  const paths: { params: { page: string } }[] = []
  for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
    paths.push({ params: { page: String(pageNum) } })
  }
  return paths
}

/**
 * Compute static paths for BlogTagPage (one path per tag per locale).
 */
export function computeBlogTagPaths(
  allPosts: BlogPost[],
  blogConfig: BlogConfigForPaths,
  i18n: I18nConfig | null | undefined | false,
) {
  const isDev = import.meta.env?.DEV ?? false

  const getAllTags = (posts: BlogPost[]) => {
    const filtered = posts.filter((p) =>
      shouldIncludeInListing(p, isDev, blogConfig.includeDraftsInDev),
    )
    const tags = filtered.flatMap((post) => post.data.tags ?? [])
    return [...new Set(tags.map((t) => t.toLowerCase()))]
  }

  if (i18n) {
    const paths: { params: { locale: string; tag: string } }[] = []
    for (const locale of i18n.locales) {
      if (typeof locale !== 'string') continue
      const localePosts = allPosts.filter((post) => {
        const [postLocale] = post.id.split('/')
        return postLocale === locale
      })
      const localeTags = getAllTags(localePosts)
      for (const tag of localeTags) {
        paths.push({ params: { locale, tag } })
      }
    }
    return paths
  }

  const allTags = getAllTags(allPosts)
  return allTags.map((tag) => ({ params: { tag } }))
}

/**
 * Compute static paths for BlogAuthorPage (one path per author per locale).
 */
export function computeBlogAuthorPaths(
  allPosts: BlogPost[],
  blogConfig: BlogConfigForPaths,
  i18n: I18nConfig | null | undefined | false,
) {
  if (!blogConfig.authorsEnabled) return []

  const isDev = import.meta.env?.DEV ?? false

  const normalizeAuthor = (
    author: string | { name: string },
  ): { name: string } => {
    if (typeof author === 'string') return { name: author }
    return author
  }

  const getAuthorsFromPost = (post: BlogPost) => {
    const authors = post.data.authors
    if (!authors) return []
    if (Array.isArray(authors)) return authors.map(normalizeAuthor)
    return [normalizeAuthor(authors)]
  }

  const getAuthorSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-')

  const getUniqueAuthors = (posts: BlogPost[]) => {
    const filtered = posts.filter((p) =>
      shouldIncludeInListing(p, isDev, blogConfig.includeDraftsInDev),
    )
    const allAuthors = filtered.flatMap(getAuthorsFromPost)
    const seen = new Set<string>()
    return allAuthors.filter((a) => {
      if (seen.has(a.name)) return false
      seen.add(a.name)
      return true
    })
  }

  if (i18n) {
    const paths: {
      params: { locale: string; author: string }
      props: { author: { name: string } }
    }[] = []

    for (const locale of i18n.locales) {
      if (typeof locale !== 'string') {
        throw new Error('shipyard does only support strings as locales.')
      }
      const localePosts = allPosts.filter((post) => {
        const [postLocale] = post.id.split('/')
        return postLocale === locale
      })
      const authors = getUniqueAuthors(localePosts)
      for (const author of authors) {
        paths.push({
          params: { locale, author: getAuthorSlug(author.name) },
          props: { author },
        })
      }
    }
    return paths
  }

  const authors = getUniqueAuthors(allPosts)
  return authors.map((author) => ({
    params: { author: getAuthorSlug(author.name) },
    props: { author },
  }))
}
