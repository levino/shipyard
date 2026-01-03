import { expect, test } from '@playwright/test'

/**
 * Tests for Blog Tags functionality.
 * This demo has blog posts with tags and a tags collection.
 */

test.describe('Blog Tags', () => {
  test.describe('Tags on blog index', () => {
    test('blog index shows tags for posts with tags', async ({ page }) => {
      await page.goto('/blog')

      // Should display tags on blog posts
      const tagsContainer = page.locator('[data-testid="blog-tags"]').first()
      await expect(tagsContainer).toBeVisible()
    })

    test('clicking a tag navigates to tag page', async ({ page }) => {
      await page.goto('/blog')

      // Click on a tag
      const tagLink = page.locator('[data-testid="blog-tags"] a').first()
      await tagLink.click()

      // Should navigate to tag page
      await expect(page).toHaveURL(/\/blog\/tags\//)
    })
  })

  test.describe('Tags on blog post', () => {
    test('blog post shows tags', async ({ page }) => {
      await page.goto('/blog/2024-09-01-getting-started')

      // Should display tags on the post
      const tagsContainer = page.locator('[data-testid="blog-tags"]')
      await expect(tagsContainer).toBeVisible()

      // Should have the expected tags
      await expect(
        tagsContainer.locator('[data-testid="tag-getting-started"]'),
      ).toBeVisible()
      await expect(
        tagsContainer.locator('[data-testid="tag-tutorial"]'),
      ).toBeVisible()
    })
  })

  test.describe('Tags index page', () => {
    test('tags index page lists all tags', async ({ page }) => {
      await page.goto('/blog/tags')

      // Should have a tags list
      const tagsList = page.locator('[data-testid="tags-list"]')
      await expect(tagsList).toBeVisible()

      // Should have multiple tags
      const tags = tagsList.locator('a')
      const tagCount = await tags.count()
      expect(tagCount).toBeGreaterThan(0)
    })

    test('tags show post counts', async ({ page }) => {
      await page.goto('/blog/tags')

      // Tags should show counts like (1), (2), etc.
      const tagWithCount = page.locator('[data-testid="tags-list"] a').first()
      const text = await tagWithCount.textContent()
      expect(text).toMatch(/\(\d+\)/)
    })

    test('clicking a tag navigates to tag page', async ({ page }) => {
      await page.goto('/blog/tags')

      const tagLink = page.locator('[data-testid="tags-list"] a').first()
      await tagLink.click()

      // Should navigate to specific tag page
      await expect(page).toHaveURL(/\/blog\/tags\//)
    })
  })

  test.describe('Tag page', () => {
    test('tag page shows posts with that tag', async ({ page }) => {
      await page.goto('/blog/tags/tutorial')

      // Should show posts
      const postsContainer = page.locator('[data-testid="tag-posts"]')
      await expect(postsContainer).toBeVisible()

      // Should have at least one post
      const posts = postsContainer.locator('a')
      const postCount = await posts.count()
      expect(postCount).toBeGreaterThan(0)
    })

    test('tag page shows tag label in title', async ({ page }) => {
      await page.goto('/blog/tags/tutorial')

      // Page should have the tag name in title
      const heading = page.locator('h1')
      await expect(heading).toContainText('Tutorial')
    })

    test('tag page links back to tags index', async ({ page }) => {
      await page.goto('/blog/tags/tutorial')

      // Should have breadcrumb link to tags
      const tagsLink = page.locator('a:has-text("Tags")')
      await expect(tagsLink).toBeVisible()
      await tagsLink.click()

      await expect(page).toHaveURL('/blog/tags')
    })
  })
})
