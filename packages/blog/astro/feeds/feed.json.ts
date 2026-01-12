/**
 * JSON Feed generator for blog posts.
 * Follows the JSON Feed specification: https://jsonfeed.org/
 */

import { i18n } from 'astro:config/server'
import { type CollectionEntry, getCollection } from 'astro:content'
import blogConfig from 'virtual:shipyard-blog/config'
import type { APIRoute, GetStaticPaths } from 'astro'
import { filter, map, pipe, reverse, sortBy, take } from 'ramda'

export const prerender = true

const {
  feedOptions,
  includeDraftsInDev,
  blogTitle,
  blogDescription,
  routeBasePath,
} = blogConfig
const {
  json,
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
  if (!json) {
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

interface JsonFeedItem {
  id: string
  url: string
  title: string
  content_text?: string
  summary?: string
  date_published: string
  tags?: string[]
}

interface JsonFeed {
  version: string
  title: string
  home_page_url: string
  feed_url: string
  description?: string
  language?: string
  items: JsonFeedItem[]
}

export const GET: APIRoute = async ({ site, currentLocale }) => {
  if (!json) {
    return new Response('JSON feed is disabled', { status: 404 })
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
  const description = feedDescription ?? blogDescription
  const feedUrl = i18n
    ? `${baseUrl}${currentLocale}/${routeBasePath}/feed.json`
    : `${baseUrl}${routeBasePath}/feed.json`

  const items: JsonFeedItem[] = pipe(
    map((post: CollectionEntry<'blog'>): JsonFeedItem => {
      const postUrl = getBlogPostUrl(post)

      return {
        id: postUrl,
        url: postUrl,
        title: post.data.title,
        summary: post.data.description,
        date_published: post.data.date.toISOString(),
        ...(post.data.tags && post.data.tags.length > 0
          ? { tags: post.data.tags }
          : {}),
      }
    }),
  )(posts) as JsonFeedItem[]

  const feed: JsonFeed = {
    version: 'https://jsonfeed.org/version/1.1',
    title,
    home_page_url: baseUrl,
    feed_url: feedUrl,
    ...(description ? { description } : {}),
    language: currentLocale ?? 'en',
    items,
  }

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
    },
  })
}
