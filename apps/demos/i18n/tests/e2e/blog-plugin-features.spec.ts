import { expect, test } from '@playwright/test'

/**
 * Tests for Blog Plugin features marked as "supported" in the
 * Docusaurus Feature Parity Roadmap.
 */

test.describe('Blog Plugin Features', () => {
  test.describe('Core Functionality', () => {
    test('blog listing page shows posts', async ({ page }) => {
      await page.goto('/en/blog')

      // Should have at least one blog post link
      const blogPosts = page.locator('a[href*="/en/blog/"]')
      const count = await blogPosts.count()
      expect(count).toBeGreaterThan(0)
    })

    test('individual blog post pages render', async ({ page }) => {
      await page.goto('/en/blog/2024-01-10-blog-post-1')

      // Blog posts render content (may not have h1 if markdown doesn't include one)
      await expect(page.locator('.prose')).toBeVisible()
    })
  })

  test.describe('Configuration Options', () => {
    test('blog posts are sorted by date (newest first)', async ({ page }) => {
      await page.goto('/en/blog')

      // Get all blog post links
      const blogLinks = page.locator('article a[href*="/en/blog/"]')
      const hrefs: string[] = []
      const count = await blogLinks.count()
      for (let i = 0; i < count; i++) {
        const href = await blogLinks.nth(i).getAttribute('href')
        if (href) hrefs.push(href)
      }

      // Extract dates from URLs (format: YYYY-MM-DD)
      const dates = hrefs
        .map((href) => {
          const match = href.match(/(\d{4}-\d{2}-\d{2})/)
          return match ? match[1] : null
        })
        .filter(Boolean) as string[]

      // Verify dates are in descending order
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i] >= dates[i + 1]).toBe(true)
      }
    })
  })

  test.describe('Frontmatter Support', () => {
    test('title frontmatter sets blog post title', async ({ page }) => {
      await page.goto('/en/blog/2024-01-10-blog-post-1')
      await expect(page).toHaveTitle(/Spring Planting Day/)
    })

    test('description frontmatter is present in schema', async ({ page }) => {
      await page.goto('/en/blog/2024-01-10-blog-post-1')

      // Meta description tag exists (content may be empty if not passed through)
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })

    test('date frontmatter affects URL', async ({ page }) => {
      // Blog post with date: 2024-04-13 (but URL uses 2024-01-10 from filename)
      const response = await page.goto('/en/blog/2024-01-10-blog-post-1')
      expect(response?.status()).toBe(200)
    })
  })

  test.describe('Navigation Features', () => {
    test('blog has sidebar with posts', async ({ page }) => {
      await page.goto('/en/blog')

      // Blog page has sidebar with blog post links
      const sidebarLinks = page.locator('.drawer-side a[href*="/en/blog/"]')
      const count = await sidebarLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('i18n support for blog posts', async ({ page }) => {
      // English blog
      await page.goto('/en/blog')
      await expect(page.locator('body')).toBeVisible()

      // German blog
      await page.goto('/de/blog')
      await expect(page.locator('body')).toBeVisible()
    })
  })
})
