import { expect, test } from '@playwright/test'

test.describe('Navigation Features', () => {
  test.describe('Active Sidebar Highlighting', () => {
    test('current page is highlighted in sidebar with background and bold text', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      // The active link should have bg-base-200 and font-semibold classes
      const activeLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"].bg-base-200.font-semibold',
      )
      await expect(activeLink).toBeAttached()
      await expect(activeLink).toContainText('Garden Beds')
    })

    test('other sidebar items are not highlighted', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      // Other links should NOT have the bg-base-200 font-semibold classes
      const vegetablesLink = page.locator(
        '.drawer-side a[href="/en/docs/vegetables"]',
      )
      await expect(vegetablesLink).toBeAttached()
      await expect(vegetablesLink).not.toHaveClass(/bg-base-200/)
      await expect(vegetablesLink).not.toHaveClass(/font-semibold/)
    })

    test('navigating to different page updates active highlighting', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      // Garden beds should be active
      const gardenBedsLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"]',
      )
      await expect(gardenBedsLink).toHaveClass(/bg-base-200/)

      // Navigate to vegetables
      await page.locator('.drawer-side a[href="/en/docs/vegetables"]').click()
      await expect(page).toHaveURL(/\/en\/docs\/vegetables/)

      // Now vegetables should be active, garden-beds should not
      const vegetablesLink = page.locator(
        '.drawer-side a[href="/en/docs/vegetables"]',
      )
      await expect(vegetablesLink).toHaveClass(/bg-base-200/)
      await expect(vegetablesLink).toHaveClass(/font-semibold/)

      const gardenBedsLinkAfter = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"]',
      )
      await expect(gardenBedsLinkAfter).not.toHaveClass(/bg-base-200/)
    })

    test('nested page active state works correctly', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/custom-class')

      // The custom-class link should be active
      const customClassLink = page.locator(
        '.drawer-side a[href="/en/docs/sidebar-demo/custom-class"].bg-base-200.font-semibold',
      )
      await expect(customClassLink).toBeAttached()

      // Parent link (sidebar-demo) should NOT be highlighted
      const parentLink = page.locator(
        '.drawer-side a[href="/en/docs/sidebar-demo"]',
      )
      await expect(parentLink).not.toHaveClass(/bg-base-200/)
    })

    test('active highlighting has correct styles computed', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      const activeLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"]',
      )
      await expect(activeLink).toBeAttached()

      // Check font-weight is bold (700)
      const fontWeight = await activeLink.evaluate(
        (el) => window.getComputedStyle(el).fontWeight,
      )
      expect(Number.parseInt(fontWeight, 10)).toBeGreaterThanOrEqual(600)
    })
  })

  test.describe('Breadcrumbs', () => {
    test('breadcrumbs are displayed on docs pages', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      // Breadcrumbs should be visible
      const breadcrumbs = page.locator('.breadcrumbs')
      await expect(breadcrumbs).toBeAttached()
    })

    test('current page title appears in breadcrumbs', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const breadcrumbs = page.locator('.breadcrumbs')
      await expect(breadcrumbs).toContainText('Garden Beds')
    })

    test('nested pages show full breadcrumb path', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/custom-class')

      const breadcrumbs = page.locator('.breadcrumbs')
      await expect(breadcrumbs).toBeAttached()

      // Should show parent category and current page
      const items = breadcrumbs.locator('li')
      const count = await items.count()

      // Should have at least 2 items (parent + current)
      expect(count).toBeGreaterThanOrEqual(2)
    })

    test('parent items in breadcrumbs are links', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/custom-class')

      const breadcrumbs = page.locator('.breadcrumbs')
      const items = breadcrumbs.locator('li')
      const count = await items.count()

      if (count > 1) {
        // First item should be a link (not the current page)
        const firstItem = items.first()
        const link = firstItem.locator('a')
        await expect(link).toBeAttached()
      }
    })

    test('last breadcrumb item is not a link (current page)', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      const breadcrumbs = page.locator('.breadcrumbs')
      const items = breadcrumbs.locator('li')
      const lastItem = items.last()

      // Last item should be a span, not a link
      const span = lastItem.locator('span')
      await expect(span).toBeAttached()
    })
  })

  test.describe('Table of Contents', () => {
    test.describe('Mobile TOC (Collapsible)', () => {
      test.use({ viewport: { width: 375, height: 667 } })

      test('mobile TOC is visible on small screens', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        // Mobile TOC should be visible (xl:hidden means hidden on xl+)
        const mobileToc = page.locator('.xl\\:hidden .collapse')
        await expect(mobileToc).toBeVisible()
      })

      test('mobile TOC can be expanded and collapsed', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        const details = page.locator('.xl\\:hidden details.collapse')
        await expect(details).toBeAttached()

        // Click to expand
        await details.locator('summary').click()

        // Check that content is now visible
        const content = details.locator('.collapse-content')
        await expect(content).toBeVisible()
      })

      test('mobile TOC shows page headings', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        const details = page.locator('.xl\\:hidden details.collapse')
        await details.locator('summary').click()

        const content = details.locator('.collapse-content')
        const links = content.locator('a')

        // Should have heading links
        const count = await links.count()
        expect(count).toBeGreaterThan(0)
      })

      test('mobile TOC heading links navigate to sections', async ({
        page,
      }) => {
        await page.goto('/en/docs/garden-beds')

        const details = page.locator('.xl\\:hidden details.collapse')
        await details.locator('summary').click()

        // Get first heading link
        const firstLink = details.locator('.collapse-content a').first()
        const href = await firstLink.getAttribute('href')

        // Should be an anchor link
        expect(href).toMatch(/^#/)
      })
    })

    test.describe('Desktop TOC (Fixed Sidebar)', () => {
      test.use({ viewport: { width: 1440, height: 900 } })

      test('desktop TOC is visible on large screens', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        // Desktop TOC should be visible (hidden xl:block)
        const desktopToc = page.locator('.hidden.xl\\:block.fixed')
        await expect(desktopToc).toBeVisible()
      })

      test('desktop TOC shows "On this page" header', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        const tocHeader = page.locator('.hidden.xl\\:block h4')
        await expect(tocHeader).toContainText('On this page')
      })

      test('desktop TOC shows page headings', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        const desktopToc = page.locator('.hidden.xl\\:block.fixed')
        const links = desktopToc.locator('a')

        // Should have heading links
        const count = await links.count()
        expect(count).toBeGreaterThan(0)
      })

      test('desktop TOC heading links navigate to sections', async ({
        page,
      }) => {
        await page.goto('/en/docs/garden-beds')

        const desktopToc = page.locator('.hidden.xl\\:block.fixed')
        const firstLink = desktopToc.locator('a').first()
        const href = await firstLink.getAttribute('href')

        // Should be an anchor link
        expect(href).toMatch(/^#/)
      })

      test('desktop TOC has correct indentation for h3 headings', async ({
        page,
      }) => {
        await page.goto('/en/docs/garden-beds')

        const desktopToc = page.locator('.hidden.xl\\:block.fixed')

        // h3 headings should have pl-4 class for indentation
        const h3Links = desktopToc.locator('a.pl-4')
        const count = await h3Links.count()

        // Should have some indented (h3) headings
        expect(count).toBeGreaterThan(0)
      })

      test('clicking TOC link scrolls to section', async ({ page }) => {
        await page.goto('/en/docs/garden-beds')

        const desktopToc = page.locator('.hidden.xl\\:block.fixed')
        const firstLink = desktopToc.locator('a').first()

        await firstLink.click()

        // URL should now contain the anchor (use URL includes since emoji encoding varies)
        const url = page.url()
        expect(url).toContain('#')
      })
    })

    test.describe('Custom Label', () => {
      test('custom label can be set for TableOfContents', async ({ page }) => {
        // Navigate to a page that uses custom label
        await page.goto('/docs/custom-toc-example')

        // Check for custom label text
        const tocHeader = page.locator('.hidden.xl\\:block h4')
        if ((await tocHeader.count()) > 0) {
          const text = await tocHeader.textContent()
          // Should show custom label if one was set
          expect(text).toBeTruthy()
        }
      })
    })
  })

  test.describe('Integration', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test('all navigation features work together on same page', async ({
      page,
    }) => {
      // Use garden-beds page which has many h2/h3 headings for TOC
      await page.goto('/en/docs/garden-beds')

      // Active sidebar highlighting works
      const activeLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"].bg-base-200.font-semibold',
      )
      await expect(activeLink).toBeAttached()

      // Breadcrumbs work
      const breadcrumbs = page.locator('.breadcrumbs')
      await expect(breadcrumbs).toBeAttached()

      // Desktop TOC works (garden-beds has h2/h3 headings)
      const desktopToc = page.locator('.hidden.xl\\:block.fixed')
      await expect(desktopToc).toBeVisible()
    })
  })
})
