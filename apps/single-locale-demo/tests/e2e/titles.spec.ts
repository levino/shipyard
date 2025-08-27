import { expect, test } from '@playwright/test'

test.describe('Single Locale Page Title Tests', () => {
  test('about page shows site title only when no page title is defined', async ({
    page,
  }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle('Single Locale Demo')
  })

  test('blog index shows site title with Blog', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle('Single Locale Demo - Blog')
  })

  test('blog post shows site title with post title', async ({ page }) => {
    await page.goto('/blog/2024-01-10-blog-post-1')
    await expect(page).toHaveTitle('Single Locale Demo - First Blog Post')
  })

  test('docs page shows title from frontmatter', async ({ page }) => {
    await page.goto('/docs')
    await expect(page).toHaveTitle('Single Locale Demo - Documentation')
  })
})

test.describe('Basic Site Functionality', () => {
  test('navigation works correctly', async ({ page }) => {
    await page.goto('/')

    // Check that the site loads correctly
    await expect(page.locator('body')).toBeVisible()
  })

  test('blog navigation works', async ({ page }) => {
    await page.goto('/blog')

    // Check that blog page loads
    await expect(page.locator('body')).toBeVisible()

    // Check that blog post link works
    await page.click('a[href="/blog/2024-01-10-blog-post-1"]')
    await expect(page).toHaveURL('/blog/2024-01-10-blog-post-1')
  })
})
