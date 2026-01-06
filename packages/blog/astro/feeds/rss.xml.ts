/**
 * RSS 2.0 feed generator for blog posts.
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
  rss,
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
  if (!rss) {
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
  if (!rss) {
    return new Response('RSS feed is disabled', { status: 404 })
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
  const description = feedDescription ?? blogDescription ?? `${title} RSS Feed`
  const feedUrl = i18n
    ? `${baseUrl}${currentLocale}/${routeBasePath}/rss.xml`
    : `${baseUrl}${routeBasePath}/rss.xml`

  const items = posts.map((post) => {
    const postUrl = getBlogPostUrl(post)
    const pubDate = post.data.date.toUTCString()

    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${escapeXml(postUrl)}</guid>
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>${currentLocale ?? 'en'}</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
