import { expect, test } from '@playwright/test'

test.describe('Page Title Integration Tests', () => {
  test('index page shows site title with page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(
      'Server Mode Demo - Welcome to Server Mode Demo',
    )
  })

  test('about page shows site title with page title', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(
      'Server Mode Demo - About Single Language Demo',
    )
  })

  test('blog index shows site title with Blog', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveTitle('Server Mode Demo - Blog')
  })

  test('blog post shows site title with post title', async ({ page }) => {
    await page.goto('/blog/2024-09-01-getting-started')
    await expect(page).toHaveTitle(
      'Server Mode Demo - Getting Started with Single-Language Sites',
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
    await page.goto('/blog')

    // Check that blog page loads
    await expect(page.locator('body')).toBeVisible()

    // Check that blog post link works
    await page.click('a[href="/blog/2024-09-01-getting-started"]')
    await expect(page).toHaveURL('/blog/2024-09-01-getting-started')
  })

  test('docs navigation works', async ({ page }) => {
    await page.goto('/docs')

    // Check that docs page loads
    await expect(page.locator('body')).toBeVisible()
  })
})
