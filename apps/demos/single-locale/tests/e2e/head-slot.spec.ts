import { expect, test } from '@playwright/test'

test.describe('Head Slot', () => {
  test('page with head slot has custom og:type meta tag', async ({ page }) => {
    await page.goto('/head-slot-example')
    const ogType = page.locator('meta[property="og:type"]')
    await expect(ogType).toHaveAttribute('content', 'article')
  })

  test('page with head slot has custom author meta tag', async ({ page }) => {
    await page.goto('/head-slot-example')
    const author = page.locator('meta[name="author"]')
    await expect(author).toHaveAttribute('content', 'Shipyard Team')
  })

  test('page with head slot has canonical link', async ({ page }) => {
    await page.goto('/head-slot-example')
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute(
      'href',
      'https://example.com/head-slot-demo',
    )
  })

  test('page with head slot has JSON-LD structured data', async ({ page }) => {
    await page.goto('/head-slot-example')
    const jsonLd = page.locator('script[type="application/ld+json"]')
    await expect(jsonLd).toBeAttached()
    const content = await jsonLd.innerHTML()
    const data = JSON.parse(content)
    expect(data['@type']).toBe('Article')
    expect(data.headline).toBe('Head Slot Example')
    expect(data.author).toBe('Shipyard Team')
  })

  test('page without head slot does not have extra meta tags', async ({
    page,
  }) => {
    await page.goto('/about')
    const ogType = page.locator('meta[property="og:type"]')
    await expect(ogType).toHaveCount(0)
    const jsonLd = page.locator('script[type="application/ld+json"]')
    await expect(jsonLd).toHaveCount(0)
  })
})
