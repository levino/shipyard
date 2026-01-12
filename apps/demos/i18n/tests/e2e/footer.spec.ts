import { expect, test } from '@playwright/test'

test.describe('Footer Configuration', () => {
  test.describe('Multi-Column Footer', () => {
    test('footer is visible on the page', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test('footer has dark style', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      await expect(footer).toHaveClass(/bg-neutral/)
      await expect(footer).toHaveClass(/text-neutral-content/)
    })

    test('footer displays column titles', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      await expect(footer.locator('h3', { hasText: 'Docs' })).toBeVisible()
      await expect(footer.locator('h3', { hasText: 'Community' })).toBeVisible()
      await expect(footer.locator('h3', { hasText: 'More' })).toBeVisible()
    })

    test('footer column links are rendered', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')

      // Check links in Docs column
      await expect(
        footer.locator('a', { hasText: 'Getting Started' }),
      ).toBeVisible()
      await expect(footer.locator('a', { hasText: 'Guides' })).toBeVisible()

      // Check links in Community column
      await expect(footer.locator('a', { hasText: 'Blog' })).toBeVisible()
      await expect(footer.locator('a', { hasText: 'GitHub' })).toBeVisible()

      // Check links in More column
      await expect(footer.locator('a', { hasText: 'About' })).toBeVisible()
    })

    test('internal footer links have locale prefix', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      const docsLink = footer.locator('a', { hasText: 'Getting Started' })
      await expect(docsLink).toHaveAttribute('href', '/en/docs')
    })

    test('external footer links open in new tab', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      const githubLink = footer.locator('a', { hasText: 'GitHub' })
      await expect(githubLink).toHaveAttribute('target', '_blank')
      await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('footer displays copyright notice', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      await expect(footer).toContainText('Copyright')
      await expect(footer).toContainText('Metro Gardens')
    })
  })

  test.describe('Footer on Different Locales', () => {
    test('German locale has correct footer links', async ({ page }) => {
      await page.goto('/de/')

      const footer = page.locator('footer')
      const docsLink = footer.locator('a', { hasText: 'Getting Started' })
      // Links should use the German locale prefix
      await expect(docsLink).toHaveAttribute('href', '/de/docs')
    })
  })

  test.describe('Footer Logo', () => {
    test('footer displays logo', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      const logo = footer.locator('img[alt="Metro Gardens Logo"]')
      await expect(logo).toBeVisible()
      await expect(logo).toHaveAttribute('src', '/favicon.svg')
    })

    test('footer logo with external href opens in new tab', async ({
      page,
    }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      const logoLink = footer.locator('a:has(img[alt="Metro Gardens Logo"])')
      await expect(logoLink).toHaveAttribute(
        'href',
        'https://github.com/levino/shipyard',
      )
      await expect(logoLink).toHaveAttribute('target', '_blank')
      await expect(logoLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    test('footer logo has correct dimensions', async ({ page }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      const logo = footer.locator('img[alt="Metro Gardens Logo"]')
      await expect(logo).toHaveAttribute('width', '40')
      await expect(logo).toHaveAttribute('height', '40')
    })
  })

  test.describe('hideBranding Feature', () => {
    test('footer does not display Shipyard branding when hideBranding is true', async ({
      page,
    }) => {
      await page.goto('/en/')

      const footer = page.locator('footer')
      const brandingLink = footer.locator('a', {
        hasText: 'Built with Shipyard',
      })
      await expect(brandingLink).toHaveCount(0)
    })
  })
})
