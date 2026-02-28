interface FeedPost {
  id: string
  data: {
    date: Date
    title: string
    description: string
    draft?: boolean
    unlisted?: boolean
    tags?: string[]
  }
}

interface I18nConfig {
  locales: (string | { codes: string[] })[]
}

const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const buildUrl = (
  baseUrl: string,
  ...segments: (string | undefined | null)[]
): string => {
  const url = new URL(baseUrl)
  const parts = [
    url.pathname.replace(/\/$/, ''),
    ...segments
      .filter(Boolean)
      .map((s) => (s as string).replace(/^\/|\/$/g, '')),
  ]
  url.pathname = `/${parts.filter(Boolean).join('/')}`
  return url.toString()
}

const filterPosts = (
  allPosts: FeedPost[],
  includeDraftsInDev: boolean,
  currentLocale: string | undefined,
  i18n: I18nConfig | null | undefined | false,
  limit: number,
  isDev: boolean,
): FeedPost[] =>
  allPosts
    .filter((post) => {
      if (post.data.unlisted) return false
      if (post.data.draft && !(isDev && includeDraftsInDev)) return false
      return true
    })
    .filter((post) => {
      if (i18n) {
        const [pl] = post.id.split('/')
        return pl === currentLocale
      }
      return true
    })
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit)

const getPostUrl = (
  post: FeedPost,
  routeBasePath: string,
  baseUrl: string,
  currentLocale: string | undefined,
  i18n: I18nConfig | null | undefined | false,
): string => {
  if (i18n && currentLocale) {
    const slug = post.id.replace(`${currentLocale}/`, '')
    return buildUrl(baseUrl, currentLocale, routeBasePath, slug)
  }
  return buildUrl(baseUrl, routeBasePath, post.id)
}

export interface FeedParams {
  allPosts: FeedPost[]
  blogConfig: {
    routeBasePath: string
    blogTitle: string
    blogDescription?: string
    includeDraftsInDev: boolean
    feedOptions: {
      limit: number
      title?: string
      description?: string
    }
  }
  site: URL | undefined
  currentLocale: string | undefined
  i18n: I18nConfig | null | undefined | false
  isDev: boolean
}

export const createRssResponse = ({
  allPosts,
  blogConfig,
  site,
  currentLocale,
  i18n,
  isDev,
}: FeedParams): Response => {
  const baseUrl = site?.toString() ?? 'https://example.com'
  const { feedOptions, blogTitle, blogDescription, routeBasePath } = blogConfig
  const posts = filterPosts(
    allPosts,
    blogConfig.includeDraftsInDev,
    currentLocale,
    i18n,
    feedOptions.limit,
    isDev,
  )
  const title = feedOptions.title ?? blogTitle
  const description =
    feedOptions.description ?? blogDescription ?? `${title} Feed`
  const feedUrl = i18n
    ? buildUrl(baseUrl, currentLocale ?? '', routeBasePath, 'rss.xml')
    : buildUrl(baseUrl, routeBasePath, 'rss.xml')

  const items = posts
    .map((post) => {
      const postUrl = getPostUrl(
        post,
        routeBasePath,
        baseUrl,
        currentLocale,
        i18n,
      )
      return [
        '    <item>',
        `      <title>${escapeXml(post.data.title)}</title>`,
        `      <link>${escapeXml(postUrl)}</link>`,
        `      <description>${escapeXml(post.data.description)}</description>`,
        `      <pubDate>${post.data.date.toUTCString()}</pubDate>`,
        `      <guid>${escapeXml(postUrl)}</guid>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(baseUrl)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${currentLocale ?? 'en'}</language>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}

export const createAtomResponse = ({
  allPosts,
  blogConfig,
  site,
  currentLocale,
  i18n,
  isDev,
}: FeedParams): Response => {
  const baseUrl = site?.toString() ?? 'https://example.com'
  const { feedOptions, blogTitle, blogDescription, routeBasePath } = blogConfig
  const posts = filterPosts(
    allPosts,
    blogConfig.includeDraftsInDev,
    currentLocale,
    i18n,
    feedOptions.limit,
    isDev,
  )
  const title = feedOptions.title ?? blogTitle
  const feedUrl = i18n
    ? buildUrl(baseUrl, currentLocale ?? '', routeBasePath, 'atom.xml')
    : buildUrl(baseUrl, routeBasePath, 'atom.xml')

  const lastUpdated =
    posts.length > 0
      ? posts[0].data.date.toISOString()
      : new Date().toISOString()
  const subtitle = feedOptions.description ?? blogDescription

  const entries = posts
    .map((post) => {
      const postUrl = getPostUrl(
        post,
        routeBasePath,
        baseUrl,
        currentLocale,
        i18n,
      )
      return [
        '  <entry>',
        `    <title>${escapeXml(post.data.title)}</title>`,
        `    <link href="${escapeXml(postUrl)}"/>`,
        `    <id>${escapeXml(postUrl)}</id>`,
        `    <updated>${post.data.date.toISOString()}</updated>`,
        `    <summary>${escapeXml(post.data.description)}</summary>`,
        '  </entry>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${currentLocale ?? 'en'}">`,
    `  <title>${escapeXml(title)}</title>`,
    `  <link href="${escapeXml(baseUrl)}"/>`,
    `  <link href="${escapeXml(feedUrl)}" rel="self" type="application/atom+xml"/>`,
    `  <id>${escapeXml(baseUrl)}</id>`,
    `  <updated>${lastUpdated}</updated>`,
    ...(subtitle ? [`  <subtitle>${escapeXml(subtitle)}</subtitle>`] : []),
    entries,
    '</feed>',
  ].join('\n')

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  })
}

export const createJsonFeedResponse = ({
  allPosts,
  blogConfig,
  site,
  currentLocale,
  i18n,
  isDev,
}: FeedParams): Response => {
  const baseUrl = site?.toString() ?? 'https://example.com'
  const { feedOptions, blogTitle, blogDescription, routeBasePath } = blogConfig
  const posts = filterPosts(
    allPosts,
    blogConfig.includeDraftsInDev,
    currentLocale,
    i18n,
    feedOptions.limit,
    isDev,
  )
  const title = feedOptions.title ?? blogTitle
  const description = feedOptions.description ?? blogDescription
  const feedUrl = i18n
    ? buildUrl(baseUrl, currentLocale ?? '', routeBasePath, 'feed.json')
    : buildUrl(baseUrl, routeBasePath, 'feed.json')

  const items = posts.map((post) => {
    const postUrl = getPostUrl(
      post,
      routeBasePath,
      baseUrl,
      currentLocale,
      i18n,
    )
    return {
      id: postUrl,
      url: postUrl,
      title: post.data.title,
      summary: post.data.description,
      date_published: post.data.date.toISOString(),
      ...(post.data.tags?.length ? { tags: post.data.tags } : {}),
    }
  })

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title,
    home_page_url: baseUrl,
    feed_url: feedUrl,
    ...(description ? { description } : {}),
    language: currentLocale ?? 'en',
    items,
  }

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
  })
}
