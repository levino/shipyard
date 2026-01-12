import { expect, test } from '@playwright/test'

test.describe('Footer Configuration (Simple Footer)', () => {
  test('footer is visible on the page', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('footer has light style by default', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toHaveClass(/bg-base-200/)
    await expect(footer).toHaveClass(/text-base-content/)
  })

  test('footer displays simple row of links', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')

    // Check that links are displayed
    await expect(
      footer.locator('a', { hasText: 'Documentation' }),
    ).toBeVisible()
    await expect(footer.locator('a', { hasText: 'Blog' })).toBeVisible()
    await expect(footer.locator('a', { hasText: 'About' })).toBeVisible()
    await expect(footer.locator('a', { hasText: 'GitHub' })).toBeVisible()
  })

  test('internal footer links work correctly', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const docsLink = footer.locator('a', { hasText: 'Documentation' })
    await expect(docsLink).toHaveAttribute('href', '/docs/markdown-features')
  })

  test('external footer links open in new tab', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const githubLink = footer.locator('a', { hasText: 'GitHub' })
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  test('footer displays copyright notice', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toContainText('Copyright')
    await expect(footer).toContainText('Single Language Demo')
  })

  test('footer displays Shipyard branding', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const brandingLink = footer.locator('a', { hasText: 'Built with Shipyard' })
    await expect(brandingLink).toBeVisible()
    await expect(brandingLink).toHaveAttribute(
      'href',
      'https://github.com/levino/shipyard',
    )
  })

  test('simple footer has no column headers', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    // Simple footer should NOT have h3 column headers
    const columnHeaders = footer.locator('h3')
    await expect(columnHeaders).toHaveCount(0)
  })

  test('footer displays logo', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const logo = footer.locator('img[alt="Single Language Demo Logo"]')
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('src', '/favicon.svg')
  })

  test('footer logo links to internal page', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const logoLink = footer.locator(
      'a:has(img[alt="Single Language Demo Logo"])',
    )
    await expect(logoLink).toHaveAttribute('href', '/docs/markdown-features')
    // Internal link should NOT have target="_blank"
    await expect(logoLink).not.toHaveAttribute('target', '_blank')
  })

  test('footer logo has correct dimensions', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const logo = footer.locator('img[alt="Single Language Demo Logo"]')
    await expect(logo).toHaveAttribute('width', '40')
    await expect(logo).toHaveAttribute('height', '40')
  })
})
