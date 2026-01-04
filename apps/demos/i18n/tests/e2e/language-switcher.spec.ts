import { expect, test } from '@playwright/test'

test.describe('Language Switcher Tests', () => {
  test('switching language from English docs to German should navigate correctly', async ({
    page,
  }) => {
    // Start on English docs page
    await page.goto('/en/docs/')

    // Use the navbar language switcher (dropdown variant)
    const navbarSwitcher = page.locator(
      '.navbar [data-testid="language-switcher"]',
    )
    await expect(navbarSwitcher).toBeVisible()

    // Click the language switcher to open dropdown
    await navbarSwitcher.click()

    // Find the German language option and get its href
    const germanLink = navbarSwitcher.locator('a', { hasText: 'Deutsch' })
    await expect(germanLink).toBeVisible()

    // Verify the link points to the correct German URL (should be /de/docs/, not /de/docs/en)
    await expect(germanLink).toHaveAttribute('href', '/de/docs/')

    // Click the German link
    await germanLink.click()

    // Should navigate to German docs URL, not /de/docs/en
    // The URL should be /de/docs/ even if it 404s or shows fallback content
    await expect(page).toHaveURL('/de/docs/')

    // The page should NOT show a redirect message like "redirecting you from / to /en"
    const body = page.locator('body')
    await expect(body).not.toContainText('redirecting you from')
  })

  test('switching language from German blog to English should navigate correctly', async ({
    page,
  }) => {
    // Start on German blog page (which exists)
    await page.goto('/de/blog/')

    // Use the navbar language switcher (dropdown variant)
    const navbarSwitcher = page.locator(
      '.navbar [data-testid="language-switcher"]',
    )
    await expect(navbarSwitcher).toBeVisible()

    // Click the language switcher to open dropdown
    await navbarSwitcher.click()

    // Find the English language option and get its href
    const englishLink = navbarSwitcher.locator('a', { hasText: 'English' })
    await expect(englishLink).toBeVisible()

    // Verify the link points to the correct English URL
    await expect(englishLink).toHaveAttribute('href', '/en/blog/')

    // Click the English link
    await englishLink.click()

    // Should navigate to English blog
    await expect(page).toHaveURL('/en/blog/')

    // The page should have actual content, not a redirect message
    const body = page.locator('body')
    await expect(body).not.toContainText('redirecting you from')
  })

  test('switching language on blog index should work correctly', async ({
    page,
  }) => {
    // Start on English blog page
    await page.goto('/en/blog/')

    // Use the navbar language switcher (dropdown variant)
    const navbarSwitcher = page.locator(
      '.navbar [data-testid="language-switcher"]',
    )
    await expect(navbarSwitcher).toBeVisible()

    // Click the language switcher to open dropdown
    await navbarSwitcher.click()

    // Find the German language option
    const germanLink = navbarSwitcher.locator('a', { hasText: 'Deutsch' })
    await expect(germanLink).toBeVisible()

    // Verify the link points to the correct German URL
    await expect(germanLink).toHaveAttribute('href', '/de/blog/')

    // Click and verify navigation
    await germanLink.click()
    await expect(page).toHaveURL('/de/blog/')

    // The page should have actual content, not a redirect message
    const body = page.locator('body')
    await expect(body).not.toContainText('redirecting you from')
  })

  test('language switcher links should have correct href attributes', async ({
    page,
  }) => {
    // Start on English docs page
    await page.goto('/en/docs/')

    // Check the German link in the navbar
    const navbarSwitcher = page.locator(
      '.navbar [data-testid="language-switcher"]',
    )
    await navbarSwitcher.click()

    const germanLink = navbarSwitcher.locator('a', { hasText: 'Deutsch' })
    const href = await germanLink.getAttribute('href')

    // The href should be /de/docs/, not something like /de/docs/en
    expect(href).toBe('/de/docs/')
    expect(href).not.toContain('/en')
  })
})
