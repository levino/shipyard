import { expect, test } from '@playwright/test'

test.describe('Sidebar Demo - Docusaurus-like Features', () => {
  test.describe('Category-level Sidebar Position', () => {
    test('category with sidebar_position in index.md appears first in top-level navigation', async ({
      page,
    }) => {
      await page.goto('/en/docs/')

      // The sidebar-demo/index.md has sidebar_position: 0
      // Other top-level items (garden-beds, harvesting, vegetables, feature) have no position (default Infinity)
      // So sidebar-demo should appear FIRST in the top-level navigation

      const sidebarMenu = page.locator('.drawer-side ul.menu')
      await expect(sidebarMenu).toBeAttached()

      // Get all top-level sidebar items (direct children of the menu)
      // These are <li> elements that contain either direct links or nested <ul> for categories
      const topLevelItems = page.locator('.drawer-side ul.menu > li')

      // The first item should be the sidebar-demo category
      // (contains a link to /en/docs/sidebar-demo/ or text "Sidebar Demo")
      const firstItem = topLevelItems.first()
      const firstItemText = await firstItem.textContent()

      // sidebar-demo should be first (has position 0)
      expect(firstItemText).toContain('Sidebar Demo')
    })

    test('categories without explicit position come after positioned ones', async ({
      page,
    }) => {
      await page.goto('/en/docs/')

      const sidebarMenu = page.locator('.drawer-side ul.menu')
      await expect(sidebarMenu).toBeAttached()

      // Get text content of all top-level items
      const topLevelItems = page.locator('.drawer-side ul.menu > li')
      const count = await topLevelItems.count()
      const itemTexts: string[] = []
      for (let i = 0; i < count; i++) {
        const text = await topLevelItems.nth(i).textContent()
        if (text) itemTexts.push(text.trim().split('\n')[0].trim())
      }

      // Sidebar Demo (position 0) should be before other items (position Infinity)
      const sidebarDemoIndex = itemTexts.findIndex((t) =>
        t.includes('Sidebar Demo'),
      )
      expect(sidebarDemoIndex).toBe(0)
    })
  })

  test.describe('Sidebar Position Ordering', () => {
    test('items are ordered by sidebar_position, not alphabetically', async ({
      page,
    }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // The sidebar is within .drawer-side containing ul.menu
      // Wait for the sidebar menu to be present
      const sidebarMenu = page.locator('.drawer-side ul.menu')
      await expect(sidebarMenu).toBeAttached()

      // Find all links to sidebar-demo subpages in the sidebar
      // These should be ordered by sidebar_position: custom-class (10), custom-props (20), custom-label (30)
      const sidebarDemoLinks = page.locator(
        '.drawer-side a[href*="/en/docs/sidebar-demo/"]',
      )

      // Filter to get only the subpage links (not the index)
      const hrefs: string[] = []
      const count = await sidebarDemoLinks.count()
      for (let i = 0; i < count; i++) {
        const href = await sidebarDemoLinks.nth(i).getAttribute('href')
        if (href && !href.endsWith('sidebar-demo/')) {
          hrefs.push(href)
        }
      }

      expect(hrefs.length).toBe(3)

      // Expected order by sidebar_position: custom-class (10), custom-props (20), custom-label (30)
      // NOT alphabetical order: custom-class, custom-label, custom-props
      expect(hrefs[0]).toContain('custom-class')
      expect(hrefs[1]).toContain('custom-props')
      expect(hrefs[2]).toContain('custom-label')
    })

    test('lower sidebar_position appears first', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // custom-class has position 10 (lowest among subpages), should be first after index
      const links = page.locator(
        '.drawer-side a[href*="/en/docs/sidebar-demo/"]',
      )
      const allHrefs: string[] = []
      const count = await links.count()
      for (let i = 0; i < count; i++) {
        const href = await links.nth(i).getAttribute('href')
        if (href && !href.endsWith('sidebar-demo/')) {
          allHrefs.push(href)
        }
      }

      // First non-index link should be custom-class
      expect(allHrefs[0]).toContain('custom-class')
    })
  })

  test.describe('Sidebar Label', () => {
    test('custom sidebar_label overrides default title', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // The custom-label.md has sidebar_label: "Fancy Label ✨"
      // This should appear in the sidebar instead of the page title
      const fancyLabel = page.locator(
        '.drawer-side a:has-text("Fancy Label ✨")',
      )
      await expect(fancyLabel).toBeAttached()
    })

    test('clicking custom label navigates to correct page', async ({
      page,
    }) => {
      await page.goto('/en/docs/sidebar-demo/')

      const fancyLabel = page.locator(
        '.drawer-side a:has-text("Fancy Label ✨")',
      )
      await fancyLabel.click({ force: true })

      await expect(page).toHaveURL(/\/en\/docs\/sidebar-demo\/custom-label/)
    })
  })

  test.describe('Sidebar Class Name', () => {
    test('custom sidebar_class_name is applied to sidebar item', async ({
      page,
    }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // The custom-class.md has sidebar_class_name: "font-bold text-warning"
      // These Tailwind/DaisyUI classes should be applied to the parent <li> element
      const itemWithBold = page.locator('.drawer-side li.font-bold')
      await expect(itemWithBold).toBeAttached()

      const itemWithWarning = page.locator('.drawer-side li.text-warning')
      await expect(itemWithWarning).toBeAttached()
    })

    test('item with custom class contains the correct link', async ({
      page,
    }) => {
      await page.goto('/en/docs/sidebar-demo/')

      const itemWithClass = page.locator(
        '.drawer-side li.font-bold.text-warning',
      )
      const link = itemWithClass.locator('a')
      const href = await link.getAttribute('href')

      expect(href).toContain('custom-class')
    })
  })

  test.describe('Combined Features', () => {
    test('all three demo pages are visible in sidebar', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // Verify all demo pages are present in the sidebar
      await expect(
        page.locator(
          '.drawer-side a[href*="/en/docs/sidebar-demo/custom-class"]',
        ),
      ).toBeAttached()
      await expect(
        page.locator(
          '.drawer-side a[href*="/en/docs/sidebar-demo/custom-props"]',
        ),
      ).toBeAttached()
      // custom-label shows as "Fancy Label ✨"
      await expect(
        page.locator('.drawer-side a:has-text("Fancy Label ✨")'),
      ).toBeAttached()
    })

    test('navigation through all demo pages works', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // Navigate to custom-class
      await page
        .locator('.drawer-side a[href*="/en/docs/sidebar-demo/custom-class"]')
        .click({ force: true })
      await expect(page).toHaveURL(/custom-class/)

      // Navigate to custom-props
      await page
        .locator('.drawer-side a[href*="/en/docs/sidebar-demo/custom-props"]')
        .click({ force: true })
      await expect(page).toHaveURL(/custom-props/)

      // Navigate to custom-label via its custom label
      await page
        .locator('.drawer-side a:has-text("Fancy Label ✨")')
        .click({ force: true })
      await expect(page).toHaveURL(/custom-label/)
    })
  })
})
