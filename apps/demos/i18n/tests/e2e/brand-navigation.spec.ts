import { expect, test } from '@playwright/test'

test.describe('Brand Navigation Tests', () => {
  test('brand logo link should include locale prefix on German page', async ({
    page,
  }) => {
    await page.goto('/de/blog')

    // The brand logo link should have the German locale prefix
    const brandLink = page.locator('.navbar a.btn-ghost.text-xl')
    await expect(brandLink).toHaveAttribute('href', '/de/')
  })

  test('brand logo link should include locale prefix on English page', async ({
    page,
  }) => {
    await page.goto('/en/blog')

    // The brand logo link should have the English locale prefix
    const brandLink = page.locator('.navbar a.btn-ghost.text-xl')
    await expect(brandLink).toHaveAttribute('href', '/en/')
  })

  test('clicking brand logo from German page should stay in German locale', async ({
    page,
  }) => {
    await page.goto('/de/about')

    // Click the brand logo
    await page.click('.navbar a.btn-ghost.text-xl')

    // Should navigate to German home, not cause redirect loop
    await expect(page).toHaveURL('/de/')
  })

  test('clicking brand logo from English page should stay in English locale', async ({
    page,
  }) => {
    await page.goto('/en/about')

    // Click the brand logo
    await page.click('.navbar a.btn-ghost.text-xl')

    // Should navigate to English home, not cause redirect loop
    await expect(page).toHaveURL('/en/')
  })
})
