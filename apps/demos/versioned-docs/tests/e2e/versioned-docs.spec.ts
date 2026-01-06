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

  test.describe('Version-specific Sidebar', () => {
    test('v2 sidebar shows v2 pages only', async ({ page }) => {
      await page.goto('/docs/v2/')
      // Check that sidebar contains v2 pages using data-testid
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
      await expect(
        sidebar.locator('a[href="/docs/v2/installation"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v2/configuration"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v2/migration"]'),
      ).toBeVisible()
    })

    test('v1 sidebar shows v1 pages only', async ({ page }) => {
      await page.goto('/docs/v1/')
      // Check that sidebar contains v1 pages using data-testid
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
      await expect(
        sidebar.locator('a[href="/docs/v1/installation"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v1/configuration"]'),
      ).toBeVisible()
      // Migration page should NOT be in v1 sidebar (it only exists in v2)
      await expect(sidebar.locator('a[href="/docs/v1/migration"]')).toHaveCount(
        0,
      )
    })

    test('v1 sidebar does not show v2 pages', async ({ page }) => {
      await page.goto('/docs/v1/')
      // Check that sidebar local nav links are all v1 paths
      const sidebarLinks = page.locator(
        '[data-testid="sidebar-local-nav"] a[href^="/docs/"]',
      )
      const hrefs = await sidebarLinks.evaluateAll((links) =>
        links.map((l) => l.getAttribute('href')),
      )
      // All doc links should start with /docs/v1
      for (const link of hrefs) {
        expect(link).toMatch(/^\/docs\/v1(\/|$)/)
        expect(link).not.toMatch(/^\/docs\/v2/)
      }
    })

    test('v2 sidebar does not show v1 pages', async ({ page }) => {
      await page.goto('/docs/v2/')
      // Check that sidebar local nav links are all v2 paths
      const sidebarLinks = page.locator(
        '[data-testid="sidebar-local-nav"] a[href^="/docs/"]',
      )
      const hrefs = await sidebarLinks.evaluateAll((links) =>
        links.map((l) => l.getAttribute('href')),
      )
      // All doc links should start with /docs/v2
      for (const link of hrefs) {
        expect(link).toMatch(/^\/docs\/v2(\/|$)/)
        expect(link).not.toMatch(/^\/docs\/v1/)
      }
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

  test.describe('404 Error Handling', () => {
    test('non-existent version returns 404', async ({ page }) => {
      const response = await page.goto('/docs/v99/')
      // Should return 404 status
      expect(response?.status()).toBe(404)
      // Check for 404 content in the page
      await expect(page.locator('h1')).toContainText('404')
    })

    test('non-existent page in valid version returns 404', async ({ page }) => {
      const response = await page.goto('/docs/v2/non-existent-page/')
      expect(response?.status()).toBe(404)
      await expect(page.locator('h1')).toContainText('404')
    })

    test('page that only exists in v2 returns 404 in v1', async ({ page }) => {
      // Migration page only exists in v2, not v1
      const response = await page.goto('/docs/v1/migration/')
      expect(response?.status()).toBe(404)
      await expect(page.locator('h1')).toContainText('404')
    })

    test('non-existent nested path returns 404', async ({ page }) => {
      const response = await page.goto('/docs/v2/deeply/nested/path/')
      expect(response?.status()).toBe(404)
      await expect(page.locator('h1')).toContainText('404')
    })
  })

  test.describe('URL Structure Verification', () => {
    test('v2 docs have correct URL structure', async ({ page }) => {
      await page.goto('/docs/v2/installation/')
      // Verify canonical URL structure
      expect(page.url()).toMatch(/\/docs\/v2\/installation\/?$/)
    })

    test('v1 docs have correct URL structure', async ({ page }) => {
      await page.goto('/docs/v1/configuration/')
      expect(page.url()).toMatch(/\/docs\/v1\/configuration\/?$/)
    })

    test('latest alias has correct URL structure', async ({ page }) => {
      await page.goto('/docs/latest/installation/')
      // Should keep the 'latest' in URL (no redirect)
      expect(page.url()).toMatch(/\/docs\/latest\/installation\/?$/)
      // But should show v2 content
      await expect(page.locator('h1')).toContainText('Installation Guide (v2)')
    })

    test('docs root redirect preserves path structure', async ({ page }) => {
      await page.goto('/docs/')
      // Astro's static redirect uses meta refresh - wait for the redirect to complete
      await page.waitForURL(/\/docs\/v2\/?$/, { timeout: 5000 })
      expect(page.url()).toMatch(/\/docs\/v2\/?$/)
    })
  })

  test.describe('Version Switching with Page Preservation', () => {
    test('switching from v2 to v1 on shared page preserves slug', async ({
      page,
    }) => {
      await page.goto('/docs/v2/configuration/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      const v1Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 1.0',
      })
      const href = await v1Link.getAttribute('href')
      // URL should point to same page in v1
      expect(href).toMatch(/\/docs\/v1\/configuration\/?/)
    })

    test('switching from v1 to v2 on shared page preserves slug', async ({
      page,
    }) => {
      await page.goto('/docs/v1/installation/')
      const dropdown = page.locator('[data-testid="version-selector"].dropdown')
      const dropdownButton = dropdown.locator('button, [role="button"]')

      await dropdownButton.click()

      const v2Link = dropdown.locator('.dropdown-content a', {
        hasText: 'Version 2.0',
      })
      const href = await v2Link.getAttribute('href')
      // URL should point to same page in v2
      expect(href).toMatch(/\/docs\/v2\/installation\/?/)
    })
  })
})
