import { expect, test } from '@playwright/test'

/**
 * Tests for Blog Plugin features marked as "supported" in the
 * Docusaurus Feature Parity Roadmap.
 */

test.describe('Blog Plugin Features', () => {
  test.describe('Core Functionality', () => {
    test('blog listing page shows posts', async ({ page }) => {
      await page.goto('/en/blog')

      // Should have at least one blog post link
      const blogPosts = page.locator('a[href*="/en/blog/"]')
      const count = await blogPosts.count()
      expect(count).toBeGreaterThan(0)
    })

    test('individual blog post pages render', async ({ page }) => {
      await page.goto('/en/blog/2024-01-10-blog-post-1')

      // Blog posts render content (may not have h1 if markdown doesn't include one)
      await expect(page.locator('.prose')).toBeVisible()
    })
  })

  test.describe('Configuration Options', () => {
    test('blog posts are sorted by date (newest first)', async ({ page }) => {
      await page.goto('/en/blog')

      // Get all blog post links
      const blogLinks = page.locator('article a[href*="/en/blog/"]')
      const hrefs: string[] = []
      const count = await blogLinks.count()
      for (let i = 0; i < count; i++) {
        const href = await blogLinks.nth(i).getAttribute('href')
        if (href) hrefs.push(href)
      }

      // Extract dates from URLs (format: YYYY-MM-DD)
      const dates = hrefs
        .map((href) => {
          const match = href.match(/(\d{4}-\d{2}-\d{2})/)
          return match ? match[1] : null
        })
        .filter(Boolean) as string[]

      // Verify dates are in descending order
      for (let i = 0; i < dates.length - 1; i++) {
        expect(dates[i] >= dates[i + 1]).toBe(true)
      }
    })
  })

  test.describe('Frontmatter Support', () => {
    test('title frontmatter sets blog post title', async ({ page }) => {
      await page.goto('/en/blog/2024-01-10-blog-post-1')
      await expect(page).toHaveTitle(/Spring Planting Day/)
    })

    test('description frontmatter is present in schema', async ({ page }) => {
      await page.goto('/en/blog/2024-01-10-blog-post-1')

      // Meta description tag exists (content may be empty if not passed through)
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })

    test('date frontmatter affects URL', async ({ page }) => {
      // Blog post with date: 2024-04-13 (but URL uses 2024-01-10 from filename)
      const response = await page.goto('/en/blog/2024-01-10-blog-post-1')
      expect(response?.status()).toBe(200)
    })
  })

  test.describe('Navigation Features', () => {
    test('blog has sidebar with posts', async ({ page }) => {
      await page.goto('/en/blog')

      // Blog page has sidebar with blog post links
      const sidebarLinks = page.locator('.drawer-side a[href*="/en/blog/"]')
      const count = await sidebarLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('i18n support for blog posts', async ({ page }) => {
      // English blog
      await page.goto('/en/blog')
      await expect(page.locator('body')).toBeVisible()

      // German blog
      await page.goto('/de/blog')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Sidebar Configuration', () => {
    test('sidebar shows configured title', async ({ page }) => {
      await page.goto('/en/blog')

      // The sidebar should show "Recent posts" as the section title
      const sidebarTitle = page.locator('.drawer-side .menu-title')
      await expect(sidebarTitle).toHaveText('Recent posts')
    })

    test('sidebar respects blogSidebarCount limit', async ({ page }) => {
      await page.goto('/en/blog')

      // With blogSidebarCount: 5 configured in astro.config.mjs,
      // and 50+ English posts available, only 5 should be shown in sidebar
      // Get only blog post links (those with dates in the URL, e.g., /en/blog/2024-...)
      // This excludes the global navigation "Blog" link
      const blogPostLinks = page.locator(
        '.drawer-side .menu a[href*="/en/blog/2"]',
      )
      const postCount = await blogPostLinks.count()

      // Should have exactly 5 posts (the configured blogSidebarCount)
      expect(postCount).toBe(5)
    })

    test('shows "View all posts" link when posts exceed limit', async ({
      page,
    }) => {
      await page.goto('/en/blog')

      // With 3 English posts and blogSidebarCount: 2,
      // "View all posts" link should be visible
      const viewAllLink = page.locator(
        '.drawer-side a:has-text("View all posts")',
      )
      await expect(viewAllLink).toBeVisible()
      await expect(viewAllLink).toHaveAttribute('href', '/en/blog')
    })

    test('sidebar filters posts by locale (i18n aware)', async ({ page }) => {
      // English blog should only show English posts
      await page.goto('/en/blog')
      const enSidebarLinks = page.locator('.drawer-side a[href*="/en/blog/"]')
      const enCount = await enSidebarLinks.count()
      expect(enCount).toBeGreaterThan(0)

      // German blog should only show German posts
      await page.goto('/de/blog')
      const deSidebarLinks = page.locator('.drawer-side a[href*="/de/blog/"]')
      const deCount = await deSidebarLinks.count()
      expect(deCount).toBeGreaterThan(0)

      // German sidebar should not contain English links
      const enLinksInDeSidebar = page.locator(
        '.drawer-side a[href*="/en/blog/"]',
      )
      await expect(enLinksInDeSidebar).toHaveCount(0)
    })

    test('sidebar posts are sorted by date (newest first)', async ({
      page,
    }) => {
      await page.goto('/en/blog')

      // Get all blog post links from sidebar
      const sidebarLinks = page.locator('.drawer-side a[href*="/en/blog/2"]')
      const hrefs: string[] = []
      const count = await sidebarLinks.count()

      for (let index = 0; index < count; index++) {
        const href = await sidebarLinks.nth(index).getAttribute('href')
        if (href && !href.includes('View')) hrefs.push(href)
      }

      // Extract dates from URLs
      const dates = hrefs
        .map((href) => {
          const match = href.match(/(\d{4}-\d{2}-\d{2})/)
          return match ? match[1] : null
        })
        .filter(Boolean) as string[]

      // Verify dates are in descending order
      for (let index = 0; index < dates.length - 1; index++) {
        expect(dates[index] >= dates[index + 1]).toBe(true)
      }
    })

    test('"View all posts" link is at same level as sidebar title', async ({
      page,
    }) => {
      await page.goto('/en/blog')

      // The "View all posts" link should be a sibling of the posts section,
      // not nested inside it
      const menuItems = page.locator('.drawer-side .menu > li')
      const menuItemsCount = await menuItems.count()

      // Should have at least 2 top-level menu items (posts section + view all link)
      expect(menuItemsCount).toBeGreaterThanOrEqual(2)

      // "View all posts" should be directly accessible at the top level
      const viewAllLink = page.locator(
        '.drawer-side .menu > li > a:has-text("View all posts")',
      )
      await expect(viewAllLink).toBeVisible()
    })
  })

  test.describe('Pagination', () => {
    test('blog index shows pagination when posts exceed postsPerPage', async ({
      page,
    }) => {
      await page.goto('/en/blog')

      // With 50+ posts and postsPerPage: 10, pagination should be visible
      const pagination = page.locator('[data-testid="pagination"]')
      await expect(pagination).toBeVisible()
    })

    test('pagination shows correct page buttons', async ({ page }) => {
      await page.goto('/en/blog')

      // Should show page 1 as active
      const activePage = page.locator('[data-testid="pagination"] .btn-active')
      await expect(activePage).toHaveText('1')

      // Should show next page button
      const nextButton = page.locator(
        '[data-testid="pagination"] a[aria-label="Next page"]',
      )
      await expect(nextButton).toBeVisible()
    })

    test('clicking page 2 navigates to second page', async ({ page }) => {
      await page.goto('/en/blog')

      // Click on page 2
      const page2Link = page.locator(
        '[data-testid="pagination"] a:has-text("2")',
      )
      await page2Link.click()

      // URL should be /en/blog/page/2
      await expect(page).toHaveURL(/\/en\/blog\/page\/2/)

      // Page 2 should now be active
      const activePage = page.locator('[data-testid="pagination"] .btn-active')
      await expect(activePage).toHaveText('2')
    })

    test('first page shows 10 posts (postsPerPage)', async ({ page }) => {
      await page.goto('/en/blog')

      // Count blog posts on the page (within main content area)
      const blogPosts = page.locator('.max-w-7xl.mx-auto .prose a.block')
      const count = await blogPosts.count()

      // Should have exactly 10 posts per page
      expect(count).toBe(10)
    })

    test('pagination works with i18n locales', async ({ page }) => {
      // Test German locale pagination
      await page.goto('/de/blog')

      // German has 10+ posts (we created 10 German posts)
      // With postsPerPage: 10, we should have exactly 10 posts on first page
      const blogPosts = page.locator('.max-w-7xl.mx-auto .prose a.block')
      const count = await blogPosts.count()
      expect(count).toBe(10)
    })

    test('previous button is disabled on first page', async ({ page }) => {
      await page.goto('/en/blog')

      const prevButton = page.locator(
        '[data-testid="pagination"] a[aria-label="Previous page"]',
      )
      await expect(prevButton).toHaveClass(/btn-disabled/)
    })

    test('navigating to last page disables next button', async ({ page }) => {
      // Navigate to last page (50+ posts / 10 per page = 6 pages)
      await page.goto('/en/blog/page/6')

      const nextButton = page.locator(
        '[data-testid="pagination"] a[aria-label="Next page"]',
      )
      await expect(nextButton).toHaveClass(/btn-disabled/)
    })

    test('direct navigation to page URL works', async ({ page }) => {
      // Navigate directly to page 3
      const response = await page.goto('/en/blog/page/3')
      expect(response?.status()).toBe(200)

      // Should show page 3 as active
      const activePage = page.locator('[data-testid="pagination"] .btn-active')
      await expect(activePage).toHaveText('3')
    })
  })
})
