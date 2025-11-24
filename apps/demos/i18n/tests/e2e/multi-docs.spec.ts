import { expect, test } from '@playwright/test'

/**
 * Tests for Multiple Documentation Instances feature with i18n.
 * This tests the ability to have multiple docs at different route paths with locale support.
 */

test.describe('Multi-Docs Feature with i18n', () => {
  test.describe('Primary Docs at /en/docs', () => {
    test('renders documentation at /en/docs route', async ({ page }) => {
      await page.goto('/en/docs/')
      await expect(page.locator('h1')).toContainText('Garden Guide')
    })

    test('generates all docs routes correctly', async ({ page }) => {
      const routes = ['/en/docs/', '/en/docs/vegetables', '/en/docs/harvesting']

      for (const route of routes) {
        const response = await page.goto(route)
        expect(response?.status()).toBe(200)
      }
    })

    test('sidebar shows docs entries', async ({ page }) => {
      await page.goto('/en/docs/')
      const sidebar = page.locator('.drawer-side ul.menu')
      await expect(sidebar).toBeAttached()

      // Check for expected sidebar items
      const vegetablesLink = page.locator(
        '.drawer-side a[href*="/docs/vegetables"]',
      )
      await expect(vegetablesLink).toBeAttached()

      const harvestingLink = page.locator(
        '.drawer-side a[href*="/docs/harvesting"]',
      )
      await expect(harvestingLink).toBeAttached()
    })
  })

  test.describe('Secondary Docs at /en/guides', () => {
    test('renders guides at /en/guides route', async ({ page }) => {
      await page.goto('/en/guides/')
      await expect(page.locator('h1')).toContainText('Gardening Guides')
    })

    test('generates all guides routes correctly', async ({ page }) => {
      const routes = [
        '/en/guides/',
        '/en/guides/getting-started',
        '/en/guides/advanced-techniques',
      ]

      for (const route of routes) {
        const response = await page.goto(route)
        expect(response?.status()).toBe(200)
      }
    })

    test('sidebar shows guides entries', async ({ page }) => {
      await page.goto('/en/guides/')
      const sidebar = page.locator('.drawer-side ul.menu')
      await expect(sidebar).toBeAttached()

      // Check for expected sidebar items
      const gettingStartedLink = page.locator(
        '.drawer-side a[href*="/guides/getting-started"]',
      )
      await expect(gettingStartedLink).toBeAttached()

      const advancedLink = page.locator(
        '.drawer-side a[href*="/guides/advanced-techniques"]',
      )
      await expect(advancedLink).toBeAttached()
    })

    test('sidebar_position controls item order in guides', async ({ page }) => {
      await page.goto('/en/guides/')

      const sidebarLinks = page.locator('.drawer-side a[href*="/guides/"]')
      const hrefs: string[] = []
      const count = await sidebarLinks.count()
      for (let index = 0; index < count; index++) {
        const href = await sidebarLinks.nth(index).getAttribute('href')
        if (href) {
          hrefs.push(href)
        }
      }

      // index (position 1) should come before getting-started (position 2) and advanced-techniques (position 3)
      const indexPosition = hrefs.findIndex((href) => href.endsWith('/guides/'))
      const gettingStartedPosition = hrefs.findIndex((href) =>
        href.includes('getting-started'),
      )
      const advancedPosition = hrefs.findIndex((href) =>
        href.includes('advanced-techniques'),
      )

      expect(indexPosition).toBeLessThan(gettingStartedPosition)
      expect(gettingStartedPosition).toBeLessThan(advancedPosition)
    })
  })

  test.describe('Isolation Between Doc Instances', () => {
    test('docs sidebar does not contain guides entries', async ({ page }) => {
      await page.goto('/en/docs/')

      // Should NOT have guides entries in docs sidebar
      const guidesLink = page.locator(
        '.drawer-side a[href*="/guides/getting-started"]',
      )
      await expect(guidesLink).not.toBeAttached()
    })

    test('guides sidebar does not contain docs entries', async ({ page }) => {
      await page.goto('/en/guides/')

      // Should NOT have docs entries in guides sidebar
      const docsLink = page.locator('.drawer-side a[href*="/docs/vegetables"]')
      await expect(docsLink).not.toBeAttached()
    })
  })

  test.describe('Navigation Between Doc Instances', () => {
    test('can navigate from homepage to docs', async ({ page }) => {
      await page.goto('/en/')

      // Use the visible navigation link (on larger screens)
      const docsLink = page.locator(
        '.menu-horizontal a:has-text("Documentation")',
      )
      await expect(docsLink).toBeVisible()
      await docsLink.click()

      await expect(page).toHaveURL(/\/en\/docs/)
    })

    test('can navigate from homepage to guides', async ({ page }) => {
      await page.goto('/en/')

      const guidesLink = page.locator('.menu-horizontal a:has-text("Guides")')
      await expect(guidesLink).toBeVisible()
      await guidesLink.click()

      await expect(page).toHaveURL(/\/en\/guides/)
    })

    test('can navigate from docs to guides via top navigation', async ({
      page,
    }) => {
      await page.goto('/en/docs/')

      const guidesLink = page.locator('.menu-horizontal a:has-text("Guides")')
      await expect(guidesLink).toBeVisible()
      await guidesLink.click()

      await expect(page).toHaveURL(/\/en\/guides/)
    })

    test('can navigate from guides to docs via top navigation', async ({
      page,
    }) => {
      await page.goto('/en/guides/')

      const docsLink = page.locator(
        '.menu-horizontal a:has-text("Documentation")',
      )
      await expect(docsLink).toBeVisible()
      await docsLink.click()

      await expect(page).toHaveURL(/\/en\/docs/)
    })
  })

  test.describe('Active State in Sidebar', () => {
    test('active page is highlighted in docs sidebar', async ({ page }) => {
      await page.goto('/en/docs/vegetables')

      const activeLink = page.locator(
        '.drawer-side a[href*="/docs/vegetables"].font-medium.text-primary',
      )
      await expect(activeLink).toBeAttached()
    })

    test('active page is highlighted in guides sidebar', async ({ page }) => {
      await page.goto('/en/guides/getting-started')

      const activeLink = page.locator(
        '.drawer-side a[href*="/guides/getting-started"].font-medium.text-primary',
      )
      await expect(activeLink).toBeAttached()
    })
  })

  test.describe('SEO Features for Multiple Docs', () => {
    test('docs pages have correct title', async ({ page }) => {
      await page.goto('/en/docs/')
      // Title includes site name (Metro Gardens)
      await expect(page).toHaveTitle(/Metro Gardens/)
    })

    test('guides pages have correct title', async ({ page }) => {
      await page.goto('/en/guides/')
      await expect(page).toHaveTitle(/Gardening Guides|Metro Gardens/)
    })

    test('docs meta description is set', async ({ page }) => {
      await page.goto('/en/docs/')
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })

    test('guides meta description is set', async ({ page }) => {
      await page.goto('/en/guides/')
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })
  })
})
