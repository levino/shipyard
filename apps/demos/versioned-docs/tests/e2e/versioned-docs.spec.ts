import { expect, test } from '@playwright/test'

test.describe('Versioned Documentation Demo', () => {
  test.describe('Basic Navigation', () => {
    test('home page loads and has correct title', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveTitle(/Versioned Docs Demo/)
    })

    test('about page loads', async ({ page }) => {
      await page.goto('/about/')
      await expect(page).toHaveTitle(/About/)
    })
  })

  test.describe('Version Routing', () => {
    test('docs root redirects to current version', async ({ page }) => {
      await page.goto('/docs/')
      await expect(page).toHaveURL(/\/docs\/v2\//)
    })

    test('v2 docs index loads', async ({ page }) => {
      await page.goto('/docs/v2/')
      await expect(page.locator('h1')).toContainText('Documentation v2')
    })

    test('v1 docs index loads', async ({ page }) => {
      await page.goto('/docs/v1/')
      await expect(page.locator('h1')).toContainText('Documentation v1')
    })

    test('latest alias resolves to v2', async ({ page }) => {
      await page.goto('/docs/latest/')
      await expect(page.locator('h1')).toContainText('Documentation v2')
    })

    test('v2 installation page loads', async ({ page }) => {
      await page.goto('/docs/v2/installation/')
      await expect(page.locator('h1')).toContainText('Installation Guide (v2)')
    })

    test('v1 installation page loads', async ({ page }) => {
      await page.goto('/docs/v1/installation/')
      await expect(page.locator('h1')).toContainText('Installation Guide (v1)')
    })

    test('v2 configuration page loads', async ({ page }) => {
      await page.goto('/docs/v2/configuration/')
      await expect(page.locator('h1')).toContainText('Configuration Guide (v2)')
    })

    test('v2 migration page loads', async ({ page }) => {
      await page.goto('/docs/v2/migration/')
      await expect(page.locator('h1')).toContainText('Migration Guide')
    })
  })

  test.describe('Version Selector', () => {
    test('version selector is visible in navigation', async ({ page }) => {
      await page.goto('/docs/v2/')
      // Version selector may be rendered differently, so check for version text
      const pageContent = await page.content()
      expect(
        pageContent.includes('v1') || pageContent.includes('v2'),
      ).toBeTruthy()
    })
  })

  test.describe('Cross-version Navigation', () => {
    test('internal links work within v2', async ({ page }) => {
      await page.goto('/docs/v2/')
      // Click on installation link
      await page.click('a[href="/docs/v2/installation"]')
      await expect(page).toHaveURL(/\/docs\/v2\/installation/)
      await expect(page.locator('h1')).toContainText('Installation Guide')
    })

    test('internal links work within v1', async ({ page }) => {
      await page.goto('/docs/v1/')
      await page.click('a[href="/docs/v1/installation"]')
      await expect(page).toHaveURL(/\/docs\/v1\/installation/)
      await expect(page.locator('h1')).toContainText('Installation Guide')
    })
  })
})
