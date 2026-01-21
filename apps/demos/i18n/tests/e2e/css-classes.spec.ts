import { expect, test } from '@playwright/test'

test.describe('CSS Classes from Shipyard Packages', () => {
  test.describe('DaisyUI Layout Classes', () => {
    test('drawer class is present and styled', async ({ page }) => {
      await page.goto('/en/docs/')

      const drawer = page.locator('.drawer').first()
      await expect(drawer).toBeVisible()

      // Verify drawer has expected DaisyUI styles applied
      const display = await drawer.evaluate(
        (el) => window.getComputedStyle(el).display,
      )
      expect(display).toBe('grid')
    })

    test('drawer-content class is present and styled', async ({ page }) => {
      await page.goto('/en/docs/')

      const drawerContent = page.locator('.drawer-content').first()
      await expect(drawerContent).toBeVisible()
    })

    test('menu class is present in sidebar', async ({ page }) => {
      await page.goto('/en/docs/')

      const menu = page.locator('.menu').first()
      await expect(menu).toBeVisible()

      // Verify menu has DaisyUI styles
      const display = await menu.evaluate(
        (el) => window.getComputedStyle(el).display,
      )
      expect(display).toBe('flex')
    })
  })

  test.describe('Shipyard Component Classes', () => {
    test('admonition classes are present', async ({ page }) => {
      // Navigate to a page with admonitions
      await page.goto('/en/docs/feature/')

      const admonition = page.locator('.admonition').first()
      await expect(admonition).toBeVisible()
    })

    test('shipyard-tabs class is present on tabbed content', async ({
      page,
    }) => {
      await page.goto('/en/docs/feature/')

      const tabs = page.locator('.shipyard-tabs').first()
      await expect(tabs).toBeVisible()
    })
  })

  test.describe('Blog Page Classes', () => {
    test('blog pages have proper layout classes', async ({ page }) => {
      await page.goto('/en/blog/')

      // Check drawer layout is present on blog
      const drawer = page.locator('.drawer').first()
      await expect(drawer).toBeVisible()
    })
  })

  test.describe('Tailwind Utility Classes', () => {
    test('prose class is applied to content', async ({ page }) => {
      await page.goto('/en/docs/')

      const prose = page.locator('.prose').first()
      await expect(prose).toBeVisible()
    })
  })
})
