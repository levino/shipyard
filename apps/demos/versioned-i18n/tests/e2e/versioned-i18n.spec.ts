import { expect, test } from '@playwright/test'

test.describe('Versioned i18n Demo', () => {
  test.describe('Home Page', () => {
    test('redirects root to /en/', async ({ page }) => {
      await page.goto('/')
      await page.waitForURL(/\/en\/?$/, { timeout: 5000 })
      expect(page.url()).toMatch(/\/en\/?$/)
    })

    test('English home page loads correctly', async ({ page }) => {
      await page.goto('/en/')
      await expect(
        page.getByRole('heading', { name: 'Versioned i18n Demo' }),
      ).toBeVisible()
    })

    test('German home page loads correctly', async ({ page }) => {
      await page.goto('/de/')
      await expect(
        page.getByRole('heading', { name: 'Versionierte i18n Demo' }),
      ).toBeVisible()
    })
  })

  test.describe('Language Switching', () => {
    test('can switch from English to German on home page', async ({ page }) => {
      await page.goto('/en/')
      // Find and click the language switcher in the navbar using data-testid
      const languageSwitcher = page.locator(
        '.navbar [data-testid="language-switcher"] [role="button"]',
      )
      await languageSwitcher.click()
      await page.click(
        '.navbar [data-testid="language-switcher"] a[href="/de/"]',
      )
      await page.waitForURL('/de/')
      await expect(
        page.getByRole('heading', { name: 'Versionierte i18n Demo' }),
      ).toBeVisible()
    })

    test('can switch from German to English on docs page', async ({ page }) => {
      await page.goto('/de/docs/v2/')
      const languageSwitcher = page.locator(
        '.navbar [data-testid="language-switcher"] [role="button"]',
      )
      await languageSwitcher.click()
      await page.click(
        '.navbar [data-testid="language-switcher"] a[href="/en/docs/v2/"]',
      )
      await page.waitForURL('/en/docs/v2/')
      await expect(
        page.getByRole('heading', { name: /Documentation v2/i }),
      ).toBeVisible()
    })
  })

  test.describe('Version Switching', () => {
    test('version selector is visible on English docs page', async ({
      page,
    }) => {
      await page.goto('/en/docs/v2/')
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"]',
      )
      await expect(versionSelector).toBeVisible()
    })

    test('version selector is visible on German docs page', async ({
      page,
    }) => {
      await page.goto('/de/docs/v2/')
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"]',
      )
      await expect(versionSelector).toBeVisible()
    })

    test('can switch from v2 to v1 on English page', async ({ page }) => {
      await page.goto('/en/docs/v2/')
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"] [role="button"]',
      )
      await versionSelector.click()
      await page.click(
        '.navbar [data-testid="version-selector"] a[href="/en/docs/v1/"]',
      )
      await page.waitForURL('/en/docs/v1/')
      await expect(
        page.getByRole('heading', { name: /Documentation v1/i }),
      ).toBeVisible()
    })

    test('can switch from v1 to v2 on German page', async ({ page }) => {
      await page.goto('/de/docs/v1/')
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"] [role="button"]',
      )
      await versionSelector.click()
      await page.click(
        '.navbar [data-testid="version-selector"] a[href="/de/docs/v2/"]',
      )
      await page.waitForURL('/de/docs/v2/')
      await expect(
        page.getByRole('heading', { name: /Dokumentation v2/i }),
      ).toBeVisible()
    })
  })

  test.describe('Combined Version + Language Switching', () => {
    test('can switch language then version', async ({ page }) => {
      // Start on English v2
      await page.goto('/en/docs/v2/')
      await expect(page.locator('h1')).toContainText('Documentation v2')

      // Switch to German
      const languageSwitcher = page.locator(
        '.navbar [data-testid="language-switcher"] [role="button"]',
      )
      await languageSwitcher.click()
      await page.click(
        '.navbar [data-testid="language-switcher"] a[href="/de/docs/v2/"]',
      )
      await page.waitForURL('/de/docs/v2/')
      await expect(page.locator('h1')).toContainText('Dokumentation v2')

      // Switch to v1
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"] [role="button"]',
      )
      await versionSelector.click()
      await page.click(
        '.navbar [data-testid="version-selector"] a[href="/de/docs/v1/"]',
      )
      await page.waitForURL('/de/docs/v1/')
      await expect(page.locator('h1')).toContainText('Dokumentation v1')
    })

    test('can switch version then language', async ({ page }) => {
      // Start on German v1
      await page.goto('/de/docs/v1/')
      await expect(page.locator('h1')).toContainText('Dokumentation v1')

      // Switch to v2
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"] [role="button"]',
      )
      await versionSelector.click()
      await page.click(
        '.navbar [data-testid="version-selector"] a[href="/de/docs/v2/"]',
      )
      await page.waitForURL('/de/docs/v2/')
      await expect(page.locator('h1')).toContainText('Dokumentation v2')

      // Switch to English
      const languageSwitcher = page.locator(
        '.navbar [data-testid="language-switcher"] [role="button"]',
      )
      await languageSwitcher.click()
      await page.click(
        '.navbar [data-testid="language-switcher"] a[href="/en/docs/v2/"]',
      )
      await page.waitForURL('/en/docs/v2/')
      await expect(page.locator('h1')).toContainText('Documentation v2')
    })
  })

  test.describe('URL Structure', () => {
    test('English v2 installation page has correct URL', async ({ page }) => {
      await page.goto('/en/docs/v2/installation')
      expect(page.url()).toContain('/en/docs/v2/installation')
      await expect(
        page.getByRole('heading', { name: /Installation Guide \(v2\)/i }),
      ).toBeVisible()
    })

    test('German v1 configuration page has correct URL', async ({ page }) => {
      await page.goto('/de/docs/v1/configuration')
      expect(page.url()).toContain('/de/docs/v1/configuration')
      await expect(
        page.getByRole('heading', { name: /Konfigurationsanleitung \(v1\)/i }),
      ).toBeVisible()
    })

    test('latest alias redirects in English', async ({ page }) => {
      await page.goto('/en/docs/latest/')
      // Wait for 301 redirect to v2
      await page.waitForURL(/\/en\/docs\/v2\/?$/, { timeout: 5000 })
      await expect(page.locator('h1')).toContainText('Documentation v2')
    })

    test('latest alias redirects in German', async ({ page }) => {
      await page.goto('/de/docs/latest/')
      // Wait for 301 redirect to v2
      await page.waitForURL(/\/de\/docs\/v2\/?$/, { timeout: 5000 })
      await expect(page.locator('h1')).toContainText('Dokumentation v2')
    })
  })

  test.describe('Docs Root Redirect', () => {
    test('English /docs/ redirects to current version', async ({ page }) => {
      await page.goto('/en/docs/')
      await page.waitForURL('/en/docs/v2/', { timeout: 5000 })
      expect(page.url()).toContain('/en/docs/v2/')
    })

    test('German /docs/ redirects to current version preserving locale', async ({
      page,
    }) => {
      await page.goto('/de/docs/')
      // Should redirect to German v2, preserving locale context
      await page.waitForURL('/de/docs/v2/', { timeout: 5000 })
      expect(page.url()).toContain('/de/docs/v2/')
    })
  })

  test.describe('Version Selector Badges', () => {
    test('v2 shows stable badge', async ({ page }) => {
      await page.goto('/en/docs/v2/')
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"] [role="button"]',
      )
      await versionSelector.click()
      const stableBadge = page.locator(
        '.navbar [data-testid="version-selector"] .badge-success',
      )
      await expect(stableBadge).toBeVisible()
      await expect(stableBadge).toContainText(/stable/i)
    })

    test('v1 shows deprecated badge', async ({ page }) => {
      await page.goto('/en/docs/v2/')
      const versionSelector = page.locator(
        '.navbar [data-testid="version-selector"] [role="button"]',
      )
      await versionSelector.click()
      const deprecatedBadge = page.locator(
        '.navbar [data-testid="version-selector"] .badge-warning',
      )
      await expect(deprecatedBadge).toBeVisible()
      await expect(deprecatedBadge).toContainText(/deprecated/i)
    })
  })

  test.describe('About Page', () => {
    test('English about page loads', async ({ page }) => {
      await page.goto('/en/about')
      await expect(
        page.getByRole('heading', { name: 'About This Demo' }),
      ).toBeVisible()
    })

    test('German about page loads', async ({ page }) => {
      await page.goto('/de/about')
      await expect(
        page.getByRole('heading', { name: 'Über diese Demo' }),
      ).toBeVisible()
    })
  })

  test.describe('Content Localization', () => {
    test('English v2 shows English content', async ({ page }) => {
      await page.goto('/en/docs/v2/')
      // Check for English-specific content
      await expect(page.locator('h1')).toContainText('Documentation v2')
      await expect(page.locator('body')).toContainText('Improved Performance')
    })

    test('German v2 shows German content', async ({ page }) => {
      await page.goto('/de/docs/v2/')
      await expect(page.locator('article, .prose')).toContainText(
        'Was ist neu in v2',
      )
    })

    test('English v1 shows v1-specific content', async ({ page }) => {
      await page.goto('/en/docs/v1/')
      await expect(page.locator('article, .prose')).toContainText(
        'This version is deprecated',
      )
    })

    test('German v1 shows v1-specific German content', async ({ page }) => {
      await page.goto('/de/docs/v1/')
      await expect(page.locator('article, .prose')).toContainText(
        'Diese Version ist veraltet',
      )
    })
  })
})
