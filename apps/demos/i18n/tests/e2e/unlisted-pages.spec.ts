import { expect, test } from '@playwright/test'

test.describe('Non-Rendered Pages (render: false)', () => {
  test('sidebar entry exists for render: false category', async ({ page }) => {
    await page.goto('/en/docs')

    // "Category Only" should appear in the sidebar
    const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
    await expect(sidebar).toContainText('Category Only')
  })

  test('render: false category entry is not clickable', async ({ page }) => {
    await page.goto('/en/docs')

    // Find the Category Only entry - it should be a span, not a link
    // Since it's a category with children, it might be in a details/summary
    const categoryLabel = page.locator(
      '[data-testid="sidebar-local-nav"] summary:has-text("Category Only"), [data-testid="sidebar-local-nav"] span.menu-title:has-text("Category Only")',
    )
    await expect(categoryLabel).toBeVisible()

    // There should be no <a> tag with href for the category itself
    const categoryLink = page.locator(
      '[data-testid="sidebar-local-nav"] a[href="/en/docs/category-only"]',
    )
    await expect(categoryLink).not.toBeVisible()
  })

  test('navigating to render: false URL returns 404', async ({ page }) => {
    // Try to navigate to the category URL directly
    const response = await page.goto('/en/docs/category-only')

    // Should return 404
    expect(response?.status()).toBe(404)
  })

  test('child pages of render: false category are accessible', async ({
    page,
  }) => {
    // The child page should be accessible
    await page.goto('/en/docs/category-only/about-this-category')

    // Page should load successfully
    await expect(page.locator('h1')).toContainText('About This Category')
  })

  test('category metadata still applies to render: false categories', async ({
    page,
  }) => {
    await page.goto('/en/docs')

    // The category should have its label "Category Only" from sidebar.label
    const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
    await expect(sidebar).toContainText('Category Only')

    // And it should be in the correct position (after Always Open which is position 1)
    const sidebarItems = await page
      .locator('[data-testid="sidebar-local-nav"] > li')
      .allTextContents()

    const alwaysOpenIndex = sidebarItems.findIndex((item) =>
      item.includes('Always Open'),
    )
    const categoryOnlyIndex = sidebarItems.findIndex((item) =>
      item.includes('Category Only'),
    )

    expect(alwaysOpenIndex).toBeLessThan(categoryOnlyIndex)
  })
})

test.describe('Unlisted Pages (unlisted: true)', () => {
  test('unlisted page renders at direct URL', async ({ page }) => {
    // Navigate directly to the unlisted page
    await page.goto('/en/docs/sidebar-demo/unlisted-page')

    // Page should load successfully
    await expect(page.locator('h1')).toContainText('Unlisted Page')
  })

  test('unlisted page is not visible in sidebar', async ({ page }) => {
    await page.goto('/en/docs/sidebar-demo')

    // Expand the sidebar demo section if needed
    const sidebarDemo = page.locator(
      '[data-testid="sidebar-local-nav"] details:has-text("Sidebar Demo")',
    )
    if (await sidebarDemo.isVisible()) {
      if (!(await sidebarDemo.getAttribute('open'))) {
        await sidebarDemo.click()
      }
    }

    // The unlisted page should NOT appear in the sidebar
    const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
    await expect(sidebar).not.toContainText('Unlisted Page')
  })

  test('unlisted page does not appear in pagination', async ({ page }) => {
    // Navigate to a page adjacent to where the unlisted page would be
    await page.goto('/en/docs/sidebar-demo/pagination-demo')

    // Get the pagination links
    const paginationPrev = page.locator(
      '[data-testid="pagination-prev"], a:has-text("Previous")',
    )
    const paginationNext = page.locator(
      '[data-testid="pagination-next"], a:has-text("Next")',
    )

    // The unlisted page should not appear as prev or next
    if (await paginationPrev.isVisible()) {
      await expect(paginationPrev).not.toContainText('Unlisted Page')
    }
    if (await paginationNext.isVisible()) {
      await expect(paginationNext).not.toContainText('Unlisted Page')
    }
  })

  test('unlisted page content is accessible', async ({ page }) => {
    await page.goto('/en/docs/sidebar-demo/unlisted-page')

    // Verify the page content is rendered correctly
    await expect(
      page.locator('h2:has-text("What does unlisted mean?")'),
    ).toBeVisible()
    await expect(page.locator('text=does not appear')).toBeVisible()
  })
})
