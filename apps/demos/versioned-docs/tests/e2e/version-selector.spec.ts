import { expect, test } from '@playwright/test'

test.describe('Version Selector Component', () => {
  test.describe('Dropdown Variant (Navbar)', () => {
    test('version selector is visible in navbar', async ({ page }) => {
      await page.goto('/docs/v2/')
      const versionSelector = page.locator(
        '[data-testid="version-selector"].dropdown',
      )
      await expect(versionSelector).toBeVisible()
    })

    test('shows current version label in dropdown button', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdownButton = page
        .locator('[data-testid="version-selector"].dropdown')
        .locator('button, [role="button"]')
      await expect(dropdownButton).toContainText('Version 2.0')
    })

    test('dropdown opens on click and shows all versions', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      // Click to open dropdown
      await dropdownButton.click()

      // Dropdown menu should be visible
      const dropdownContent = dropdown.locator('.dropdown-content')
      await expect(dropdownContent).toBeVisible()

      // Both versions should be listed
      await expect(dropdownContent.locator('a')).toHaveCount(2)
      await expect(dropdownContent).toContainText('Version 2.0')
      await expect(dropdownContent).toContainText('Version 1.0')
    })

    test('current version is highlighted as active', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      // Find the active version link
      const activeLink = dropdown.locator('.dropdown-content a.active')
      await expect(activeLink).toBeVisible()
      await expect(activeLink).toContainText('Version 2.0')
    })

    test('v1 is shown as active when viewing v1 docs', async ({ page }) => {
      await page.goto('/docs/v1/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      // Button should show v1
      await expect(dropdownButton).toContainText('Version 1.0')

      await dropdownButton.click()

      // v1 should be active
      const activeLink = dropdown.locator('.dropdown-content a.active')
      await expect(activeLink).toContainText('Version 1.0')
    })

    test('displays stable badge for v2', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      // Find the v2 link and check for stable badge
      const v2Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 2.0',
      })
      const stableBadge = v2Link.locator('.badge-success')
      await expect(stableBadge).toBeVisible()
      await expect(stableBadge).toContainText('Stable')
    })

    test('displays deprecated badge for v1', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      // Find the v1 link and check for deprecated badge
      const v1Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 1.0',
      })
      const deprecatedBadge = v1Link.locator('.badge-warning')
      await expect(deprecatedBadge).toBeVisible()
      await expect(deprecatedBadge).toContainText('Deprecated')
    })

    test('clicking version navigates to same page in different version', async ({
      page,
    }) => {
      await page.goto('/docs/v2/installation/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      // Click on v1
      const v1Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 1.0',
      })
      await v1Link.click()

      // Should navigate to v1/installation
      await expect(page).toHaveURL(/\/docs\/v1\/installation/)
      await expect(page.locator('h1')).toContainText('Installation Guide (v1)')
    })

    test('version selector has tag icon', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const tagIcon = dropdown.locator('svg').first()
      await expect(tagIcon).toBeVisible()
    })
  })

  test.describe('List Variant (Sidebar)', () => {
    // The sidebar version selector is only visible on mobile devices
    test.use({ viewport: { width: 375, height: 667 } })

    test('version selector is visible in sidebar on mobile', async ({
      page,
    }) => {
      await page.goto('/docs/v2/')
      // Open the drawer on mobile
      await page.click('label[for="drawer"]')
      // Find sidebar version selector (list variant)
      const sidebarSelector = page.locator(
        '[data-testid="version-selector"]:not(.dropdown)',
      )
      await expect(sidebarSelector).toBeVisible()
    })

    test('sidebar version selector expands on click', async ({ page }) => {
      await page.goto('/docs/v2/')
      // Open the drawer on mobile
      await page.click('label[for="drawer"]')

      const sidebarSelector = page.locator(
        '[data-testid="version-selector"]:not(.dropdown)',
      )
      const details = sidebarSelector.locator('details')
      const summary = details.locator('summary')

      // Click to expand
      await summary.click()

      // Check that details is now open
      await expect(details).toHaveAttribute('open', '')

      // Versions should be listed
      const versionLinks = details.locator('ul a')
      await expect(versionLinks).toHaveCount(2)
    })
  })

  test.describe('Version Navigation', () => {
    test('navigating from v2 index to v1 index works', async ({ page }) => {
      await page.goto('/docs/v2/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      const v1Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 1.0',
      })
      await v1Link.click()

      await expect(page).toHaveURL(/\/docs\/v1\//)
      await expect(page.locator('h1')).toContainText('Documentation v1')
    })

    test('navigating from v1 to v2 works', async ({ page }) => {
      await page.goto('/docs/v1/configuration/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      const v2Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 2.0',
      })
      await v2Link.click()

      await expect(page).toHaveURL(/\/docs\/v2\/configuration/)
      await expect(page.locator('h1')).toContainText('Configuration Guide (v2)')
    })

    test('version selector preserves the page slug when switching versions', async ({
      page,
    }) => {
      // Start at v2 configuration page
      await page.goto('/docs/v2/configuration/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      // Check the href of the v1 link
      const v1Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 1.0',
      })
      const href = await v1Link.getAttribute('href')
      expect(href).toBe('/docs/v1/configuration/')
    })

    test('latest alias shows v2 as current version', async ({ page }) => {
      await page.goto('/docs/latest/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      // Button should show v2 since latest resolves to v2
      await expect(dropdownButton).toContainText('Version 2.0')
    })
  })

  test.describe('Edge Cases', () => {
    test('version selector not rendered on non-docs pages', async ({
      page,
    }) => {
      await page.goto('/')
      const versionSelector = page.locator('[data-testid="version-selector"]')
      await expect(versionSelector).toHaveCount(0)
    })

    test('about page has no version selector', async ({ page }) => {
      await page.goto('/about/')
      const versionSelector = page.locator('[data-testid="version-selector"]')
      await expect(versionSelector).toHaveCount(0)
    })
  })
})
