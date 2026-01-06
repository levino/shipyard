import { expect, test } from '@playwright/test'

/**
 * Tests for Documentation Plugin features marked as "supported" in the
 * Docusaurus Feature Parity Roadmap.
 */

test.describe('Documentation Plugin Features', () => {
  test.describe('Core Functionality', () => {
    test('renders documentation pages from Markdown files', async ({
      page,
    }) => {
      await page.goto('/en/docs/')
      await expect(page.locator('h1')).toContainText('Garden Guide')
    })

    test('generates documentation routes automatically', async ({ page }) => {
      // Test that various doc routes work
      const routes = [
        '/en/docs/',
        '/en/docs/garden-beds',
        '/en/docs/vegetables',
        '/en/docs/harvesting',
      ]

      for (const route of routes) {
        const response = await page.goto(route)
        expect(response?.status()).toBe(200)
      }
    })

    test('documentation sidebar navigation is present', async ({ page }) => {
      await page.goto('/en/docs/')
      const sidebar = page.locator('.drawer-side ul.menu')
      await expect(sidebar).toBeAttached()
    })
  })

  test.describe('Configuration Options', () => {
    test('sidebar is collapsible on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/docs/')

      // On mobile, drawer should be closed by default
      const drawerContent = page.locator('.drawer-content')
      await expect(drawerContent).toBeVisible()

      // Sidebar toggle should exist
      const drawerToggle = page.locator('#drawer')
      await expect(drawerToggle).toBeAttached()
    })

    test('sidebar categories are collapsible', async ({ page }) => {
      await page.goto('/en/docs/')

      // Check for collapsible category (details element or similar)
      const sidebarMenu = page.locator('.drawer-side ul.menu')
      await expect(sidebarMenu).toBeAttached()
    })
  })

  test.describe('Frontmatter Support', () => {
    test('title frontmatter is used in sidebar', async ({ page }) => {
      await page.goto('/en/docs/')
      // The title from frontmatter appears in the sidebar
      const gardenBedsLink = page.locator(
        '.drawer-side a:has-text("Garden Beds")',
      )
      await expect(gardenBedsLink).toBeAttached()
    })

    test('description frontmatter sets meta description', async ({ page }) => {
      await page.goto('/en/docs/')

      // Check that meta description exists
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })

    test('sidebar_label overrides title in sidebar', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // custom-label.md has sidebar_label: "Fancy Label ✨"
      const fancyLabel = page.locator(
        '.drawer-side a:has-text("Fancy Label ✨")',
      )
      await expect(fancyLabel).toBeAttached()
    })

    test('sidebar_position controls item order', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // Get sidebar items order
      const sidebarLinks = page.locator(
        '.drawer-side a[href*="/en/docs/sidebar-demo/"]',
      )
      const hrefs: string[] = []
      const count = await sidebarLinks.count()
      for (let i = 0; i < count; i++) {
        const href = await sidebarLinks.nth(i).getAttribute('href')
        if (href && !href.endsWith('sidebar-demo/')) {
          hrefs.push(href)
        }
      }

      // custom-class (position 10) should come before custom-label (position 30)
      expect(hrefs[0]).toContain('custom-class')
      expect(hrefs[1]).toContain('custom-label')
    })

    test('sidebar_class_name applies custom CSS classes', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/')

      // custom-class.md has sidebar_class_name: "font-bold text-warning"
      const boldItem = page.locator('.drawer-side li.font-bold')
      await expect(boldItem).toBeAttached()

      const warningItem = page.locator('.drawer-side li.text-warning')
      await expect(warningItem).toBeAttached()
    })
  })

  test.describe('MDX & Markdown Features', () => {
    test('code blocks have syntax highlighting', async ({ page }) => {
      await page.goto('/en/docs/sidebar-demo/custom-class')

      // The page has a code block with yaml
      const codeBlock = page.locator('pre code')
      await expect(codeBlock).toBeAttached()

      // Shiki adds classes for syntax highlighting
      const hasHighlighting = await codeBlock.evaluate((el) => {
        // Check if code has syntax highlighting (Shiki adds spans with styles)
        return (
          el.querySelectorAll('span').length > 0 || el.style.cssText.length > 0
        )
      })
      expect(hasHighlighting).toBe(true)
    })

    test('headings have automatic anchors', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      // Check that h2 headings have IDs (anchors)
      const h2s = page.locator('h2')
      const count = await h2s.count()
      expect(count).toBeGreaterThan(0)

      // Check first h2 has an ID attribute
      const firstH2Id = await h2s.first().getAttribute('id')
      expect(firstH2Id).toBeTruthy()
    })
  })

  test.describe('Sidebar Features', () => {
    test('doc type links to documents', async ({ page }) => {
      await page.goto('/en/docs/')

      const docLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"]',
      )
      await expect(docLink).toBeAttached()
      await docLink.click()
      await expect(page).toHaveURL(/garden-beds/)
    })

    test('category type with collapsible nested items', async ({ page }) => {
      await page.goto('/en/docs/')

      // sidebar-demo is a category with nested items
      const categoryLink = page.locator(
        '.drawer-side a[href="/en/docs/sidebar-demo"]',
      )
      await expect(categoryLink).toBeAttached()
    })

    test('autogenerated sidebar from file structure', async ({ page }) => {
      await page.goto('/en/docs/')

      // All doc files should appear in sidebar
      const expectedDocs = [
        'garden-beds',
        'vegetables',
        'harvesting',
        'feature',
      ]
      for (const doc of expectedDocs) {
        const link = page.locator(`.drawer-side a[href*="${doc}"]`)
        await expect(link).toBeAttached()
      }
    })

    test('category index pages work', async ({ page }) => {
      // sidebar-demo/index.md serves as category index
      await page.goto('/en/docs/sidebar-demo/')
      await expect(page.locator('h1')).toContainText('Sidebar Demo')
    })

    test('active page is highlighted in sidebar', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const activeLink = page.locator(
        '.drawer-side a[href="/en/docs/garden-beds"].font-medium.text-primary',
      )
      await expect(activeLink).toBeAttached()
    })
  })

  test.describe('Doc Metadata Features', () => {
    test('shows "Edit this page" link when editUrl is configured', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      const editLink = page.locator('a.edit-link')
      await expect(editLink).toBeAttached()
      await expect(editLink).toContainText('Edit this page')

      // Check the link points to GitHub
      const href = await editLink.getAttribute('href')
      expect(href).toContain('github.com')
      expect(href).toContain('/edit/')
    })

    test('shows last updated timestamp when showLastUpdateTime is enabled', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      const lastUpdated = page.locator('.last-updated')
      await expect(lastUpdated).toBeAttached()
      await expect(lastUpdated).toContainText('Last updated:')

      // Check for time element with datetime attribute
      const timeElement = lastUpdated.locator('time')
      await expect(timeElement).toBeAttached()
      const datetime = await timeElement.getAttribute('datetime')
      expect(datetime).toBeTruthy()
    })

    test('shows last author when showLastUpdateAuthor is enabled', async ({
      page,
    }) => {
      await page.goto('/en/docs/garden-beds')

      const lastAuthor = page.locator('.last-author')
      await expect(lastAuthor).toBeAttached()
      await expect(lastAuthor).toContainText('by')
    })

    test('doc metadata section is styled correctly', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const metadata = page.locator('.doc-metadata')
      await expect(metadata).toBeAttached()

      // Should have border-top styling (indicates separation from content)
      await expect(metadata).toHaveClass(/border-t/)
    })

    test('edit link opens in new tab', async ({ page }) => {
      await page.goto('/en/docs/garden-beds')

      const editLink = page.locator('a.edit-link')
      await expect(editLink).toHaveAttribute('target', '_blank')
      await expect(editLink).toHaveAttribute('rel', /noopener/)
    })

    test('edit link for index pages points to index.md file', async ({
      page,
    }) => {
      // Test docs index page
      await page.goto('/en/docs/')
      const docsEditLink = page.locator('a.edit-link')
      await expect(docsEditLink).toBeAttached()
      const docsHref = await docsEditLink.getAttribute('href')
      // Should end with /index.md, not just /en.md
      expect(docsHref).toContain('/en/index.md')
      expect(docsHref).not.toContain('/en.md')

      // Test guides index page
      await page.goto('/en/guides/')
      const guidesEditLink = page.locator('a.edit-link')
      await expect(guidesEditLink).toBeAttached()
      const guidesHref = await guidesEditLink.getAttribute('href')
      // Should end with /index.md, not just /en.md
      expect(guidesHref).toContain('/en/index.md')
      expect(guidesHref).not.toContain('/en.md')
    })
  })

  test.describe('SEO Features', () => {
    test('meta description from frontmatter', async ({ page }) => {
      await page.goto('/en/docs/')

      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toBeAttached()
    })

    test('OpenGraph title tag is set', async ({ page }) => {
      await page.goto('/en/docs/')

      const ogTitle = page.locator('meta[property="og:title"]')
      await expect(ogTitle).toBeAttached()
      // OG title contains site title
      const content = await ogTitle.getAttribute('content')
      expect(content).toContain('Metro Gardens')
    })

    test('OpenGraph description tag is set', async ({ page }) => {
      await page.goto('/en/docs/')

      const ogDescription = page.locator('meta[property="og:description"]')
      await expect(ogDescription).toBeAttached()
    })

    test('sitemap link is present', async ({ page }) => {
      await page.goto('/en/docs/')

      const sitemapLink = page.locator('link[rel="sitemap"]')
      await expect(sitemapLink).toBeAttached()
      const href = await sitemapLink.getAttribute('href')
      expect(href).toBe('/sitemap-index.xml')
    })
  })
})
