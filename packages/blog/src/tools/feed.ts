export type FeedType = 'rss' | 'atom' | 'json'

export interface FeedItem {
  title: string
  description: string
  link: string
  pubDate: Date
  author?: string
  content?: string
  categories?: string[]
}

export interface FeedConfig {
  title: string
  description: string
  siteUrl: string
  feedUrl: string
  language?: string
  copyright?: string
  generator?: string
  items: FeedItem[]
}

/**
 * Escapes XML special characters
 */
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Escapes content for CDATA sections.
 * The sequence "]]>" must be escaped to prevent premature CDATA termination.
 */
const escapeCData = (text: string): string => {
  // Replace "]]>" with "]]]]><![CDATA[>" to properly escape the CDATA closing sequence
  return text.replace(/\]\]>/g, ']]]]><![CDATA[>')
}

/**
 * Formats a date for RSS (RFC 822 format)
 */
const formatRssDate = (date: Date): string => {
  return date.toUTCString()
}

/**
 * Formats a date for Atom (RFC 3339 format)
 */
const formatAtomDate = (date: Date): string => {
  return date.toISOString()
}

/**
 * Generates an RSS 2.0 feed
 */
export const generateRssFeed = (config: FeedConfig): string => {
  const { title, description, siteUrl, feedUrl, language, copyright, items } =
    config

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatRssDate(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      ${item.author ? `<author>${escapeXml(item.author)}</author>` : ''}
      ${item.content ? `<content:encoded><![CDATA[${escapeCData(item.content)}]]></content:encoded>` : ''}
      ${item.categories?.map((cat) => `<category>${escapeXml(cat)}</category>`).join('\n      ') ?? ''}
    </item>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    ${language ? `<language>${escapeXml(language)}</language>` : ''}
    ${copyright ? `<copyright>${escapeXml(copyright)}</copyright>` : ''}
    <lastBuildDate>${formatRssDate(new Date())}</lastBuildDate>
    <generator>Shipyard</generator>
    ${itemsXml}
  </channel>
</rss>`
}

/**
 * Generates an Atom feed
 */
export const generateAtomFeed = (config: FeedConfig): string => {
  const { title, description, siteUrl, feedUrl, items } = config

  const entriesXml = items
    .map(
      (item) => `
  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${escapeXml(item.link)}"/>
    <id>${escapeXml(item.link)}</id>
    <updated>${formatAtomDate(item.pubDate)}</updated>
    <summary>${escapeXml(item.description)}</summary>
    ${item.content ? `<content type="html"><![CDATA[${escapeCData(item.content)}]]></content>` : ''}
    ${item.author ? `<author><name>${escapeXml(item.author)}</name></author>` : ''}
    ${item.categories?.map((cat) => `<category term="${escapeXml(cat)}"/>`).join('\n    ') ?? ''}
  </entry>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${escapeXml(siteUrl)}"/>
  <link href="${escapeXml(feedUrl)}" rel="self"/>
  <id>${escapeXml(siteUrl)}</id>
  <updated>${formatAtomDate(new Date())}</updated>
  <subtitle>${escapeXml(description)}</subtitle>
  <generator>Shipyard</generator>
  ${entriesXml}
</feed>`
}

/**
 * Generates a JSON Feed
 */
export const generateJsonFeed = (config: FeedConfig): string => {
  const { title, description, siteUrl, feedUrl, items } = config

  const feedItems = items.map((item) => ({
    id: item.link,
    url: item.link,
    title: item.title,
    summary: item.description,
    content_html: item.content,
    date_published: item.pubDate.toISOString(),
    authors: item.author ? [{ name: item.author }] : undefined,
    tags: item.categories,
  }))

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title,
    home_page_url: siteUrl,
    feed_url: feedUrl,
    description,
    items: feedItems,
  }

  return JSON.stringify(feed, null, 2)
}

/**
 * Generates a feed in the specified format
 */
export const generateFeed = (
  type: FeedType,
  config: FeedConfig,
): { content: string; contentType: string } => {
  switch (type) {
    case 'rss':
      return {
        content: generateRssFeed(config),
        contentType: 'application/rss+xml; charset=utf-8',
      }
    case 'atom':
      return {
        content: generateAtomFeed(config),
        contentType: 'application/atom+xml; charset=utf-8',
      }
    case 'json':
      return {
        content: generateJsonFeed(config),
        contentType: 'application/feed+json; charset=utf-8',
      }
  }
}
