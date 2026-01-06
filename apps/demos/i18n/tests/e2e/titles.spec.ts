import { expect, test } from '@playwright/test'

test.describe('Page Title Integration Tests', () => {
  test('about page shows site title with page title', async ({ page }) => {
    await page.goto('/en/about')
    await expect(page).toHaveTitle('Metro Gardens - About Metro Gardens')
  })

  test('blog index shows site title with Blog', async ({ page }) => {
    await page.goto('/en/blog')
    await expect(page).toHaveTitle('Metro Gardens - Blog')
  })

  test('blog post shows site title with post title', async ({ page }) => {
    await page.goto('/en/blog/2023-10-30-week-200')
    await expect(page).toHaveTitle(
      'Metro Gardens - Weekly Harvest Report - Week 200',
    )
  })

  test('page with defined title shows site title with page title', async ({
    page,
  }) => {
    await page.goto('/')
    // The index page has title: "Metro Gardens Community Club" in frontmatter
    await expect(page).toHaveTitle(
      'Metro Gardens - Metro Gardens Community Club',
    )
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

    // Check that blog post link works (first post on the page)
    const firstPostLink = page.locator('[data-testid="blog-post-link"]').first()
    await firstPostLink.click()
    await expect(page).toHaveURL(/\/en\/blog\/\d{4}-\d{2}-\d{2}/)
  })
})
