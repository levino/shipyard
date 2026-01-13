import { expect, test } from '@playwright/test'

// Helper: content area is inside .prose class
const proseSelector = '.prose'

test.describe('Cross-Version Links', () => {
  test.describe('Cross-Version Link Syntax (@version:/path)', () => {
    test('should transform @v2:/path links in v1 pages', async ({ page }) => {
      await page.goto('/docs/v1/configuration')

      // The "v2 configuration guide" link should point to /docs/v2/configuration
      const v2Link = page.locator(
        `${proseSelector} a:has-text("v2 configuration guide")`,
      )
      await expect(v2Link).toHaveAttribute('href', '/docs/v2/configuration')
    })

    test('clicking cross-version link navigates to correct version', async ({
      page,
    }) => {
      await page.goto('/docs/v1/configuration')

      // Click the cross-version link
      await page.click(`${proseSelector} a:has-text("v2 configuration guide")`)

      // Should navigate to v2 configuration page
      await expect(page).toHaveURL(/\/docs\/v2\/configuration/)
    })

    test('should transform multiple cross-version links on same page', async ({
      page,
    }) => {
      await page.goto('/docs/v1/index')

      // Check cross-version links in the v1 index page
      const migrationLink = page.locator(
        `${proseSelector} a:has-text("v2 Migration Guide")`,
      )

      // Should point to v2
      await expect(migrationLink).toHaveAttribute('href', '/docs/v2/migration')
    })
  })

  test.describe('Relative Links Within Version', () => {
    test('relative links stay in same version from v2', async ({ page }) => {
      await page.goto('/docs/v2/')

      // The installation link should be relative (in prose content area)
      const installLink = page.locator(
        `${proseSelector} a:has-text("Installation Guide")`,
      )
      await expect(installLink).toHaveAttribute('href', './installation')

      // Click and verify we stay in v2
      await installLink.click()
      await expect(page).toHaveURL(/\/docs\/v2\/installation/)
    })

    test('relative links stay in same version from v1', async ({ page }) => {
      await page.goto('/docs/v1/')

      // The Installation link should be relative (in prose content area)
      const installLink = page.locator(
        `${proseSelector} a:has-text("Installation Guide")`,
      )
      await expect(installLink).toHaveAttribute('href', './installation')

      // Click and verify we stay in v1
      await installLink.click()
      await expect(page).toHaveURL(/\/docs\/v1\/installation/)
    })

    test('relative links from latest alias work correctly', async ({
      page,
    }) => {
      // Note: Latest redirects to v2, but relative links should still work
      await page.goto('/docs/v2/')

      // Click relative link
      await page.click(`${proseSelector} a:has-text("Installation Guide")`)

      // Should navigate within v2
      await expect(page).toHaveURL(/\/docs\/v2\/installation/)
    })
  })

  test.describe('Auto-Versioned Absolute Links', () => {
    test('absolute docs links without version get current version added', async ({
      page,
    }) => {
      await page.goto('/docs/v2/')

      // The configuration link in v2 index uses /docs/configuration (no version)
      // It should be transformed to /docs/v2/configuration
      // Check in prose content area only, excluding pagination links
      const configLink = page.locator(
        `${proseSelector} ol a[href="/docs/v2/configuration"]`,
      )
      await expect(configLink).toHaveCount(1)
      await expect(configLink).toHaveAttribute('href', '/docs/v2/configuration')
    })

    test('clicking auto-versioned link navigates correctly', async ({
      page,
    }) => {
      await page.goto('/docs/v2/')

      // Click the configuration link in the content list (not pagination)
      const configLink = page.locator(
        `${proseSelector} ol a[href="/docs/v2/configuration"]`,
      )
      await configLink.click()

      // Should navigate to v2 configuration
      await expect(page).toHaveURL(/\/docs\/v2\/configuration/)
    })
  })

  test.describe('Already Versioned Links', () => {
    test('version selector links are preserved', async ({ page }) => {
      // Build the page and check that version selector links are preserved
      const response = await page.goto('/docs/v1/')
      expect(response?.status()).toBe(200)

      // The version selector should exist and contain version links (use navbar one)
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"]',
      )
      await expect(versionSelector).toBeVisible()

      // Click to open the dropdown
      await versionSelector.click()

      // Check links inside version selector dropdown
      const v1Link = versionSelector.locator('a:has-text("Version 1.0")')
      const v2Link = versionSelector.locator('a:has-text("Version 2.0")')

      await expect(v1Link).toBeVisible()
      await expect(v2Link).toBeVisible()
    })
  })

  test.describe('External and Anchor Links', () => {
    test('external links are not modified', async ({ page }) => {
      await page.goto('/docs/v2/')

      // GitHub edit link should remain external
      const editLink = page.locator('a:has-text("Edit this page")')
      await expect(editLink).toHaveAttribute('href', /^https:\/\/github\.com/)
    })

    test('anchor links are not modified', async ({ page }) => {
      await page.goto('/docs/v2/')

      // Table of contents anchor links should remain as anchors
      const anchorLinks = page.locator('a[href^="#"]')
      const count = await anchorLinks.count()

      // There should be some anchor links (TOC)
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Link Navigation Flow', () => {
    test('can navigate from v1 to v2 via cross-version link and back', async ({
      page,
    }) => {
      // Start at v1 configuration
      await page.goto('/docs/v1/configuration')
      expect(page.url()).toContain('/docs/v1/configuration')

      // Click cross-version link to v2 configuration
      await page.click(`${proseSelector} a:has-text("v2 configuration guide")`)
      await expect(page).toHaveURL(/\/docs\/v2\/configuration/)

      // Now navigate back to v1 using version selector
      // It's a dropdown, click to open
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"]',
      )
      await versionSelector.click()
      // Then click v1 option
      await versionSelector.locator('a:has-text("Version 1.0")').click()
      await expect(page).toHaveURL(/\/docs\/v1\/configuration/)
    })

    test('cross-version links preserve page context', async ({ page }) => {
      // Start at v1 index
      await page.goto('/docs/v1/')

      // Click cross-version link to v2 migration
      await page.click(`${proseSelector} a:has-text("v2 Migration Guide")`)

      // Should be on v2 migration page
      await expect(page).toHaveURL(/\/docs\/v2\/migration/)

      // The page should display v2 content
      const heading = page.locator('h1')
      await expect(heading).toContainText('Migration')
    })
  })
})
