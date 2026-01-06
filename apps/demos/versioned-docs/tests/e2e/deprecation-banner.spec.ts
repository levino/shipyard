import { expect, test } from '@playwright/test'

test.describe('Deprecation Banner', () => {
  test.describe('Banner Visibility', () => {
    test('deprecation banner appears on v1 docs pages', async ({ page }) => {
      await page.goto('/docs/v1/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).toBeVisible()
    })

    test('deprecation banner appears on v1 subpages', async ({ page }) => {
      await page.goto('/docs/v1/installation')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).toBeVisible()
    })

    test('deprecation banner does NOT appear on v2 docs pages', async ({
      page,
    }) => {
      await page.goto('/docs/v2/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).not.toBeVisible()
    })

    test('deprecation banner does NOT appear on v2 subpages', async ({
      page,
    }) => {
      await page.goto('/docs/v2/installation')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).not.toBeVisible()
    })

    test('deprecation banner does NOT appear on latest alias pages', async ({
      page,
    }) => {
      await page.goto('/docs/latest/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).not.toBeVisible()
    })

    test('deprecation banner does NOT appear on non-docs pages', async ({
      page,
    }) => {
      await page.goto('/about')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).not.toBeVisible()
    })
  })

  test.describe('Banner Content', () => {
    test('banner shows correct warning message', async ({ page }) => {
      await page.goto('/docs/v1/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).toContainText('Outdated Documentation')
      await expect(banner).toContainText('Version 1.0')
      await expect(banner).toContainText('no longer maintained')
    })

    test('banner contains link to latest version', async ({ page }) => {
      await page.goto('/docs/v1/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      const link = banner.locator('a')
      await expect(link).toHaveAttribute('href', '/docs/v2/')
      await expect(link).toContainText('View the latest version')
    })

    test('banner link preserves page path when navigating to latest', async ({
      page,
    }) => {
      await page.goto('/docs/v1/installation')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      const link = banner.locator('a')
      // URLs may have trailing slashes depending on Astro's trailingSlash config
      const href = await link.getAttribute('href')
      expect(href?.replace(/\/$/, '')).toBe('/docs/v2/installation')
    })

    test('banner link works for configuration page', async ({ page }) => {
      await page.goto('/docs/v1/configuration')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      const link = banner.locator('a')
      // URLs may have trailing slashes depending on Astro's trailingSlash config
      const href = await link.getAttribute('href')
      expect(href?.replace(/\/$/, '')).toBe('/docs/v2/configuration')
    })
  })

  test.describe('Banner Navigation', () => {
    test('clicking latest version link navigates to correct page', async ({
      page,
    }) => {
      await page.goto('/docs/v1/installation')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      const link = banner.locator('a')
      await link.click()
      // URL may have trailing slash
      await expect(page).toHaveURL(/\/docs\/v2\/installation\/?$/)
    })

    test('latest version page does not have deprecation banner', async ({
      page,
    }) => {
      await page.goto('/docs/v1/installation')
      const link = page.locator('[data-testid="deprecation-banner"] a')
      await link.click()
      // URL may have trailing slash
      await expect(page).toHaveURL(/\/docs\/v2\/installation\/?$/)
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).not.toBeVisible()
    })
  })

  test.describe('Banner Dismissal', () => {
    test('banner can be dismissed', async ({ page }) => {
      await page.goto('/docs/v1/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).toBeVisible()

      // Click dismiss button
      const dismissBtn = banner.locator('[data-dismiss-banner]')
      await dismissBtn.click()

      // Banner should be hidden (has 'hidden' class)
      await expect(banner).toHaveClass(/hidden/)
    })

    test('dismiss button has correct aria-label', async ({ page }) => {
      await page.goto('/docs/v1/')
      const dismissBtn = page.locator('[data-dismiss-banner]')
      await expect(dismissBtn).toHaveAttribute('aria-label', 'Dismiss banner')
    })

    test('banner reappears on navigation to different v1 page', async ({
      page,
    }) => {
      await page.goto('/docs/v1/')
      const banner = page.locator('[data-testid="deprecation-banner"]')

      // Dismiss the banner
      await banner.locator('[data-dismiss-banner]').click()
      await expect(banner).toHaveClass(/hidden/)

      // Navigate to another v1 page
      await page.goto('/docs/v1/installation')

      // Banner should be visible again
      const newBanner = page.locator('[data-testid="deprecation-banner"]')
      await expect(newBanner).toBeVisible()
      await expect(newBanner).not.toHaveClass(/hidden/)
    })
  })

  test.describe('Banner Styling', () => {
    test('banner uses warning alert style', async ({ page }) => {
      await page.goto('/docs/v1/')
      const alert = page.locator('[data-testid="deprecation-banner"] .alert')
      await expect(alert).toHaveClass(/alert-warning/)
    })

    test('banner has warning icon', async ({ page }) => {
      await page.goto('/docs/v1/')
      const icon = page
        .locator('[data-testid="deprecation-banner"] svg')
        .first()
      await expect(icon).toBeVisible()
    })

    test('banner has role="alert"', async ({ page }) => {
      await page.goto('/docs/v1/')
      const banner = page.locator('[data-testid="deprecation-banner"]')
      await expect(banner).toHaveAttribute('role', 'alert')
    })
  })
})
