import { expect, test } from '@playwright/test'

test.describe('Navigation Locale Prefix Tests', () => {
  test('navigation links include locale prefix on German blog index page', async ({ page }) => {
    await page.goto('/de/blog')
    
    // Check that the page loads correctly
    await expect(page.locator('body')).toBeVisible()
    
    // Check that navigation links include the locale prefix
    const docsLink = page.locator('nav a[href="/de/docs"], .navbar a[href="/de/docs"]')
    await expect(docsLink).toBeVisible()
    
    const blogLink = page.locator('nav a[href="/de/blog"], .navbar a[href="/de/blog"]')
    await expect(blogLink).toBeVisible()
    
    const aboutLink = page.locator('nav a[href="/de/about"], .navbar a[href="/de/about"]')
    await expect(aboutLink).toBeVisible()
  })

  test('navigation links include locale prefix on English blog index page', async ({ page }) => {
    await page.goto('/en/blog')
    
    // Check that the page loads correctly
    await expect(page.locator('body')).toBeVisible()
    
    // Check that navigation links include the locale prefix
    const docsLink = page.locator('nav a[href="/en/docs"], .navbar a[href="/en/docs"]')
    await expect(docsLink).toBeVisible()
    
    const blogLink = page.locator('nav a[href="/en/blog"], .navbar a[href="/en/blog"]')
    await expect(blogLink).toBeVisible()
    
    const aboutLink = page.locator('nav a[href="/en/about"], .navbar a[href="/en/about"]')
    await expect(aboutLink).toBeVisible()
  })

  test('navigation links work correctly when clicked', async ({ page }) => {
    await page.goto('/de/blog')
    
    // Click on the about link and verify it navigates to the correct localized URL
    await page.click('.navbar a[href="/de/about"]')
    await expect(page).toHaveURL('/de/about')
  })
})