import { expect, test } from '@playwright/test'

/**
 * Linked headings, the sticky desktop table of contents and the localized
 * UI labels of the docs layout.
 */
test.describe('Linked headings', () => {
  test('h2 to h4 link to their own anchor', async ({ page }) => {
    await page.goto('/en/docs/garden-beds')

    const headings = page.locator('.prose :is(h2, h3, h4)[id]')
    const count = await headings.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const heading = headings.nth(i)
      const id = await heading.getAttribute('id')
      await expect(heading.locator('> a.heading-link')).toHaveAttribute(
        'href',
        `#${id}`,
      )
    }
  })

  test('clicking a heading puts its anchor in the URL', async ({ page }) => {
    await page.goto('/en/docs/garden-beds')

    const heading = page.locator('.prose h2[id]').nth(1)
    const id = await heading.getAttribute('id')
    await heading.locator('a.heading-link').click()

    await expect(page).toHaveURL(
      new RegExp(`#${encodeURIComponent(id ?? '')}$`),
    )
  })

  test('the heading keeps its text as the link name', async ({ page }) => {
    await page.goto('/en/docs/garden-beds')

    const link = page.locator('.prose h2 a.heading-link').first()
    await expect(link).toHaveAccessibleName(/Garden Map Overview/)
    await expect(link).not.toHaveAccessibleName(/#$/)
  })

  test('the TOC slugs match the heading anchors', async ({ page }) => {
    await page.goto('/en/docs/garden-beds')

    const tocHrefs = await page
      .locator('.hidden.xl\\:block.col-span-3 a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')))
    const headingHrefs = await page
      .locator('.prose a.heading-link')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')))

    for (const href of tocHrefs) {
      expect(headingHrefs).toContain(href)
    }
  })
})

test.describe('Sticky desktop table of contents', () => {
  test.use({ viewport: { width: 1440, height: 700 } })

  test('stays in view while scrolling', async ({ page }) => {
    await page.goto('/en/docs/garden-beds')

    const toc = page.locator('.hidden.xl\\:block.col-span-3 .sticky')
    await expect(toc).toBeVisible()

    // Scroll well into the page, but not to the end: at the very bottom the
    // TOC column ends and the TOC scrolls away with it, as intended.
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForFunction(() => window.scrollY >= 1500)

    const box = await toc.boundingBox()
    expect(box?.y).toBeGreaterThanOrEqual(0)
    await expect(toc.locator('h4')).toBeInViewport()
  })
})

test.describe('Localized UI labels', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('German pages use German labels', async ({ page }) => {
    await page.goto('/de/blog')

    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expect(page.locator('a[href="#main-content"]')).toHaveText(
      'Zum Inhalt springen',
    )
    await expect(page.locator('label.drawer-button')).toHaveAttribute(
      'aria-label',
      'Menü öffnen',
    )
  })

  test('English pages keep English labels', async ({ page }) => {
    await page.goto('/en/docs/garden-beds')

    await expect(page.locator('.hidden.xl\\:block.col-span-3 h4')).toHaveText(
      'On this page',
    )
    await expect(page.locator('.pagination-nav')).toHaveAttribute(
      'aria-label',
      'Docs navigation',
    )
  })
})
