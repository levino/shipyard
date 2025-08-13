import { expect, test } from '@playwright/test'

test.describe('Navigation Locale Prefix Regression Test', () => {
  test('German blog page has correct locale prefixes in navigation', async ({ page }) => {
    await page.goto('/de/blog')
    
    // Verify the page loads
    await expect(page.locator('body')).toBeVisible()
    
    // Check that navigation links have locale prefixes
    const docsLink = page.locator('.navbar a[href="/de/docs"]')
    const blogLink = page.locator('.navbar a[href="/de/blog"]')
    const aboutLink = page.locator('.navbar a[href="/de/about"]')
    
    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()
  })

  test('English blog page has correct locale prefixes in navigation', async ({ page }) => {
    await page.goto('/en/blog')
    
    // Verify the page loads
    await expect(page.locator('body')).toBeVisible()
    
    // Check that navigation links have locale prefixes
    const docsLink = page.locator('.navbar a[href="/en/docs"]')
    const blogLink = page.locator('.navbar a[href="/en/blog"]')
    const aboutLink = page.locator('.navbar a[href="/en/about"]')
    
    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()
  })
})