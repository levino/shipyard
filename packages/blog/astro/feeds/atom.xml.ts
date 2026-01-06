/**
 * Atom feed generator for blog posts.
 */

import { i18n } from 'astro:config/server'
import { type CollectionEntry, getCollection } from 'astro:content'
import blogConfig from 'virtual:shipyard-blog/config'
import type { APIRoute, GetStaticPaths } from 'astro'
import { filter, pipe, reverse, sortBy, take } from 'ramda'

const {
  feedOptions,
  includeDraftsInDev,
  blogTitle,
  blogDescription,
  routeBasePath,
} = blogConfig
const {
  atom,
  limit,
  title: feedTitle,
  description: feedDescription,
} = feedOptions

// Filter out draft and unlisted posts
const isDev = import.meta.env.DEV
const shouldIncludePost = (post: CollectionEntry<'blog'>) => {
  if (post.data.unlisted) return false
  if (post.data.draft && !(isDev && includeDraftsInDev)) return false
  return true
}

export const getStaticPaths = (() => {
  if (!atom) {
    return []
  }

  if (i18n) {
    return i18n.locales.map((locale) => {
      if (typeof locale !== 'string') {
        throw new Error('shipyard does only support strings as locales.')
      }
      return { params: { locale } }
    })
  } else {
    return [{ params: {} }]
  }
}) satisfies GetStaticPaths

const escapeXml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const GET: APIRoute = async ({ site, currentLocale }) => {
  if (!atom) {
    return new Response('Atom feed is disabled', { status: 404 })
  }

  const baseUrl = site?.toString() ?? 'https://example.com'
  const allPosts = await getCollection('blog')

  // Filter and sort posts
  const posts = pipe(
    filter(shouldIncludePost),
    filter((post: CollectionEntry<'blog'>) => {
      if (i18n) {
        const [postLocale] = post.id.split('/')
        return postLocale === currentLocale
      }
      return true
    }),
    sortBy((post: CollectionEntry<'blog'>) => post.data.date.getTime()),
    reverse,
    take(limit),
  )(allPosts) as CollectionEntry<'blog'>[]

  const getBlogPostUrl = (post: CollectionEntry<'blog'>): string => {
    if (i18n && currentLocale) {
      const slug = post.id.replace(`${currentLocale}/`, '')
      return `${baseUrl}${currentLocale}/${routeBasePath}/${slug}`
    }
    return `${baseUrl}${routeBasePath}/${post.id}`
  }

  const title = feedTitle ?? blogTitle
  const subtitle = feedDescription ?? blogDescription
  const feedUrl = i18n
    ? `${baseUrl}${currentLocale}/${routeBasePath}/atom.xml`
    : `${baseUrl}${routeBasePath}/atom.xml`

  // Get the most recent update time
  const lastUpdated =
    posts.length > 0
      ? posts[0].data.date.toISOString()
      : new Date().toISOString()

  const entries = posts.map((post) => {
    const postUrl = getBlogPostUrl(post)
    const updated = post.data.date.toISOString()

    return `  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${escapeXml(postUrl)}"/>
    <id>${escapeXml(postUrl)}</id>
    <updated>${updated}</updated>
    <summary>${escapeXml(post.data.description)}</summary>
  </entry>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${currentLocale ?? 'en'}">
  <title>${escapeXml(title)}</title>
  <link href="${escapeXml(baseUrl)}"/>
  <link href="${escapeXml(feedUrl)}" rel="self" type="application/atom+xml"/>
  <id>${escapeXml(baseUrl)}</id>
  <updated>${lastUpdated}</updated>
  ${subtitle ? `<subtitle>${escapeXml(subtitle)}</subtitle>` : ''}
${entries.join('\n')}
</feed>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  })
}
