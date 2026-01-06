import { expect, test } from '@playwright/test'

/**
 * Tests for Blog Sidebar Configuration features.
 * This demo is configured with:
 * - blogSidebarCount: 'ALL'
 * - blogSidebarTitle: 'All posts'
 */

test.describe('Blog Sidebar Configuration', () => {
  test('sidebar shows configured title', async ({ page }) => {
    await page.goto('/blog')

    // The sidebar should show "All posts" as configured
    const sidebarTitle = page.locator(
      '[data-testid="sidebar-local-nav"] .menu-title',
    )
    await expect(sidebarTitle).toHaveText('All posts')
  })

  test('sidebar shows all posts when blogSidebarCount is ALL', async ({
    page,
  }) => {
    await page.goto('/blog')

    // With blogSidebarCount: 'ALL', all 3 posts should be shown
    const blogPostLinks = page.locator(
      '[data-testid="sidebar-local-nav"] a[href*="/blog/2"]',
    )
    const postCount = await blogPostLinks.count()

    // Should have all 3 posts
    expect(postCount).toBe(3)
  })

  test('does not show "View all posts" link when all posts are displayed', async ({
    page,
  }) => {
    await page.goto('/blog')

    // With blogSidebarCount: 'ALL', there should be no "View all posts" link
    const viewAllLink = page.locator(
      '[data-testid="sidebar-local-nav"] a:has-text("View all posts")',
    )
    await expect(viewAllLink).not.toBeVisible()
  })

  test('sidebar posts are sorted by date (newest first)', async ({ page }) => {
    await page.goto('/blog')

    // Get all blog post links from sidebar local nav section
    const sidebarLinks = page.locator(
      '[data-testid="sidebar-local-nav"] a[href*="/blog/2"]',
    )
    const hrefs: string[] = []
    const count = await sidebarLinks.count()

    for (let index = 0; index < count; index++) {
      const href = await sidebarLinks.nth(index).getAttribute('href')
      if (href) hrefs.push(href)
    }

    // Extract dates from URLs
    const dates = hrefs
      .map((href) => {
        const match = href.match(/(\d{4}-\d{2}-\d{2})/)
        return match ? match[1] : null
      })
      .filter(Boolean) as string[]

    // Verify dates are in descending order (newest first)
    for (let index = 0; index < dates.length - 1; index++) {
      expect(dates[index] >= dates[index + 1]).toBe(true)
    }
  })
})
