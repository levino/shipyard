import { expect, test } from '@playwright/test'

test.describe('Navigation Locale Prefix Tests', () => {
  test('navigation links include locale prefix on German blog index page', async ({ page }) => {
    await page.goto('/de/blog')

    // Check that the blog page loads correctly
    await expect(page.locator('body')).toBeVisible()

    // Check navigation links in the top navigation menu
    const docsLink = page.locator(
      'nav a[href="/de/docs"], .navbar a[href="/de/docs"]',
    )
    const blogLink = page.locator(
      'nav a[href="/de/blog"], .navbar a[href="/de/blog"]',
    )
    const aboutLink = page.locator(
      'nav a[href="/de/about"], .navbar a[href="/de/about"]',
    )

    // Wait for navigation to be visible
    await expect(page.locator('.navbar')).toBeVisible()

    // Verify that navigation links have the correct locale prefix
    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()

    // Test that clicking docs link works correctly
    await docsLink.click()
    await expect(page).toHaveURL('/de/docs')
  })

  test('navigation links include locale prefix on English blog index page', async ({ page }) => {
    await page.goto('/en/blog')

    // Check that the blog page loads correctly
    await expect(page.locator('body')).toBeVisible()

    // Check navigation links in the top navigation menu
    const docsLink = page.locator(
      'nav a[href="/en/docs"], .navbar a[href="/en/docs"]',
    )
    const blogLink = page.locator(
      'nav a[href="/en/blog"], .navbar a[href="/en/blog"]',
    )
    const aboutLink = page.locator(
      'nav a[href="/en/about"], .navbar a[href="/en/about"]',
    )

    // Wait for navigation to be visible
    await expect(page.locator('.navbar')).toBeVisible()

    // Verify that navigation links have the correct locale prefix
    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()

    // Test that clicking about link works correctly
    await aboutLink.click()
    await expect(page).toHaveURL('/en/about')
  })

  test('navigation links work correctly on German blog post page', async ({ page }) => {
    await page.goto('/de/blog/2024-01-10-erster-blog-post')

    // Check that the blog post loads correctly
    await expect(page.locator('body')).toBeVisible()

    // Check navigation links in the top navigation menu
    const docsLink = page.locator(
      'nav a[href="/de/docs"], .navbar a[href="/de/docs"]',
    )
    const blogLink = page.locator(
      'nav a[href="/de/blog"], .navbar a[href="/de/blog"]',
    )
    const aboutLink = page.locator(
      'nav a[href="/de/about"], .navbar a[href="/de/about"]',
    )

    // Wait for navigation to be visible
    await expect(page.locator('.navbar')).toBeVisible()

    // Verify that navigation links have the correct locale prefix
    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()

    // Test that clicking blog link works correctly and goes back to blog index
    await blogLink.click()
    await expect(page).toHaveURL('/de/blog')
  })

  test('navigation links work correctly on English blog post page', async ({ page }) => {
    await page.goto('/en/blog/2024-01-10-blog-post-1')

    // Check that the blog post loads correctly
    await expect(page.locator('body')).toBeVisible()

    // Check navigation links in the top navigation menu
    const docsLink = page.locator(
      'nav a[href="/en/docs"], .navbar a[href="/en/docs"]',
    )
    const blogLink = page.locator(
      'nav a[href="/en/blog"], .navbar a[href="/en/blog"]',
    )
    const aboutLink = page.locator(
      'nav a[href="/en/about"], .navbar a[href="/en/about"]',
    )

    // Wait for navigation to be visible
    await expect(page.locator('.navbar')).toBeVisible()

    // Verify that navigation links have the correct locale prefix
    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()

    // Test navigation functionality
    await docsLink.click()
    await expect(page).toHaveURL('/en/docs')
  })

  test('brand link works correctly with locale prefix', async ({ page }) => {
    await page.goto('/de/blog')

    // Check that the blog page loads correctly
    await expect(page.locator('body')).toBeVisible()

    // Find the brand link (should go to home page with locale prefix)
    const brandLink = page.locator('.navbar a[href="/de"], .navbar a[href="/"]')
      .first()

    // Test that brand link exists
    await expect(brandLink).toBeVisible()
  })
})
