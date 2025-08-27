import { expect, test } from '@playwright/test'

test.describe('Page Title Integration Tests', () => {
  test('about page shows site title only when no page title is defined', async ({
    page,
  }) => {
    await page.goto('/en/about')
    await expect(page).toHaveTitle('Shipyard Demo')
  })

  test('blog index shows site title with Blog', async ({ page }) => {
    await page.goto('/en/blog')
    await expect(page).toHaveTitle('Shipyard Demo - Blog')
  })

  test('blog post shows site title with post title', async ({ page }) => {
    await page.goto('/en/blog/2024-01-10-blog-post-1')
    await expect(page).toHaveTitle('Shipyard Demo - First Blog Post')
  })

  test('page with defined title shows site title with page title', async ({
    page,
  }) => {
    await page.goto('/')
    // The index page has title: "Startseite" in frontmatter
    await expect(page).toHaveTitle('Shipyard Demo - Startseite')
  })
})

test.describe('Basic Site Functionality', () => {
  test('navigation works correctly', async ({ page }) => {
    await page.goto('/')

    // Check that the site loads correctly
    await expect(page.locator('body')).toBeVisible()
  })

  test('blog navigation works', async ({ page }) => {
    await page.goto('/en/blog')

    // Check that blog page loads
    await expect(page.locator('body')).toBeVisible()

    // Check that blog post link works
    await page.click('a[href="/en/blog/2024-01-10-blog-post-1"]')
    await expect(page).toHaveURL('/en/blog/2024-01-10-blog-post-1')
  })
})
