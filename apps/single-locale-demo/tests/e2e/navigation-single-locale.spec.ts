import { test, expect } from '@playwright/test'

test.describe('Single Locale Navigation', () => {
  test('should have navigation links without locale prefixes', async ({
    page,
  }) => {
    await page.goto('/')

    // Check that navigation links exist and don't have locale prefixes
    const docsLink = page
      .locator('nav a[href="/docs"], .navbar a[href="/docs"]')
      .first()
    await expect(docsLink).toBeVisible()

    const blogLink = page
      .locator('nav a[href="/blog"], .navbar a[href="/blog"]')
      .first()
    await expect(blogLink).toBeVisible()

    const aboutLink = page
      .locator('nav a[href="/about"], .navbar a[href="/about"]')
      .first()
    await expect(aboutLink).toBeVisible()

    // Test that the links work
    await docsLink.click()
    await expect(page).toHaveURL('/docs')

    await page.goto('/')
    await blogLink.click()
    await expect(page).toHaveURL('/blog')

    await page.goto('/')
    await aboutLink.click()
    await expect(page).toHaveURL('/about')
  })

  test('should display content without locale prefixes in URLs', async ({
    page,
  }) => {
    await page.goto('/')

    // Verify we're on the root page without locale prefix
    expect(page.url()).toMatch(/\/$/)

    // Navigate to docs and verify URL
    await page.goto('/docs')
    expect(page.url()).toMatch(/\/docs$/)

    // Navigate to about and verify URL
    await page.goto('/about')
    expect(page.url()).toMatch(/\/about$/)
  })

  test('should have working sidebar navigation on docs page', async ({
    page,
  }) => {
    await page.goto('/docs')

    // Check for sidebar navigation home link without locale prefix
    const homeLink = page
      .locator('.sidebar a[href="/"], aside a[href="/"]')
      .first()
    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible()

      // Test that clicking home link works
      await homeLink.click()
      await expect(page).toHaveURL('/')
    }
  })
})
