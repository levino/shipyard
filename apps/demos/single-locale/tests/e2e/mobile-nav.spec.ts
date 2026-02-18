import { expect, test } from '@playwright/test'

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('sidebar extends to full viewport height', async ({ page }) => {
    await page.goto('/')

    // Open the mobile drawer
    await page.click('label[for="drawer"]')

    const sidebar = page.locator('[data-testid="sidebar-navigation"]')
    await expect(sidebar).toBeVisible()

    const box = await sidebar.boundingBox()
    expect(box).toBeTruthy()
    expect(box?.height).toBeGreaterThanOrEqual(667)
  })
})
