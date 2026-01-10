import { expect, test } from '@playwright/test'

test.describe('Docs Pages in Server Mode (SSR)', () => {
  test('docs index page renders correctly', async ({ page }) => {
    await page.goto('/docs/index')

    // Verify the page content loads (not a 500 error)
    await expect(page.locator('h1')).toContainText('Documentation Overview')

    // Verify sidebar is present
    await expect(page.locator('.drawer-side')).toBeVisible()
  })

  test('docs subpage renders correctly', async ({ page }) => {
    await page.goto('/docs/installation')

    // Verify the page content loads
    await expect(page.locator('h1')).toBeVisible()

    // Verify sidebar is present
    await expect(page.locator('.drawer-side')).toBeVisible()
  })

  test('docs nested page renders correctly', async ({ page }) => {
    await page.goto('/docs/details/cool-stuff')

    // Verify the page content loads
    await expect(page.locator('h1')).toBeVisible()

    // Verify sidebar is present
    await expect(page.locator('.drawer-side')).toBeVisible()
  })

  test('docs navigation between pages works', async ({ page }) => {
    await page.goto('/docs/index')

    // Find and click a link in the sidebar
    const sidebarLink = page.locator(
      '.drawer-side a[href="/docs/installation"]',
    )
    await expect(sidebarLink).toBeVisible()
    await sidebarLink.click()

    // Verify navigation worked
    await expect(page).toHaveURL('/docs/installation')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('docs category index page renders correctly', async ({ page }) => {
    await page.goto('/docs/details')

    // Verify the page content loads (not a 500 error)
    await expect(page.locator('h1')).toBeVisible()

    // Verify sidebar is present
    await expect(page.locator('.drawer-side')).toBeVisible()
  })

  test('docs pages show expected content', async ({ page }) => {
    await page.goto('/docs/configuration')

    // Verify specific content is present
    await expect(page.locator('article')).toBeVisible()

    // Verify the page has a proper title
    await expect(page).toHaveTitle(/Server Mode Test/)
  })
})
