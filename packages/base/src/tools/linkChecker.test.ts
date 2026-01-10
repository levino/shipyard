import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { AstroIntegrationLogger } from 'astro'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { LinkCheckResult } from './linkChecker'
import { checkLinks, reportBrokenLinks } from './linkChecker'

describe('checkLinks', () => {
  let testDir: string

  beforeEach(() => {
    testDir = join(tmpdir(), `linkchecker-test-${Date.now()}`)
    mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true })
  })

  test('finds no broken links when all links are valid', () => {
    // Create test HTML files
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="/about">About</a><a href="/docs">Docs</a>',
    )
    mkdirSync(join(testDir, 'about'), { recursive: true })
    writeFileSync(join(testDir, 'about', 'index.html'), '<a href="/">Home</a>')
    mkdirSync(join(testDir, 'docs'), { recursive: true })
    writeFileSync(join(testDir, 'docs', 'index.html'), '<a href="/">Home</a>')

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
    expect(result.brokenLinks).toEqual([])
    expect(result.totalLinks).toBe(4)
  })

  test('detects broken internal links', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="/non-existent">Broken</a>',
    )

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(1)
    expect(result.brokenLinks[0].href).toBe('/non-existent')
    expect(result.brokenLinks[0].sourceFile).toBe('index.html')
  })

  test('ignores external links', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="https://example.com">External</a><a href="http://test.com">HTTP</a>',
    )

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
    expect(result.totalLinks).toBe(0) // External links are not counted
  })

  test('ignores anchor links', () => {
    writeFileSync(join(testDir, 'index.html'), '<a href="#section">Anchor</a>')

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
    expect(result.totalLinks).toBe(0)
  })

  test('ignores special protocol links', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="mailto:test@example.com">Email</a><a href="tel:+1234567890">Phone</a><a href="javascript:void(0)">JS</a>',
    )

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
    expect(result.totalLinks).toBe(0)
  })

  test('handles links with trailing slashes', () => {
    writeFileSync(join(testDir, 'index.html'), '<a href="/about/">About</a>')
    mkdirSync(join(testDir, 'about'), { recursive: true })
    writeFileSync(join(testDir, 'about', 'index.html'), 'About page')

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
  })

  test('handles links without trailing slashes', () => {
    writeFileSync(join(testDir, 'index.html'), '<a href="/about">About</a>')
    mkdirSync(join(testDir, 'about'), { recursive: true })
    writeFileSync(join(testDir, 'about', 'index.html'), 'About page')

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
  })

  test('handles links to .html files', () => {
    writeFileSync(join(testDir, 'index.html'), '<a href="/page.html">Page</a>')
    writeFileSync(join(testDir, 'page.html'), 'Page content')

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
  })

  test('handles query strings and hash fragments', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="/about?foo=bar#section">About</a>',
    )
    mkdirSync(join(testDir, 'about'), { recursive: true })
    writeFileSync(join(testDir, 'about', 'index.html'), 'About page')

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
  })

  test('handles nested directories', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="/docs/getting-started">Docs</a>',
    )
    mkdirSync(join(testDir, 'docs', 'getting-started'), { recursive: true })
    writeFileSync(
      join(testDir, 'docs', 'getting-started', 'index.html'),
      'Getting Started',
    )

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(0)
  })

  test('detects multiple broken links', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      '<a href="/foo">Foo</a><a href="/bar">Bar</a><a href="/baz">Baz</a>',
    )

    const result = checkLinks(testDir)

    expect(result.brokenCount).toBe(3)
    expect(result.brokenLinks.map((l) => l.href).sort()).toEqual([
      '/bar',
      '/baz',
      '/foo',
    ])
  })

  test('provides correct line numbers', () => {
    writeFileSync(
      join(testDir, 'index.html'),
      'line 1\n<a href="/broken">Broken</a>\nline 3',
    )

    const result = checkLinks(testDir)

    expect(result.brokenLinks[0].line).toBe(2)
  })
})

describe('reportBrokenLinks', () => {
  const createMockLogger = () =>
    ({
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      label: 'test',
      options: {},
      fork: vi.fn(),
    }) as unknown as AstroIntegrationLogger & {
      info: ReturnType<typeof vi.fn>
      warn: ReturnType<typeof vi.fn>
    }

  test('logs success message when no broken links and action is not ignore', () => {
    const logger = createMockLogger()
    const result: LinkCheckResult = {
      totalLinks: 10,
      brokenCount: 0,
      brokenLinks: [],
    }

    reportBrokenLinks(result, 'warn', logger)

    expect(logger.info).toHaveBeenCalledWith(
      'Link check passed: 10 links verified',
    )
  })

  test('does nothing when action is ignore', () => {
    const logger = createMockLogger()
    const result: LinkCheckResult = {
      totalLinks: 10,
      brokenCount: 2,
      brokenLinks: [
        { sourceFile: 'index.html', href: '/broken', line: 1 },
        { sourceFile: 'about.html', href: '/missing', line: 5 },
      ],
    }

    reportBrokenLinks(result, 'ignore', logger)

    expect(logger.info).not.toHaveBeenCalled()
    expect(logger.warn).not.toHaveBeenCalled()
  })

  test('logs info when action is log', () => {
    const logger = createMockLogger()
    const result: LinkCheckResult = {
      totalLinks: 5,
      brokenCount: 1,
      brokenLinks: [{ sourceFile: 'index.html', href: '/broken', line: 1 }],
    }

    reportBrokenLinks(result, 'log', logger)

    expect(logger.info).toHaveBeenCalled()
    const message = logger.info.mock.calls[0][0]
    expect(message).toContain('Found 1 broken link')
    expect(message).toContain('/broken')
    expect(message).toContain('index.html:1')
  })

  test('logs warning when action is warn', () => {
    const logger = createMockLogger()
    const result: LinkCheckResult = {
      totalLinks: 5,
      brokenCount: 1,
      brokenLinks: [{ sourceFile: 'index.html', href: '/broken', line: 1 }],
    }

    reportBrokenLinks(result, 'warn', logger)

    expect(logger.warn).toHaveBeenCalled()
    const message = logger.warn.mock.calls[0][0]
    expect(message).toContain('Found 1 broken link')
  })

  test('throws error when action is throw', () => {
    const logger = createMockLogger()
    const result: LinkCheckResult = {
      totalLinks: 5,
      brokenCount: 1,
      brokenLinks: [{ sourceFile: 'index.html', href: '/broken', line: 1 }],
    }

    expect(() => reportBrokenLinks(result, 'throw', logger)).toThrow(
      'Broken links found',
    )
  })

  test('pluralizes correctly for multiple broken links', () => {
    const logger = createMockLogger()
    const result: LinkCheckResult = {
      totalLinks: 10,
      brokenCount: 3,
      brokenLinks: [
        { sourceFile: 'a.html', href: '/a' },
        { sourceFile: 'b.html', href: '/b' },
        { sourceFile: 'c.html', href: '/c' },
      ],
    }

    reportBrokenLinks(result, 'warn', logger)

    const message = logger.warn.mock.calls[0][0]
    expect(message).toContain('Found 3 broken links')
  })
})
