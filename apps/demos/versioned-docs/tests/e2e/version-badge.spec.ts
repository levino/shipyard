import { expect, test } from '@playwright/test'

test.describe('Version Badge Component', () => {
  test.describe('Badge Visibility', () => {
    test('version badge is visible on v2 docs', async ({ page }) => {
      await page.goto('/docs/v2/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
    })

    test('version badge is visible on v1 docs', async ({ page }) => {
      await page.goto('/docs/v1/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
    })

    test('version badge is visible after latest alias redirect', async ({
      page,
    }) => {
      await page.goto('/docs/latest/')
      // Wait for 301 redirect to complete
      await page.waitForURL(/\/docs\/v2\/?$/, { timeout: 5000 })
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
    })

    test('no version badge on non-docs pages', async ({ page }) => {
      await page.goto('/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).not.toBeVisible()
    })

    test('no version badge on about page', async ({ page }) => {
      await page.goto('/about')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).not.toBeVisible()
    })
  })

  test.describe('Badge Status Display', () => {
    test('v2 (stable version) shows Stable badge', async ({ page }) => {
      await page.goto('/docs/v2/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Stable')
      // Should have success styling
      await expect(badge).toHaveClass(/badge-success/)
    })

    test('v1 (deprecated version) shows Deprecated badge', async ({ page }) => {
      await page.goto('/docs/v1/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Deprecated')
      // Should have warning styling
      await expect(badge).toHaveClass(/badge-warning/)
    })

    test('latest alias redirects and shows Stable badge (same as v2)', async ({
      page,
    }) => {
      await page.goto('/docs/latest/')
      // Wait for 301 redirect to complete
      await page.waitForURL(/\/docs\/v2\/?$/, { timeout: 5000 })
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Stable')
      await expect(badge).toHaveClass(/badge-success/)
    })
  })

  test.describe('Badge Accessibility', () => {
    test('badge has screen reader text', async ({ page }) => {
      await page.goto('/docs/v2/')
      const srText = page.locator('[data-testid="version-badge"] .sr-only')
      await expect(srText).toContainText('Version')
    })

    test('badge is placed near breadcrumbs', async ({ page }) => {
      await page.goto('/docs/v2/')
      // Badge should be within the same flex container as breadcrumbs
      const container = page.locator('.flex.items-center.gap-3')
      const badge = container.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
    })
  })

  test.describe('Badge on Different Pages', () => {
    test('badge shows on v2 installation page', async ({ page }) => {
      await page.goto('/docs/v2/installation')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toContainText('Stable')
    })

    test('badge shows on v1 configuration page', async ({ page }) => {
      await page.goto('/docs/v1/configuration')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toContainText('Deprecated')
    })

    test('badge shows on v2 migration page', async ({ page }) => {
      await page.goto('/docs/v2/migration')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toContainText('Stable')
    })
  })

  test.describe('Badge Styling', () => {
    test('badge has small size variant', async ({ page }) => {
      await page.goto('/docs/v2/')
      const badge = page.locator('[data-testid="version-badge"]')
      // The badge should have badge-sm class
      await expect(badge).toHaveClass(/badge-sm/)
    })

    test('badge has appropriate color for stable', async ({ page }) => {
      await page.goto('/docs/v2/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toHaveClass(/badge/)
      await expect(badge).toHaveClass(/badge-success/)
    })

    test('badge has appropriate color for deprecated', async ({ page }) => {
      await page.goto('/docs/v1/')
      const badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toHaveClass(/badge/)
      await expect(badge).toHaveClass(/badge-warning/)
    })
  })

  test.describe('Badge Consistency', () => {
    test('badge status matches version selector badge', async ({ page }) => {
      await page.goto('/docs/v2/')

      // Badge in content area
      const contentBadge = page.locator('[data-testid="version-badge"]')
      await expect(contentBadge).toContainText('Stable')

      // Badge in version selector dropdown (use navbar one specifically)
      const dropdown = page.locator('.navbar [data-testid="version-selector"]')
      await dropdown.click()
      const v2Option = dropdown.locator('a.active')
      const dropdownBadge = v2Option.locator('.badge')
      await expect(dropdownBadge).toContainText('Stable')
    })

    test('badge persists after navigation', async ({ page }) => {
      await page.goto('/docs/v2/')

      let badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Stable')

      // Navigate to another page
      await page.click('a[href="/docs/v2/installation"]')
      await page.waitForURL('/docs/v2/installation')

      badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Stable')
    })

    test('badge updates when switching versions', async ({ page }) => {
      await page.goto('/docs/v2/')

      let badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Stable')

      // Switch to v1 using version selector (use navbar one specifically)
      const dropdown = page.locator('.navbar [data-testid="version-selector"]')
      await dropdown.click()
      await page.click(
        '.navbar [data-testid="version-selector"] a[href="/docs/v1/"]',
      )
      await page.waitForURL('/docs/v1/')

      badge = page.locator('[data-testid="version-badge"]')
      await expect(badge).toContainText('Deprecated')
    })
  })
})
