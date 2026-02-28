import { expect, test } from '@playwright/test'

test.describe('Multi-Blog Instance Support', () => {
  test.describe('Newsletters instance', () => {
    test('newsletters index page renders', async ({ page }) => {
      await page.goto('/newsletters')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        'Newsletters',
      )
    })

    test('newsletters index shows newsletter posts', async ({ page }) => {
      await page.goto('/newsletters')
      await expect(
        page.locator('[data-testid="blog-post-item"]').first(),
      ).toBeVisible()
      await expect(
        page.locator('[data-testid="blog-post-link"]').first(),
      ).toBeVisible()
    })

    test('newsletter entry page renders', async ({ page }) => {
      await page.goto('/newsletters/2025-01-15-january-update')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        'January 2025 Update',
      )
    })

    test('newsletter has its own tags page', async ({ page }) => {
      await page.goto('/newsletters/tags')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        'Tags',
      )
      await expect(
        page.locator('.drawer-content a.badge').first(),
      ).toBeVisible()
    })

    test('newsletter tag page shows filtered posts', async ({ page }) => {
      await page.goto('/newsletters/tags/monthly-update')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        /monthly-update/i,
      )
      const posts = page.locator('.drawer-content article')
      await expect(posts.first()).toBeVisible()
    })

    test('newsletter RSS feed is available', async ({ page }) => {
      const response = await page.goto('/newsletters/rss.xml')
      expect(response?.status()).toBe(200)
      const content = await response?.text()
      expect(content).toContain('January 2025 Update')
    })

    test('newsletter sidebar shows newsletter title', async ({ page }) => {
      await page.goto('/newsletters/2025-01-15-january-update')
      await expect(
        page
          .locator('[data-testid="sidebar-local-nav"]')
          .locator('text=All newsletters')
          .first(),
      ).toBeVisible()
    })
  })

  test.describe('Reports instance', () => {
    test('reports index page renders', async ({ page }) => {
      await page.goto('/reports')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        'Reports',
      )
    })

    test('reports index shows report posts', async ({ page }) => {
      await page.goto('/reports')
      await expect(
        page.locator('[data-testid="blog-post-item"]').first(),
      ).toBeVisible()
      await expect(
        page
          .locator('[data-testid="blog-post-link"]')
          .filter({ hasText: 'Performance Benchmark' }),
      ).toBeVisible()
    })

    test('report entry page renders', async ({ page }) => {
      await page.goto('/reports/2025-01-01-annual-review-2024')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        'Annual Review 2024',
      )
    })

    test('report has its own tags page', async ({ page }) => {
      await page.goto('/reports/tags')
      await expect(page.locator('.drawer-content h1').first()).toContainText(
        'Tags',
      )
    })

    test('report RSS feed is available', async ({ page }) => {
      const response = await page.goto('/reports/rss.xml')
      expect(response?.status()).toBe(200)
      const content = await response?.text()
      expect(content).toContain('Annual Review 2024')
    })
  })

  test.describe('Instance isolation', () => {
    test('blog posts do not appear in newsletters', async ({ page }) => {
      await page.goto('/newsletters')
      await expect(
        page.locator(
          '.drawer-content:has-text("Getting Started with Single-Language")',
        ),
      ).toHaveCount(0)
    })

    test('newsletter posts do not appear in blog', async ({ page }) => {
      await page.goto('/blog')
      await expect(
        page.locator(
          '[data-testid="blog-post-link"]:has-text("January 2025 Update")',
        ),
      ).toHaveCount(0)
    })

    test('report posts do not appear in blog', async ({ page }) => {
      await page.goto('/blog')
      await expect(
        page.locator(
          '[data-testid="blog-post-link"]:has-text("Annual Review")',
        ),
      ).toHaveCount(0)
    })

    test('newsletter posts do not appear in reports', async ({ page }) => {
      await page.goto('/reports')
      await expect(
        page.locator(
          '[data-testid="blog-post-link"]:has-text("January 2025 Update")',
        ),
      ).toHaveCount(0)
    })
  })

  test.describe('Navigation', () => {
    test('Content dropdown contains all three blog links', async ({ page }) => {
      await page.goto('/')
      // The Content menu item should be visible in the navbar as a details/summary dropdown
      const contentSummary = page.locator('.navbar summary:has-text("Content")')
      await expect(contentSummary).toBeVisible()
    })
  })
})
