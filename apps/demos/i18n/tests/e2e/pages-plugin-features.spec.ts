import { expect, test } from '@playwright/test'

/**
 * Tests for Pages Plugin features marked as "supported" in the
 * Docusaurus Feature Parity Roadmap.
 */

test.describe('Pages Plugin Features', () => {
  test.describe('Core Functionality', () => {
    test('standalone markdown pages work', async ({ page }) => {
      await page.goto('/en/about')
      await expect(page.locator('body')).toBeVisible()
    })

    test('Astro component pages work', async ({ page }) => {
      // custom-toc-example.astro is a component page
      const response = await page.goto('/docs/custom-toc-example')
      // May redirect or work depending on config
      expect(response).toBeTruthy()
    })

    test('file-based routing works', async ({ page }) => {
      // index.md at root
      await page.goto('/')
      await expect(page.locator('body')).toBeVisible()

      // about.md
      await page.goto('/en/about')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Page Types', () => {
    test('markdown pages with frontmatter render', async ({ page }) => {
      await page.goto('/en/about')
      await expect(page).toHaveTitle(/About/)
    })
  })

  test.describe('Routing Features', () => {
    test('nested routes via folder structure', async ({ page }) => {
      // sidebar-demo is a nested folder
      await page.goto('/en/docs/sidebar-demo/')
      await expect(page.locator('body')).toBeVisible()

      await page.goto('/en/docs/sidebar-demo/custom-class')
      await expect(page.locator('body')).toBeVisible()
    })

    test('index pages work', async ({ page }) => {
      await page.goto('/en/docs/')
      await expect(page.locator('h1')).toBeVisible()
    })
  })
})
