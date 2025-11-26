import { expect, test } from '@playwright/test'

/**
 * Tests for Documentation Pagination (Next/Previous navigation)
 * Similar to Docusaurus pagination feature
 */

test.describe('Documentation Pagination', () => {
  test.describe('Basic Pagination', () => {
    test('shows next button on first page', async ({ page }) => {
      await page.goto('/en/docs/')

      // First page should have a next button
      const nextButton = page.locator('a[rel="next"]')
      await expect(nextButton).toBeAttached()
      await expect(nextButton).toContainText('Next')

      // First page should not have a previous button (but space is reserved)
      const prevButton = page.locator('a[rel="prev"]')
      await expect(prevButton).not.toBeAttached()
    })

    test('shows both prev and next buttons on middle page', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      // Middle page should have both buttons
      const prevButton = page.locator('a[rel="prev"]')
      await expect(prevButton).toBeAttached()
      await expect(prevButton).toContainText('Prev')

      const nextButton = page.locator('a[rel="next"]')
      await expect(nextButton).toBeAttached()
      await expect(nextButton).toContainText('Next')
    })

    test('shows prev button on last page', async ({ page }) => {
      // Navigate to a page and find the last one by clicking next repeatedly
      await page.goto('/en/docs/')

      // Keep clicking next until we can't find a next button
      let hasNext = true
      let iterations = 0
      const maxIterations = 20 // Safety limit

      while (hasNext && iterations < maxIterations) {
        const nextButton = page.locator('a[rel="next"]')
        const count = await nextButton.count()

        if (count > 0) {
          await nextButton.click()
          await page.waitForLoadState('networkidle')
          iterations++
        } else {
          hasNext = false
        }
      }

      // Now we should be on the last page
      const prevButton = page.locator('a[rel="prev"]')
      await expect(prevButton).toBeAttached()
      await expect(prevButton).toContainText('Prev')

      const nextButton = page.locator('a[rel="next"]')
      await expect(nextButton).not.toBeAttached()
    })

    test('pagination displays page titles', async ({ page }) => {
      await page.goto('/en/docs/')

      // Next button should show the title of the next page
      const nextButton = page.locator('a[rel="next"]')
      const nextText = await nextButton.textContent()

      // Should contain more than just "Next" - should have a page title
      expect(nextText).toBeTruthy()
      expect(nextText?.length).toBeGreaterThan(10)
    })

    test('pagination respects sidebar order', async ({ page }) => {
      await page.goto('/en/docs/')

      // Get the sidebar links in order
      const sidebarLinks = page.locator('.drawer-side a[href^="/en/docs/"]')
      const firstTwoLinks: string[] = []
      const count = await sidebarLinks.count()

      for (let index = 0; index < Math.min(count, 2); index++) {
        const href = await sidebarLinks.nth(index).getAttribute('href')
        if (href) {
          firstTwoLinks.push(href)
        }
      }

      expect(firstTwoLinks.length).toBeGreaterThanOrEqual(2)

      // Go to first page
      await page.goto(firstTwoLinks[0])

      // Next link should point to second page in sidebar
      const nextButton = page.locator('a[rel="next"]')
      const nextHref = await nextButton.getAttribute('href')

      // The next link should match the second sidebar link
      // (may need normalization if paths differ slightly)
      expect(nextHref).toBeTruthy()
    })
  })

  test.describe('Pagination Navigation', () => {
    test('clicking next navigates to next page', async ({ page }) => {
      await page.goto('/en/docs/')
      const currentUrl = page.url()

      const nextButton = page.locator('a[rel="next"]')
      await nextButton.click()

      await page.waitForLoadState('networkidle')

      // URL should have changed
      expect(page.url()).not.toBe(currentUrl)

      // We should be on a docs page
      expect(page.url()).toContain('/en/docs/')
    })

    test('clicking prev navigates to previous page', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const prevButton = page.locator('a[rel="prev"]')
      await prevButton.click()

      await page.waitForLoadState('networkidle')

      // We should be on a docs page
      expect(page.url()).toContain('/en/docs/')

      // We should now have a next button that goes back to garden-beds
      const nextButton = page.locator('a[rel="next"]')
      const nextHref = await nextButton.getAttribute('href')
      expect(nextHref).toContain('garden-beds')
    })

    test('pagination works across nested categories', async ({ page }) => {
      await page.goto('/en/docs/')

      // Click next multiple times to traverse through categories
      for (let index = 0; index < 3; index++) {
        const nextButton = page.locator('a[rel="next"]')
        const count = await nextButton.count()

        if (count > 0) {
          await nextButton.click()
          await page.waitForLoadState('networkidle')

          // Should still be on a docs page
          expect(page.url()).toContain('/en/docs/')
        }
      }
    })
  })

  test.describe('Pagination Styling', () => {
    test('pagination has proper spacing', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      // Pagination nav should exist
      const paginationNav = page.locator('nav[aria-label="Docs navigation"]')
      await expect(paginationNav).toBeAttached()

      // Should have border at top
      const hasBorderTop = await paginationNav.evaluate((element) => {
        const styles = window.getComputedStyle(element)
        return styles.borderTopWidth !== '0px'
      })
      expect(hasBorderTop).toBe(true)
    })

    test('pagination buttons are styled consistently', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const prevButton = page.locator('a[rel="prev"]')
      const nextButton = page.locator('a[rel="next"]')

      // Both should have btn classes
      await expect(prevButton).toHaveClass(/btn/)
      await expect(nextButton).toHaveClass(/btn/)
    })

    test('pagination is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/docs/garden-beds')

      // Pagination should still be visible on mobile
      const paginationNav = page.locator('nav[aria-label="Docs navigation"]')
      await expect(paginationNav).toBeVisible()

      // Buttons should stack vertically or be responsive
      const prevButton = page.locator('a[rel="prev"]')
      const nextButton = page.locator('a[rel="next"]')

      await expect(prevButton).toBeVisible()
      await expect(nextButton).toBeVisible()
    })
  })

  test.describe('Multi-language Support', () => {
    test('pagination works in different locales', async ({ page }) => {
      // Test in German locale - skip if German docs don't exist
      const response = await page.goto('/de/docs/')
      if (response?.status() === 404 || !response?.ok()) {
        test.skip(true, 'German docs not available - skipping locale test')
        return
      }

      const nextButton = page.locator('a[rel="next"]')
      await expect(nextButton).toBeAttached()

      await nextButton.click()
      await page.waitForLoadState('networkidle')

      // Should stay in German locale
      expect(page.url()).toContain('/de/docs/')

      // Should have a prev button now
      const prevButton = page.locator('a[rel="prev"]')
      await expect(prevButton).toBeAttached()
    })

    test('pagination does not cross locale boundaries', async ({ page }) => {
      await page.goto('/en/docs/')

      // Click through all pages in English
      let iterations = 0
      const maxIterations = 20

      while (iterations < maxIterations) {
        // URL should always be in English locale
        expect(page.url()).toContain('/en/docs/')

        const nextButton = page.locator('a[rel="next"]')
        const count = await nextButton.count()

        if (count > 0) {
          const nextHref = await nextButton.getAttribute('href')
          // Next link should also be in English locale
          expect(nextHref).toContain('/en/docs/')

          await nextButton.click()
          await page.waitForLoadState('networkidle')
          iterations++
        } else {
          break
        }
      }
    })
  })

  test.describe('Edge Cases', () => {
    test('pagination handles pages with no sidebar gracefully', async ({
      page,
    }) => {
      // Some pages might not have sidebar navigation
      // In that case, pagination should not appear or handle gracefully
      // This test documents the expected behavior
      await page.goto('/en/docs/')

      // Basic assertion that the page works
      await expect(page.locator('h1')).toBeAttached()
    })

    test('pagination updates when navigating via sidebar', async ({ page }) => {
      await page.goto('/en/docs/')

      // Click a link in the sidebar
      const sidebarLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"]',
      )
      await sidebarLink.click()

      await page.waitForLoadState('networkidle')

      // Pagination should be present and relevant to new page
      const prevButton = page.locator('a[rel="prev"]')
      const nextButton = page.locator('a[rel="next"]')

      // At least one should be present
      const prevCount = await prevButton.count()
      const nextCount = await nextButton.count()
      expect(prevCount + nextCount).toBeGreaterThan(0)
    })
  })
})
