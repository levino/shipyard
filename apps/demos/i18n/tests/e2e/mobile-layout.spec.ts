import { expect, test } from '@playwright/test'

test.describe('Mobile Layout', () => {
  test.describe('Horizontal Scrolling Prevention', () => {
    test.use({ viewport: { width: 375, height: 667 } })

    test('no horizontal scrolling on mobile docs pages', async ({ page }) => {
      await page.goto('/en/docs/')

      const drawerContent = page.locator('.drawer-content').first()
      const scrollWidth = await drawerContent.evaluate(
        (element) => element.scrollWidth,
      )
      const clientWidth = await drawerContent.evaluate(
        (element) => element.clientWidth,
      )

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })

    test('no horizontal scrolling on pages with long content', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      const drawerContent = page.locator('.drawer-content').first()
      const scrollWidth = await drawerContent.evaluate(
        (element) => element.scrollWidth,
      )
      const clientWidth = await drawerContent.evaluate(
        (element) => element.clientWidth,
      )

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })

    test('no horizontal scrolling on blog pages', async ({ page }) => {
      await page.goto('/en/blog/')

      const drawerContent = page.locator('.drawer-content').first()
      const scrollWidth = await drawerContent.evaluate(
        (element) => element.scrollWidth,
      )
      const clientWidth = await drawerContent.evaluate(
        (element) => element.clientWidth,
      )

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })

    test('drawer-content has overflow-x-hidden style', async ({ page }) => {
      await page.goto('/en/docs/')

      const drawerContent = page.locator('.drawer-content').first()
      const overflowX = await drawerContent.evaluate(
        (element) => window.getComputedStyle(element).overflowX,
      )

      expect(overflowX).toBe('hidden')
    })
  })
})
