import { expect, test } from '@playwright/test'

test.describe('Script Injection Tests', () => {
  test('scripts are injected into HTML head', async ({ page }) => {
    await page.goto('/en')

    // Check that all three configured scripts are present in the head
    const scripts = await page.locator('head script').all()
    expect(scripts).toHaveLength(3)

    // Test simple string script
    const simpleScript = page.locator('head script[src="https://example.com/simple-script.js"]')
    await expect(simpleScript).toBeAttached()
    
    // Verify it doesn't have async or defer attributes
    expect(await simpleScript.getAttribute('async')).toBeNull()
    expect(await simpleScript.getAttribute('defer')).toBeNull()

    // Test script with async attribute
    const asyncScript = page.locator('head script[src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"]')
    await expect(asyncScript).toBeAttached()
    expect(await asyncScript.getAttribute('async')).toBe('')

    // Test script with defer and type attributes
    const deferredScript = page.locator('head script[src="https://example.com/deferred-script.js"]')
    await expect(deferredScript).toBeAttached()
    expect(await deferredScript.getAttribute('defer')).toBe('')
    expect(await deferredScript.getAttribute('type')).toBe('module')
  })

  test('scripts are present on different pages', async ({ page }) => {
    // Test about page
    await page.goto('/en/about')
    const aboutScripts = await page.locator('head script').all()
    expect(aboutScripts).toHaveLength(3)

    // Test blog page  
    await page.goto('/en/blog')
    const blogScripts = await page.locator('head script').all()
    expect(blogScripts).toHaveLength(3)

    // Test docs page
    await page.goto('/en/docs')
    const docsScripts = await page.locator('head script').all()
    expect(docsScripts).toHaveLength(3)
  })

  test('script attributes are correctly applied', async ({ page }) => {
    await page.goto('/en')
    
    // Verify the clipboard.js script has the correct attributes
    const clipboardScript = page.locator('head script[src*="clipboard.js"]')
    await expect(clipboardScript).toBeAttached()
    
    // Check for async attribute
    const isAsync = await clipboardScript.evaluate(script => script.hasAttribute('async'))
    expect(isAsync).toBe(true)
    
    // Check that defer is not set (should be null/false)
    const hasDefer = await clipboardScript.evaluate(script => script.hasAttribute('defer'))
    expect(hasDefer).toBe(false)
    
    // Verify the deferred script has correct attributes
    const deferredScript = page.locator('head script[src*="deferred-script.js"]')
    await expect(deferredScript).toBeAttached()
    
    const isDefer = await deferredScript.evaluate(script => script.hasAttribute('defer'))
    expect(isDefer).toBe(true)
    
    const scriptType = await deferredScript.getAttribute('type')
    expect(scriptType).toBe('module')
  })

  test('scripts are in correct order', async ({ page }) => {
    await page.goto('/en')
    
    const allScripts = await page.locator('head script').all()
    
    // Get src attributes in order
    const srcs = await Promise.all(
      allScripts.map(script => script.getAttribute('src'))
    )
    
    // Verify scripts appear in the same order as configured
    expect(srcs[0]).toBe('https://example.com/simple-script.js')
    expect(srcs[1]).toBe('https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js')
    expect(srcs[2]).toBe('https://example.com/deferred-script.js')
  })
})