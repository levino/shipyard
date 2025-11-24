import { expect, test } from '@playwright/test'

/**
 * Tests for Cross-Plugin features marked as "supported" in the
 * Docusaurus Feature Parity Roadmap.
 *
 * These tests cover features that span multiple plugins including
 * navigation, i18n, theming, and styling.
 */

test.describe('Cross-Plugin Features', () => {
  test.describe('Navigation & UI', () => {
    test('global navigation bar is present', async ({ page }) => {
      await page.goto('/en')

      const navbar = page.locator('.navbar')
      await expect(navbar).toBeAttached()
    })

    test.describe('Mobile hamburger menu', () => {
      test.use({ viewport: { width: 375, height: 667 } })

      test('hamburger button is visible on mobile', async ({ page }) => {
        await page.goto('/en')

        // Look for the drawer toggle label (hamburger button) - use first() since there may be multiple
        const hamburger = page.locator('label[for="drawer"]').first()
        await expect(hamburger).toBeVisible()
      })

      test('clicking hamburger opens sidebar', async ({ page }) => {
        await page.goto('/en/docs/')

        // Click hamburger to open drawer
        const hamburger = page.locator('label[for="drawer"]').first()
        await hamburger.click()

        // Sidebar should become visible
        const sidebar = page.locator('.drawer-side')
        await expect(sidebar).toBeVisible()
      })
    })

    test('breadcrumbs are displayed', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const breadcrumbs = page.locator('.breadcrumbs')
      await expect(breadcrumbs).toBeAttached()
    })

    test('table of contents is displayed', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/en/docs/garden-beds')

      // Desktop TOC
      const toc = page.locator('.hidden.xl\\:block.col-span-3')
      await expect(toc).toBeVisible()
    })
  })

  test.describe('i18n Support', () => {
    test('locale switching works', async ({ page }) => {
      await page.goto('/en/docs/')
      await expect(page.locator('body')).toBeVisible()

      await page.goto('/de/docs/')
      await expect(page.locator('body')).toBeVisible()
    })

    test('navigation links include locale prefix', async ({ page }) => {
      await page.goto('/de/blog')

      // Look for navigation link with locale prefix in navbar
      const docsLink = page.locator(
        'nav a[href="/de/docs"], .navbar a[href="/de/docs"]',
      )
      await expect(docsLink).toBeVisible()
    })
  })

  test.describe('Theming & Styling', () => {
    test('Tailwind CSS classes are applied', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // Check for Tailwind utility classes
      const boldElement = page.locator('.font-bold').first()
      await expect(boldElement).toBeAttached()
    })

    test('DaisyUI components are used', async ({ page }) => {
      await page.goto('/en/docs/')

      // Check for DaisyUI drawer component
      const drawer = page.locator('.drawer')
      await expect(drawer).toBeAttached()

      // Check for DaisyUI menu component (use first since there are multiple menus)
      const menu = page.locator('.menu').first()
      await expect(menu).toBeAttached()
    })

    test('prose styling is applied to content', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      // Prose class is typically applied to content areas
      const content = page.locator('.prose')
      await expect(content).toBeAttached()
    })

    test('responsive design works', async ({ page }) => {
      // Test desktop
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/en/docs/')
      const desktopSidebar = page.locator('.drawer-side')
      await expect(desktopSidebar).toBeVisible()

      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/docs/')
      // On mobile, drawer is hidden by default but can be opened
      const mobileDrawer = page.locator('.drawer')
      await expect(mobileDrawer).toBeAttached()
    })

    test('custom CSS class via frontmatter works', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // sidebar_class_name: "font-bold text-warning" should be applied
      const customClassItem = page.locator(
        '.drawer-side li.font-bold.text-warning',
      )
      await expect(customClassItem).toBeAttached()
    })
  })
})
