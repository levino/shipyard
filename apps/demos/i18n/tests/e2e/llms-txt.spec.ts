import { expect, test } from '@playwright/test'

/**
 * Tests for llms.txt generation feature.
 * Verifies that llms.txt and llms-full.txt files are generated correctly
 * following the specification at https://llmstxt.org/
 *
 * The llms.txt files are mounted under the docs path (e.g., /docs/llms.txt)
 * and only include content from the default locale (English).
 */

test.describe('LLMs.txt Generation', () => {
  test.describe('llms.txt endpoint', () => {
    test('returns llms.txt with correct content type', async ({ request }) => {
      const response = await request.get('/docs/llms.txt')
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('text/plain')
    })

    test('llms.txt contains project name as H1 heading', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      expect(content).toContain('# Metro Gardens')
    })

    test('llms.txt contains summary as blockquote', async ({ request }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      expect(content).toContain('> Metro Gardens is a community garden')
    })

    test('llms.txt contains documentation section', async ({ request }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      expect(content).toContain('## Documentation')
    })

    test('llms.txt contains links to plain text files', async ({ request }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      // Check for markdown link format - links should point to _llms-txt/*.txt files
      expect(content).toMatch(
        /\[.+\]\(https?:\/\/.+\/docs\/_llms-txt\/.+\.txt\)/,
      )
    })

    test('llms.txt links include page descriptions when available', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      // Links should have format: - [Title](URL): Description
      // or just: - [Title](URL) if no description
      expect(content).toMatch(/- \[.+\]\(https?:\/\/.+\)/)
    })

    test('llms.txt links point to _llms-txt directory (locale-independent)', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      // Links should point to plain text files, not HTML pages with locale prefixes
      expect(content).toMatch(/\/docs\/_llms-txt\//)
      expect(content).toMatch(/\.txt\)/)

      // Should NOT contain locale prefixes in paths (they link to .txt files now)
      expect(content).not.toMatch(/\/en\/docs\/[^_]/)
      expect(content).not.toMatch(/\/de\/docs\//)
    })
  })

  test.describe('llms-full.txt endpoint', () => {
    test('returns llms-full.txt with correct content type', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms-full.txt')
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('text/plain')
    })

    test('llms-full.txt contains project name as H1 heading', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms-full.txt')
      const content = await response.text()

      expect(content).toContain('# Metro Gardens')
    })

    test('llms-full.txt contains summary as blockquote', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms-full.txt')
      const content = await response.text()

      expect(content).toContain('> Metro Gardens is a community garden')
    })

    test('llms-full.txt contains full page content', async ({ request }) => {
      const response = await request.get('/docs/llms-full.txt')
      const content = await response.text()

      // Should contain actual documentation content, not just links
      // Check for section separators and URL labels
      expect(content).toContain('---')
      expect(content).toContain('URL:')
    })

    test('llms-full.txt includes H2 headings for each document', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms-full.txt')
      const content = await response.text()

      // Each document should have its title as H2
      const h2Matches = content.match(/^## .+$/gm)
      expect(h2Matches).not.toBeNull()
      expect(h2Matches?.length).toBeGreaterThan(1)
    })

    test('llms-full.txt links point to _llms-txt directory (locale-independent)', async ({
      request,
    }) => {
      const response = await request.get('/docs/llms-full.txt')
      const content = await response.text()

      // Links should point to plain text files
      expect(content).toMatch(/\/docs\/_llms-txt\//)
      expect(content).toMatch(/\.txt/)

      // Should NOT contain locale prefixes in URL paths
      expect(content).not.toMatch(/\/en\/docs\/[^_]/)
      expect(content).not.toMatch(/\/de\/docs\//)
    })
  })

  test.describe('llms.txt format compliance', () => {
    test('llms.txt follows markdown format', async ({ request }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()
      const lines = content.split('\n')

      // First non-empty line should be H1
      const firstContentLine = lines.find((line) => line.trim().length > 0)
      expect(firstContentLine).toMatch(/^# .+/)
    })

    test('llms.txt uses absolute URLs for links', async ({ request }) => {
      const response = await request.get('/docs/llms.txt')
      const content = await response.text()

      // All links should be absolute URLs
      const linkMatches = content.match(/\]\(([^)]+)\)/g) || []
      for (const match of linkMatches) {
        const url = match.slice(2, -1)
        expect(url).toMatch(/^https?:\/\//)
      }
    })
  })

  test.describe('individual plain text endpoints', () => {
    test('individual txt files return correct content type', async ({
      request,
    }) => {
      // First get the llms.txt to find a valid path
      const llmsResponse = await request.get('/docs/llms.txt')
      const content = await llmsResponse.text()

      // Extract a txt file path from the links
      const match = content.match(/\/docs\/_llms-txt\/([^.]+)\.txt/)
      expect(match).not.toBeNull()

      const txtPath = `/docs/_llms-txt/${match?.[1]}.txt`
      const response = await request.get(txtPath)

      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('text/plain')
    })

    test('individual txt files contain markdown content', async ({
      request,
    }) => {
      const llmsResponse = await request.get('/docs/llms.txt')
      const content = await llmsResponse.text()

      const match = content.match(/\/docs\/_llms-txt\/([^.]+)\.txt/)
      expect(match).not.toBeNull()

      const txtPath = `/docs/_llms-txt/${match?.[1]}.txt`
      const response = await request.get(txtPath)
      const txtContent = await response.text()

      // Should start with a markdown heading
      expect(txtContent).toMatch(/^# .+/)
    })
  })

  test.describe('sidebar integration', () => {
    test('llms.txt link appears in sidebar with copy button', async ({
      page,
    }) => {
      await page.goto('/en/docs/')

      // Check that llms.txt link is in the sidebar
      const llmsTxtLink = page.locator(
        '[data-testid="sidebar-local-nav"] a[href="/docs/llms.txt"]',
      )
      await expect(llmsTxtLink).toBeVisible()

      // Check that copy button exists next to the link
      const copyButton = page.locator(
        '[data-testid="sidebar-local-nav"] button[data-copy-url="/docs/llms.txt"]',
      )
      await expect(copyButton).toBeVisible()
    })
  })
})
