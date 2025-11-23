import { expect, test } from '@playwright/test'

/**
 * Tests for Multiple Documentation Instances feature.
 * This tests the ability to have multiple docs at different route paths.
 */

test.describe('Multi-Docs Feature', () => {
  test.describe('Primary Docs at /docs', () => {
    test('renders documentation at /docs route', async ({ page }) => {
      await page.goto('/docs/')
      await expect(page.locator('h1')).toContainText('User Documentation')
    })

    test('generates all docs routes correctly', async ({ page }) => {
      const routes = ['/docs/', '/docs/installation', '/docs/configuration']

      for (const route of routes) {
        const response = await page.goto(route)
        expect(response?.status()).toBe(200)
      }
    })

    test('sidebar shows docs entries', async ({ page }) => {
      await page.goto('/docs/')
      const sidebar = page.locator('.drawer-side ul.menu')
      await expect(sidebar).toBeAttached()

      // Check for expected sidebar items
      const installationLink = page.locator(
        '.drawer-side a[href*="/docs/installation"]',
      )
      await expect(installationLink).toBeAttached()

      const configLink = page.locator(
        '.drawer-side a[href*="/docs/configuration"]',
      )
      await expect(configLink).toBeAttached()
    })

    test('sidebar_position controls item order in docs', async ({ page }) => {
      await page.goto('/docs/')

      const sidebarLinks = page.locator('.drawer-side a[href*="/docs/"]')
      const hrefs: string[] = []
      const count = await sidebarLinks.count()
      for (let index = 0; index < count; index++) {
        const href = await sidebarLinks.nth(index).getAttribute('href')
        if (href) {
          hrefs.push(href)
        }
      }

      // index (position 1) should come before installation (position 2) and configuration (position 3)
      const indexPosition = hrefs.findIndex((href) => href.endsWith('/docs/'))
      const installPosition = hrefs.findIndex((href) =>
        href.includes('installation'),
      )
      const configPosition = hrefs.findIndex((href) =>
        href.includes('configuration'),
      )

      expect(indexPosition).toBeLessThan(installPosition)
      expect(installPosition).toBeLessThan(configPosition)
    })
  })

  test.describe('Secondary Docs at /guides', () => {
    test('renders documentation at /guides route', async ({ page }) => {
      await page.goto('/guides/')
      await expect(page.locator('h1')).toContainText('Guides')
    })

    test('generates all guides routes correctly', async ({ page }) => {
      const routes = [
        '/guides/',
        '/guides/getting-started',
        '/guides/advanced-usage',
      ]

      for (const route of routes) {
        const response = await page.goto(route)
        expect(response?.status()).toBe(200)
      }
    })

    test('sidebar shows guides entries', async ({ page }) => {
      await page.goto('/guides/')
      const sidebar = page.locator('.drawer-side ul.menu')
      await expect(sidebar).toBeAttached()

      // Check for expected sidebar items
      const gettingStartedLink = page.locator(
        '.drawer-side a[href*="/guides/getting-started"]',
      )
      await expect(gettingStartedLink).toBeAttached()

      const advancedLink = page.locator(
        '.drawer-side a[href*="/guides/advanced-usage"]',
      )
      await expect(advancedLink).toBeAttached()
    })

    test('sidebar_position controls item order in guides', async ({ page }) => {
      await page.goto('/guides/')

      const sidebarLinks = page.locator('.drawer-side a[href*="/guides/"]')
      const hrefs: string[] = []
      const count = await sidebarLinks.count()
      for (let index = 0; index < count; index++) {
        const href = await sidebarLinks.nth(index).getAttribute('href')
        if (href) {
          hrefs.push(href)
        }
      }

      // index (position 1) should come before getting-started (position 2) and advanced-usage (position 3)
      const indexPosition = hrefs.findIndex((href) => href.endsWith('/guides/'))
      const gettingStartedPosition = hrefs.findIndex((href) =>
        href.includes('getting-started'),
      )
      const advancedPosition = hrefs.findIndex((href) =>
        href.includes('advanced-usage'),
      )

      expect(indexPosition).toBeLessThan(gettingStartedPosition)
      expect(gettingStartedPosition).toBeLessThan(advancedPosition)
    })
  })

  test.describe('Isolation Between Doc Instances', () => {
    test('docs sidebar does not contain guides entries', async ({ page }) => {
      await page.goto('/docs/')

      // Should NOT have guides entries in docs sidebar
      const guidesLink = page.locator(
        '.drawer-side a[href*="/guides/getting-started"]',
      )
      await expect(guidesLink).not.toBeAttached()
    })

    test('guides sidebar does not contain docs entries', async ({ page }) => {
      await page.goto('/guides/')

      // Should NOT have docs entries in guides sidebar
      const docsLink = page.locator(
        '.drawer-side a[href*="/docs/installation"]',
      )
      await expect(docsLink).not.toBeAttached()
    })
  })

  test.describe('Navigation Between Doc Instances', () => {
    test('can navigate from homepage to docs', async ({ page }) => {
      await page.goto('/')

      const docsLink = page.locator('nav a:has-text("User Docs")')
      await expect(docsLink).toBeAttached()
      await docsLink.click()

      await expect(page).toHaveURL(/\/docs/)
    })

    test('can navigate from homepage to guides', async ({ page }) => {
      await page.goto('/')

      const guidesLink = page.locator('nav a:has-text("Guides")')
      await expect(guidesLink).toBeAttached()
      await guidesLink.click()

      await expect(page).toHaveURL(/\/guides/)
    })

    test('can navigate from docs to guides via top navigation', async ({
      page,
    }) => {
      await page.goto('/docs/')

      const guidesLink = page.locator('nav a:has-text("Guides")')
      await expect(guidesLink).toBeAttached()
      await guidesLink.click()

      await expect(page).toHaveURL(/\/guides/)
    })

    test('can navigate from guides to docs via top navigation', async ({
      page,
    }) => {
      await page.goto('/guides/')

      const docsLink = page.locator('nav a:has-text("User Docs")')
      await expect(docsLink).toBeAttached()
      await docsLink.click()

      await expect(page).toHaveURL(/\/docs/)
    })
  })

  test.describe('Active State in Sidebar', () => {
    test('active page is highlighted in docs sidebar', async ({ page }) => {
      await page.goto('/docs/installation')

      const activeLink = page.locator(
        '.drawer-side a[href*="/docs/installation"].font-medium.text-primary',
      )
      await expect(activeLink).toBeAttached()
    })

    test('active page is highlighted in guides sidebar', async ({ page }) => {
      await page.goto('/guides/getting-started')

      const activeLink = page.locator(
        '.drawer-side a[href*="/guides/getting-started"].font-medium.text-primary',
      )
      await expect(activeLink).toBeAttached()
    })
  })

  test.describe('SEO Features for Multiple Docs', () => {
    test('docs pages have correct title', async ({ page }) => {
      await page.goto('/docs/')
      await expect(page).toHaveTitle(/User Documentation/)
    })

    test('guides pages have correct title', async ({ page }) => {
      await page.goto('/guides/')
      await expect(page).toHaveTitle(/Guides/)
    })

    test('docs meta description is set', async ({ page }) => {
      await page.goto('/docs/')
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })

    test('guides meta description is set', async ({ page }) => {
      await page.goto('/guides/')
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })
  })
})
