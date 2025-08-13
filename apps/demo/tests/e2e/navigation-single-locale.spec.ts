import { expect, test } from '@playwright/test'

test.describe('Single Locale Navigation Tests', () => {
  test.skip(() => {
    // Skip this test for now since it would require a separate single-locale demo app
    // This test is intended to verify that navigation works correctly when only one locale is configured
    return true
  })

  test('single locale app has correct navigation links', async ({ page }) => {
    // This test would verify that a single locale app (like the docs app)
    // correctly handles navigation links with locale prefixes when prefixDefaultLocale: true
    //
    // For now, this is manually verified by testing the docs app:
    // - Visit localhost:4321/en (docs app)
    // - Navigation links should have /en/ prefix: /en/docs, /en/blog, /en/about
    // - Links should work without 404 errors
    //
    // To properly test this, we would need:
    // 1. A separate single-locale demo app configuration
    // 2. Or a way to run tests against the docs app
    // 3. Tests to verify both prefixDefaultLocale: true and false scenarios

    // Placeholder test content that would run against a single-locale app:
    /*
    await page.goto('/en')

    // Check that navigation links have locale prefix even with single locale
    const docsLink = page.locator('.navbar a[href="/en/docs"]')
    const blogLink = page.locator('.navbar a[href="/en/blog"]')
    const aboutLink = page.locator('.navbar a[href="/en/about"]')

    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()

    // Test that clicking works without 404
    await docsLink.click()
    await expect(page).toHaveURL('/en/docs')
    */
  })
})
