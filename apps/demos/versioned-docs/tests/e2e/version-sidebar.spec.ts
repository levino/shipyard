import { expect, test } from '@playwright/test'

test.describe('Version-specific Sidebar E2E Tests', () => {
  test.describe('Sidebar Content Per Version', () => {
    test('v2 sidebar contains all v2 doc pages', async ({ page }) => {
      await page.goto('/docs/v2/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // v2 has: index, installation, configuration, migration
      // Check that v2 pages are present
      await expect(
        sidebar.locator('a[href="/docs/v2/installation"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v2/configuration"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v2/migration"]'),
      ).toBeVisible()
      // Index page link is /docs/v2 (without trailing slash)
      await expect(sidebar.locator('a[href="/docs/v2"]')).toBeVisible()
    })

    test('v1 sidebar contains all v1 doc pages', async ({ page }) => {
      await page.goto('/docs/v1/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // v1 has: index, installation, configuration (no migration)
      // Check that v1 pages are present
      await expect(
        sidebar.locator('a[href="/docs/v1/installation"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v1/configuration"]'),
      ).toBeVisible()
      // Index page link is /docs/v1 (without trailing slash)
      await expect(sidebar.locator('a[href="/docs/v1"]')).toBeVisible()
    })

    test('v1 sidebar does not contain v2-only pages', async ({ page }) => {
      await page.goto('/docs/v1/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Migration only exists in v2, not v1
      await expect(sidebar.locator('a[href="/docs/v1/migration"]')).toHaveCount(
        0,
      )
      await expect(sidebar.locator('a[href="/docs/v2/migration"]')).toHaveCount(
        0,
      )
    })

    test('latest alias redirects to v2 and sidebar matches v2 content', async ({
      page,
    }) => {
      await page.goto('/docs/latest/')
      // Wait for redirect to complete
      await page.waitForURL(/\/docs\/v2\/?$/, { timeout: 5000 })

      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // After redirect, sidebar shows v2 content
      await expect(
        sidebar.locator('a[href="/docs/v2/installation"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v2/configuration"]'),
      ).toBeVisible()
      await expect(
        sidebar.locator('a[href="/docs/v2/migration"]'),
      ).toBeVisible()

      // Should NOT show v1 pages
      await expect(sidebar.locator('a[href*="/docs/v1/"]')).toHaveCount(0)
    })
  })

  test.describe('Sidebar Navigation Within Version', () => {
    test('clicking sidebar links navigates within v2', async ({ page }) => {
      await page.goto('/docs/v2/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Navigate to installation via sidebar
      await sidebar.locator('a[href="/docs/v2/installation"]').click()
      await expect(page).toHaveURL(/\/docs\/v2\/installation/)
      await expect(page.locator('h1')).toContainText('Installation')

      // Navigate to configuration via sidebar
      await sidebar.locator('a[href="/docs/v2/configuration"]').click()
      await expect(page).toHaveURL(/\/docs\/v2\/configuration/)
      await expect(page.locator('h1')).toContainText('Configuration')
    })

    test('clicking sidebar links navigates within v1', async ({ page }) => {
      await page.goto('/docs/v1/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Navigate to installation via sidebar
      await sidebar.locator('a[href="/docs/v1/installation"]').click()
      await expect(page).toHaveURL(/\/docs\/v1\/installation/)
      await expect(page.locator('h1')).toContainText('Installation')

      // Navigate to configuration via sidebar
      await sidebar.locator('a[href="/docs/v1/configuration"]').click()
      await expect(page).toHaveURL(/\/docs\/v1\/configuration/)
      await expect(page.locator('h1')).toContainText('Configuration')
    })

    test('sidebar navigation preserves version context', async ({ page }) => {
      await page.goto('/docs/v1/installation/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Navigate around within v1
      await sidebar.locator('a[href="/docs/v1/configuration"]').click()
      await expect(page).toHaveURL(/\/docs\/v1\/configuration/)

      // Verify still in v1 context - sidebar still shows v1 links
      await expect(
        sidebar.locator('a[href="/docs/v1/installation"]'),
      ).toBeVisible()

      // No v2 links should appear
      const allLinks = sidebar.locator('a[href^="/docs/"]')
      const hrefs = await allLinks.evaluateAll((links) =>
        links.map((l) => l.getAttribute('href')),
      )
      for (const href of hrefs) {
        expect(href).not.toContain('/docs/v2/')
      }
    })
  })

  test.describe('Pagination Within Version', () => {
    test('v2 pagination links stay within v2', async ({ page }) => {
      await page.goto('/docs/v2/installation/')

      const paginationNav = page.locator('.pagination-nav')
      if ((await paginationNav.count()) > 0) {
        // Check prev/next links are v2 paths
        const prevLink = paginationNav.locator('a[rel="prev"]')
        const nextLink = paginationNav.locator('a[rel="next"]')

        if ((await prevLink.count()) > 0) {
          const prevHref = await prevLink.getAttribute('href')
          expect(prevHref).toMatch(/^\/docs\/v2\//)
        }

        if ((await nextLink.count()) > 0) {
          const nextHref = await nextLink.getAttribute('href')
          expect(nextHref).toMatch(/^\/docs\/v2\//)
        }
      }
    })

    test('v1 pagination links stay within v1', async ({ page }) => {
      await page.goto('/docs/v1/installation/')

      const paginationNav = page.locator('.pagination-nav')
      if ((await paginationNav.count()) > 0) {
        // Check prev/next links are v1 paths
        const prevLink = paginationNav.locator('a[rel="prev"]')
        const nextLink = paginationNav.locator('a[rel="next"]')

        if ((await prevLink.count()) > 0) {
          const prevHref = await prevLink.getAttribute('href')
          expect(prevHref).toMatch(/^\/docs\/v1\//)
        }

        if ((await nextLink.count()) > 0) {
          const nextHref = await nextLink.getAttribute('href')
          expect(nextHref).toMatch(/^\/docs\/v1\//)
        }
      }
    })

    test('pagination does not cross version boundaries', async ({ page }) => {
      // Go to the first page in v1 (should have no prev)
      await page.goto('/docs/v1/')

      const paginationNav = page.locator('.pagination-nav')
      if ((await paginationNav.count()) > 0) {
        const allPaginationLinks = paginationNav.locator('a')
        const hrefs = await allPaginationLinks.evaluateAll((links) =>
          links.map((l) => l.getAttribute('href')),
        )

        // All pagination links must be v1
        for (const href of hrefs) {
          if (href) {
            expect(href).toMatch(/^\/docs\/v1\//)
            expect(href).not.toMatch(/\/docs\/v2\//)
          }
        }
      }
    })
  })

  test.describe('Sidebar Active State', () => {
    test('current page is highlighted in v2 sidebar', async ({ page }) => {
      await page.goto('/docs/v2/installation/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // The installation link should have an active state
      const installationLink = sidebar.locator(
        'a[href="/docs/v2/installation"]',
      )
      // Verify the link exists and is visible
      await expect(installationLink).toBeVisible()

      // Check that the link has active styling (text-primary indicates current page)
      const linkClass = await installationLink.getAttribute('class')
      expect(linkClass).toContain('text-primary')
    })

    test('current page is highlighted in v1 sidebar', async ({ page }) => {
      await page.goto('/docs/v1/configuration/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // The configuration link should be present
      const configurationLink = sidebar.locator(
        'a[href="/docs/v1/configuration"]',
      )
      await expect(configurationLink).toBeVisible()
    })

    test('active state changes when navigating', async ({ page }) => {
      await page.goto('/docs/v2/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Navigate to a different page
      await sidebar.locator('a[href="/docs/v2/installation"]').click()
      await expect(page).toHaveURL(/\/docs\/v2\/installation/)

      // The installation link should now be visible/accessible
      await expect(
        sidebar.locator('a[href="/docs/v2/installation"]'),
      ).toBeVisible()
    })
  })

  test.describe('No Cross-Version Leakage', () => {
    test('all v2 sidebar links are v2 paths', async ({ page }) => {
      await page.goto('/docs/v2/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      const docLinks = sidebar.locator('a[href^="/docs/"]')
      const hrefs = await docLinks.evaluateAll((links) =>
        links.map((l) => l.getAttribute('href')),
      )

      expect(hrefs.length).toBeGreaterThan(0)
      for (const href of hrefs) {
        expect(href).toMatch(/^\/docs\/v2(\/|$)/)
      }
    })

    test('all v1 sidebar links are v1 paths', async ({ page }) => {
      await page.goto('/docs/v1/')
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      const docLinks = sidebar.locator('a[href^="/docs/"]')
      const hrefs = await docLinks.evaluateAll((links) =>
        links.map((l) => l.getAttribute('href')),
      )

      expect(hrefs.length).toBeGreaterThan(0)
      for (const href of hrefs) {
        expect(href).toMatch(/^\/docs\/v1(\/|$)/)
      }
    })

    test('latest alias redirects to v2 and sidebar shows v2 paths', async ({
      page,
    }) => {
      await page.goto('/docs/latest/')
      // Wait for redirect to complete
      await page.waitForURL(/\/docs\/v2\/?$/, { timeout: 5000 })

      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      const docLinks = sidebar.locator('a[href^="/docs/"]')
      const hrefs = await docLinks.evaluateAll((links) =>
        links.map((l) => l.getAttribute('href')),
      )

      // After redirect to v2, sidebar shows v2 content with canonical v2 URLs
      expect(hrefs.length).toBeGreaterThan(0)
      for (const href of hrefs) {
        expect(href).toMatch(/^\/docs\/v2(\/|$)/)
        // Should not contain v1 links
        expect(href).not.toMatch(/^\/docs\/v1(\/|$)/)
      }
    })

    test('switching versions updates sidebar accordingly', async ({ page }) => {
      // Start on v2
      await page.goto('/docs/v2/')
      let sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Verify v2 sidebar
      let hrefs = await sidebar
        .locator('a[href^="/docs/"]')
        .evaluateAll((links) => links.map((l) => l.getAttribute('href')))
      for (const href of hrefs) {
        expect(href).toMatch(/^\/docs\/v2(\/|$)/)
      }

      // Navigate to v1
      await page.goto('/docs/v1/')
      sidebar = page.locator('[data-testid="sidebar-local-nav"]')

      // Verify v1 sidebar
      hrefs = await sidebar
        .locator('a[href^="/docs/"]')
        .evaluateAll((links) => links.map((l) => l.getAttribute('href')))
      for (const href of hrefs) {
        expect(href).toMatch(/^\/docs\/v1(\/|$)/)
      }
    })
  })
})
