import { expect, test } from '@playwright/test'

/**
 * Tests for llms.txt generation feature.
 * Verifies that llms.txt and llms-full.txt files are generated correctly
 * following the specification at https://llmstxt.org/
 */

test.describe('LLMs.txt Generation', () => {
  test.describe('llms.txt endpoint', () => {
    test('returns llms.txt with correct content type', async ({ request }) => {
      const response = await request.get('/llms.txt')
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('text/plain')
    })

    test('llms.txt contains project name as H1 heading', async ({
      request,
    }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()

      expect(content).toContain('# Metro Gardens')
    })

    test('llms.txt contains summary as blockquote', async ({ request }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()

      expect(content).toContain('> Metro Gardens is a community garden')
    })

    test('llms.txt contains documentation section', async ({ request }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()

      expect(content).toContain('## Documentation')
    })

    test('llms.txt contains links to documentation pages', async ({
      request,
    }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()

      // Check for markdown link format
      expect(content).toMatch(/\[.+\]\(https?:\/\/.+\/docs\/.+\)/)
    })

    test('llms.txt links include page descriptions when available', async ({
      request,
    }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()

      // Links should have format: - [Title](URL): Description
      // or just: - [Title](URL) if no description
      expect(content).toMatch(/- \[.+\]\(https?:\/\/.+\)/)
    })
  })

  test.describe('llms-full.txt endpoint', () => {
    test('returns llms-full.txt with correct content type', async ({
      request,
    }) => {
      const response = await request.get('/llms-full.txt')
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('text/plain')
    })

    test('llms-full.txt contains project name as H1 heading', async ({
      request,
    }) => {
      const response = await request.get('/llms-full.txt')
      const content = await response.text()

      expect(content).toContain('# Metro Gardens')
    })

    test('llms-full.txt contains summary as blockquote', async ({
      request,
    }) => {
      const response = await request.get('/llms-full.txt')
      const content = await response.text()

      expect(content).toContain('> Metro Gardens is a community garden')
    })

    test('llms-full.txt contains full page content', async ({ request }) => {
      const response = await request.get('/llms-full.txt')
      const content = await response.text()

      // Should contain actual documentation content, not just links
      // Check for section separators and URL labels
      expect(content).toContain('---')
      expect(content).toContain('URL:')
    })

    test('llms-full.txt includes H2 headings for each document', async ({
      request,
    }) => {
      const response = await request.get('/llms-full.txt')
      const content = await response.text()

      // Each document should have its title as H2
      const h2Matches = content.match(/^## .+$/gm)
      expect(h2Matches).not.toBeNull()
      expect(h2Matches?.length).toBeGreaterThan(1)
    })
  })

  test.describe('llms.txt format compliance', () => {
    test('llms.txt follows markdown format', async ({ request }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()
      const lines = content.split('\n')

      // First non-empty line should be H1
      const firstContentLine = lines.find((line) => line.trim().length > 0)
      expect(firstContentLine).toMatch(/^# .+/)
    })

    test('llms.txt uses absolute URLs for links', async ({ request }) => {
      const response = await request.get('/llms.txt')
      const content = await response.text()

      // All links should be absolute URLs
      const linkMatches = content.match(/\]\(([^)]+)\)/g) || []
      for (const match of linkMatches) {
        const url = match.slice(2, -1)
        expect(url).toMatch(/^https?:\/\//)
      }
    })
  })
})
