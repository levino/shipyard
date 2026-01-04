import { describe, expect, it } from 'vitest'
import {
  type FeedConfig,
  generateAtomFeed,
  generateFeed,
  generateJsonFeed,
  generateRssFeed,
} from './feed'

const mockConfig: FeedConfig = {
  title: 'Test Blog',
  description: 'A test blog for testing feeds',
  siteUrl: 'https://example.com',
  feedUrl: 'https://example.com/feed.xml',
  items: [
    {
      title: 'First Post',
      description: 'Description of first post',
      link: 'https://example.com/blog/first-post',
      pubDate: new Date('2024-01-15T10:00:00Z'),
      author: 'John Doe',
      categories: ['javascript', 'tutorial'],
    },
    {
      title: 'Second Post',
      description: 'Description of second post',
      link: 'https://example.com/blog/second-post',
      pubDate: new Date('2024-01-20T10:00:00Z'),
    },
  ],
}

describe('generateRssFeed', () => {
  it('generates valid RSS XML', () => {
    const rss = generateRssFeed(mockConfig)

    expect(rss).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(rss).toContain('<rss version="2.0"')
    expect(rss).toContain('<channel>')
    expect(rss).toContain('<title>Test Blog</title>')
    expect(rss).toContain(
      '<description>A test blog for testing feeds</description>',
    )
  })

  it('includes items', () => {
    const rss = generateRssFeed(mockConfig)

    expect(rss).toContain('<item>')
    expect(rss).toContain('<title>First Post</title>')
    expect(rss).toContain('<title>Second Post</title>')
  })

  it('includes author when present', () => {
    const rss = generateRssFeed(mockConfig)

    expect(rss).toContain('<author>John Doe</author>')
  })

  it('includes categories', () => {
    const rss = generateRssFeed(mockConfig)

    expect(rss).toContain('<category>javascript</category>')
    expect(rss).toContain('<category>tutorial</category>')
  })

  it('escapes XML special characters', () => {
    const config: FeedConfig = {
      ...mockConfig,
      title: 'Blog & News <test>',
      items: [
        {
          title: 'Post with "quotes"',
          description: "It's a test",
          link: 'https://example.com/post',
          pubDate: new Date(),
        },
      ],
    }

    const rss = generateRssFeed(config)

    expect(rss).toContain('Blog &amp; News &lt;test&gt;')
    expect(rss).toContain('Post with &quot;quotes&quot;')
    expect(rss).toContain('It&apos;s a test')
  })
})

describe('generateAtomFeed', () => {
  it('generates valid Atom XML', () => {
    const atom = generateAtomFeed(mockConfig)

    expect(atom).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(atom).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(atom).toContain('<title>Test Blog</title>')
  })

  it('includes entries', () => {
    const atom = generateAtomFeed(mockConfig)

    expect(atom).toContain('<entry>')
    expect(atom).toContain('<title>First Post</title>')
  })

  it('includes author when present', () => {
    const atom = generateAtomFeed(mockConfig)

    expect(atom).toContain('<author><name>John Doe</name></author>')
  })
})

describe('generateJsonFeed', () => {
  it('generates valid JSON feed', () => {
    const json = generateJsonFeed(mockConfig)
    const parsed = JSON.parse(json)

    expect(parsed.version).toBe('https://jsonfeed.org/version/1.1')
    expect(parsed.title).toBe('Test Blog')
    expect(parsed.description).toBe('A test blog for testing feeds')
  })

  it('includes items array', () => {
    const json = generateJsonFeed(mockConfig)
    const parsed = JSON.parse(json)

    expect(parsed.items).toHaveLength(2)
    expect(parsed.items[0].title).toBe('First Post')
  })

  it('includes authors array when present', () => {
    const json = generateJsonFeed(mockConfig)
    const parsed = JSON.parse(json)

    expect(parsed.items[0].authors).toEqual([{ name: 'John Doe' }])
    expect(parsed.items[1].authors).toBeUndefined()
  })
})

describe('generateFeed', () => {
  it('generates RSS feed with correct content type', () => {
    const result = generateFeed('rss', mockConfig)

    expect(result.contentType).toBe('application/rss+xml; charset=utf-8')
    expect(result.content).toContain('<rss')
  })

  it('generates Atom feed with correct content type', () => {
    const result = generateFeed('atom', mockConfig)

    expect(result.contentType).toBe('application/atom+xml; charset=utf-8')
    expect(result.content).toContain('<feed')
  })

  it('generates JSON feed with correct content type', () => {
    const result = generateFeed('json', mockConfig)

    expect(result.contentType).toBe('application/feed+json; charset=utf-8')
    expect(() => JSON.parse(result.content)).not.toThrow()
  })
})
