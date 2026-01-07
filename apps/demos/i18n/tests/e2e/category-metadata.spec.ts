import { expect, test } from '@playwright/test'

test.describe('Category Metadata', () => {
  test.describe('sidebar position ordering', () => {
    test('categories appear in correct order based on sidebar.position', async ({
      page,
    }) => {
      await page.goto('/en/docs')

      // Get all top-level sidebar items
      const sidebarItems = await page
        .locator('[data-testid="sidebar-local-nav"] > li')
        .allTextContents()

      // Sidebar Demo (position 0) should come before Always Open (position 1)
      // and Category Only (position 2)
      const sidebarDemoIndex = sidebarItems.findIndex((item) =>
        item.includes('Sidebar Demo'),
      )
      const alwaysOpenIndex = sidebarItems.findIndex((item) =>
        item.includes('Always Open'),
      )
      const categoryOnlyIndex = sidebarItems.findIndex((item) =>
        item.includes('Category Only'),
      )

      expect(sidebarDemoIndex).toBeLessThan(alwaysOpenIndex)
      expect(alwaysOpenIndex).toBeLessThan(categoryOnlyIndex)
    })

    test('sidebar items within category respect position ordering', async ({
      page,
    }) => {
      await page.goto('/en/docs/sidebar-demo')

      // Open the sidebar demo section if collapsed
      const sidebarDemo = page.locator(
        '[data-testid="sidebar-local-nav"] details:has-text("Sidebar Demo")',
      )
      await sidebarDemo.click()

      // Get child items - Custom Class (position 10) should come before Fancy Label (position 30)
      const childItems = await sidebarDemo.locator('ul li').allTextContents()

      const customClassIndex = childItems.findIndex((item) =>
        item.includes('Custom Class'),
      )
      const fancyLabelIndex = childItems.findIndex((item) =>
        item.includes('Fancy Label'),
      )

      expect(customClassIndex).toBeLessThan(fancyLabelIndex)
    })
  })

  test.describe('sidebar labels', () => {
    test('displays sidebar.label instead of title', async ({ page }) => {
      await page.goto('/en/docs')

      // The sidebar should show "Fancy Label" from sidebar.label, not "Custom Label Demo" from title
      const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
      await expect(sidebar).toContainText('Fancy Label')
    })
  })

  test.describe('collapsible categories', () => {
    test('collapsible category has toggle control', async ({ page }) => {
      await page.goto('/en/docs')

      // Sidebar Demo should be collapsible (has a <details> element)
      const sidebarDemo = page.locator(
        '[data-testid="sidebar-local-nav"] details:has-text("Sidebar Demo")',
      )
      await expect(sidebarDemo).toBeVisible()
    })

    test('non-collapsible category always shows children', async ({ page }) => {
      await page.goto('/en/docs')

      // "Always Open" section should NOT be wrapped in <details> since collapsible: false
      // Children should always be visible
      const alwaysOpenSection = page.locator(
        '[data-testid="sidebar-local-nav"] li:has-text("Always Open")',
      )
      await expect(alwaysOpenSection).toBeVisible()

      // The child page should be visible without any toggle
      const childPage = page.locator(
        '[data-testid="sidebar-local-nav"] a:has-text("Child Page")',
      )
      await expect(childPage).toBeVisible()
    })

    test('collapsed: false category starts expanded', async ({ page }) => {
      await page.goto('/en/docs')

      // Sidebar Demo has collapsed: false, so it should be open by default
      const sidebarDemo = page.locator(
        '[data-testid="sidebar-local-nav"] details:has-text("Sidebar Demo")',
      )
      await expect(sidebarDemo).toHaveAttribute('open', '')
    })

    test('toggle interaction expands/collapses children', async ({ page }) => {
      await page.goto('/en/docs')

      // Find a collapsible category (Category Only should be collapsed by default)
      const categoryOnly = page.locator(
        '[data-testid="sidebar-local-nav"] details:has-text("Category Only")',
      )

      // Toggle the category open
      const summary = categoryOnly.locator('summary')
      await summary.click()

      // After click, it should be open
      await expect(categoryOnly).toHaveAttribute('open', '')

      // Click again to collapse
      await summary.click()

      // Now should be closed
      const isOpenAfterSecondClick = await categoryOnly.getAttribute('open')
      expect(isOpenAfterSecondClick).toBeNull()
    })

    test('active page parent category is expanded', async ({ page }) => {
      // Navigate to a nested page
      await page.goto('/en/docs/sidebar-demo/custom-class')

      // The parent category (Sidebar Demo) should be automatically expanded
      const sidebarDemo = page.locator(
        '[data-testid="sidebar-local-nav"] details:has-text("Sidebar Demo")',
      )
      await expect(sidebarDemo).toHaveAttribute('open', '')
    })
  })

  test.describe('className styling', () => {
    test('sidebar.className is applied to sidebar item', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo')

      // Custom Class page has className: font-bold text-warning
      const customClassLink = page.locator(
        '[data-testid="sidebar-local-nav"] a:has-text("Custom Class")',
      )

      // Check that the parent li has the custom class
      const parentLi = customClassLink.locator('..')
      await expect(parentLi).toHaveClass(/font-bold/)
      await expect(parentLi).toHaveClass(/text-warning/)
    })
  })
})
