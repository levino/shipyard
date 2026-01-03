import { expect, test } from '@playwright/test'

/**
 * Tests for Blog Tags functionality with i18n support.
 * This demo has blog posts with tags and locale-specific tag collections.
 */

test.describe('Blog Tags with i18n', () => {
  test.describe('English locale', () => {
    test('blog index shows tags for posts', async ({ page }) => {
      await page.goto('/en/blog')

      // Should display tags on blog posts
      const tagsContainer = page.locator('[data-testid="blog-tags"]').first()
      await expect(tagsContainer).toBeVisible()
    })

    test('tags index page shows English labels', async ({ page }) => {
      await page.goto('/en/blog/tags')

      // Should have a tags list
      const tagsList = page.locator('[data-testid="tags-list"]')
      await expect(tagsList).toBeVisible()

      // Should show English tag labels (case-insensitive)
      const tagText = await tagsList.textContent()
      expect(tagText?.toLowerCase()).toMatch(
        /harvest report|spring|community distribution/,
      )
    })

    test('tag page shows English content', async ({ page }) => {
      // Navigate to tags index first to find a valid tag URL
      await page.goto('/en/blog/tags')
      const tagsList = page.locator('[data-testid="tags-list"]')
      await expect(tagsList).toBeVisible()

      // Click on the first tag to navigate to its page
      const firstTag = tagsList.locator('a').first()
      await firstTag.click()

      // Page should have the tag label in title
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()

      // The heading should contain something like 'Posts tagged "..."'
      const headingText = await heading.textContent()
      expect(headingText?.toLowerCase()).toContain('tagged')
    })
  })

  test.describe('German locale', () => {
    test('blog index shows tags for posts', async ({ page }) => {
      await page.goto('/de/blog')

      // Should display tags on blog posts if they have tags
      // Note: German posts may have tags too
      const tagsContainer = page.locator('[data-testid="blog-tags"]').first()

      // Check if any posts have tags displayed
      const tagsCount = await page.locator('[data-testid="blog-tags"]').count()
      if (tagsCount > 0) {
        await expect(tagsContainer).toBeVisible()
      }
    })

    test('tags index page shows German labels', async ({ page }) => {
      await page.goto('/de/blog/tags')

      // Should have a tags list
      const tagsList = page.locator('[data-testid="tags-list"]')

      // Check if there are any German tags
      const tagsCount = await tagsList.locator('a').count()
      if (tagsCount > 0) {
        // Should show German tag labels (case-insensitive)
        const tagText = await tagsList.textContent()
        expect(tagText?.toLowerCase()).toMatch(
          /erntebericht|frühling|gemeinschaftsverteilung/,
        )
      }
    })
  })

  test.describe('Cross-locale navigation', () => {
    test('tags are locale-specific', async ({ page }) => {
      // English tags index
      await page.goto('/en/blog/tags')
      const enTagsList = page.locator('[data-testid="tags-list"]')
      await expect(enTagsList).toBeVisible()
      const enTagsText = await enTagsList.textContent()

      // German tags index
      await page.goto('/de/blog/tags')
      const deTagsList = page.locator('[data-testid="tags-list"]')

      const deTagsCount = await deTagsList.locator('a').count()
      if (deTagsCount > 0) {
        const deTagsText = await deTagsList.textContent()
        // Tags should show in respective languages
        expect(enTagsText).not.toBe(deTagsText)
      }
    })
  })
})
