import { expect, test } from '@playwright/test'

test.describe('Page Title Integration Tests', () => {
  test('server health check', async ({ page }) => {
    await page.goto('/en/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('title')).toBeVisible()
  })

  test('about page shows site title only when no page title is defined', async ({ page }) => {
    await page.goto('/en/about')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle('Shipyard Demo')
  })

  test('blog index shows site title with Blog', async ({ page }) => {
    await page.goto('/en/blog')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle('Shipyard Demo - Blog')
  })

  test('blog post shows site title with post title', async ({ page }) => {
    await page.goto('/en/blog/2024-01-10-blog-post-1')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle('Shipyard Demo - First Blog Post')
  })

  test('page with defined title shows site title with page title', async ({ page }) => {
    await page.goto('/en/')
    await page.waitForLoadState('networkidle')
    // The index page has title: "Startseite" in frontmatter
    await expect(page).toHaveTitle('Shipyard Demo - Startseite')
  })
})

test.describe('Basic Site Functionality', () => {
  test('navigation works correctly', async ({ page }) => {
    await page.goto('/en/')
    await page.waitForLoadState('networkidle')

    // Check that the site loads correctly
    await expect(page.locator('body')).toBeVisible()
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })

  test('blog navigation works', async ({ page }) => {
    await page.goto('/en/blog')
    await page.waitForLoadState('networkidle')

    // Check that blog page loads
    await expect(page.locator('body')).toBeVisible()

    // Check that blog post link exists before clicking
    const blogLink = page.locator('a[href="/en/blog/2024-01-10-blog-post-1"]')
    await expect(blogLink).toBeVisible()

    // Click and navigate to blog post
    await blogLink.click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/en/blog/2024-01-10-blog-post-1')
  })
})
