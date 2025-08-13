import { expect, test } from '@playwright/test'

test.describe('Single Locale Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the single-locale app home page
    await page.goto('/en')
  })

  test('navigation links have correct locale prefix', async ({ page }) => {
    // Check that navigation links have locale prefix even with single locale
    const docsLink = page.locator('.navbar a[href="/en/docs"]')
    const blogLink = page.locator('.navbar a[href="/en/blog"]') 
    const aboutLink = page.locator('.navbar a[href="/en/about"]')

    await expect(docsLink).toBeVisible()
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()
  })

  test('clicking navigation links works without 404', async ({ page }) => {
    // Test docs link
    const docsLink = page.locator('.navbar a[href="/en/docs"]')
    await docsLink.click()
    await expect(page).toHaveURL('/en/docs')
    await expect(page.locator('h1')).toContainText('Documentation')

    // Test blog link
    await page.goto('/en')
    const blogLink = page.locator('.navbar a[href="/en/blog"]')
    await blogLink.click()
    await expect(page).toHaveURL('/en/blog')
    await expect(page.locator('h1')).toContainText('Blog')

    // Test about link  
    await page.goto('/en')
    const aboutLink = page.locator('.navbar a[href="/en/about"]')
    await aboutLink.click()
    await expect(page).toHaveURL('/en/about')
    await expect(page.locator('h1')).toContainText('About')
  })

  test('navigation preserves locale when moving between pages', async ({ page }) => {
    // Start on home page
    await expect(page).toHaveURL('/en')
    
    // Navigate to docs
    await page.locator('.navbar a[href="/en/docs"]').click()
    await expect(page).toHaveURL('/en/docs')
    
    // Check that navigation links still have correct locale prefix
    const blogLink = page.locator('.navbar a[href="/en/blog"]')
    const aboutLink = page.locator('.navbar a[href="/en/about"]')
    
    await expect(blogLink).toBeVisible()
    await expect(aboutLink).toBeVisible()
    
    // Navigate to blog and verify locale is preserved
    await blogLink.click()
    await expect(page).toHaveURL('/en/blog')
  })
})