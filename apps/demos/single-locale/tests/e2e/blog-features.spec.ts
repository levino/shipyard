import { expect, test } from '@playwright/test'

test.describe('Blog Features', () => {
  test.describe('Reading Time', () => {
    test('blog index shows reading time for posts', async ({ page }) => {
      await page.goto('/blog')
      // Reading time should be displayed (e.g., "X min read")
      const readingTime = page.locator('text=/\\d+ min read/')
      await expect(readingTime.first()).toBeVisible()
    })

    test('blog post page shows reading time', async ({ page }) => {
      await page.goto('/blog/2024-09-05-advanced-features')
      const readingTime = page.locator('text=/\\d+ min read/')
      await expect(readingTime).toBeVisible()
    })
  })

  test.describe('Tags', () => {
    test('blog index shows tags on posts', async ({ page }) => {
      await page.goto('/blog')
      // Tags should be displayed as badges
      const tags = page.locator('.badge')
      await expect(tags.first()).toBeVisible()
    })

    test('clicking a tag navigates to tag page', async ({ page }) => {
      await page.goto('/blog')
      const tagLink = page.locator('a.badge').first()
      const tagText = await tagLink.textContent()
      await tagLink.click()
      await expect(page).toHaveURL(/\/blog\/tags\//)
      // Tag page should show the tag name (case-insensitive match due to tag labels)
      await expect(page.locator('h1')).toContainText(
        new RegExp(
          tagText?.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') ?? '',
          'i',
        ),
      )
    })

    test('tags index page shows all tags', async ({ page }) => {
      await page.goto('/blog/tags')
      await expect(page.locator('h1')).toContainText('Tags')
      // Should show tag badges with counts
      const tags = page.locator('a.badge')
      await expect(tags.first()).toBeVisible()
    })

    test('tag page shows posts with that tag', async ({ page }) => {
      await page.goto('/blog/tags/features')
      // Should show tag name (may be "features" or configured label "Features")
      await expect(page.locator('h1')).toContainText(/features/i)
      // Should show at least one post
      const posts = page.locator('article')
      await expect(posts.first()).toBeVisible()
    })
  })

  test.describe('Authors', () => {
    test('blog post shows author information', async ({ page }) => {
      await page.goto('/blog/2024-09-05-advanced-features')
      // Author name should be displayed in the header section
      await expect(page.locator('header >> text=Levin Keller')).toBeVisible()
    })

    test('author has link to profile', async ({ page }) => {
      await page.goto('/blog/2024-09-05-advanced-features')
      const authorLink = page.locator('header a:has-text("Levin Keller")')
      await expect(authorLink).toHaveAttribute(
        'href',
        'https://github.com/levino',
      )
    })

    test('authors index page shows all authors', async ({ page }) => {
      await page.goto('/blog/authors')
      await expect(page.locator('h1')).toContainText('Authors')
      // Should show at least one author card
      const authorCards = page.locator('.card')
      await expect(authorCards.first()).toBeVisible()
    })

    test('author page shows author details and posts', async ({ page }) => {
      await page.goto('/blog/authors/levin-keller')
      await expect(page.locator('h1')).toContainText('Levin Keller')
      // Should show posts by this author
      const posts = page.locator('article')
      await expect(posts.first()).toBeVisible()
    })

    test('clicking author navigates to author page', async ({ page }) => {
      await page.goto('/blog/authors')
      const authorCard = page.locator('a.card').first()
      await authorCard.click()
      await expect(page).toHaveURL(/\/blog\/authors\//)
    })
  })

  test.describe('Archive', () => {
    test('archive page is accessible', async ({ page }) => {
      await page.goto('/blog/archive')
      await expect(page.locator('h1')).toContainText('Archive')
    })

    test('archive page shows posts grouped by year', async ({ page }) => {
      await page.goto('/blog/archive')
      // Should show 2024 section
      await expect(page.locator('h2:has-text("2024")')).toBeVisible()
    })

    test('archive page links to individual posts', async ({ page }) => {
      await page.goto('/blog/archive')
      const postLink = page.locator('a:has-text("Advanced Features")').first()
      await postLink.click()
      await expect(page).toHaveURL(/\/blog\/2024-09-05-advanced-features/)
    })
  })

  test.describe('RSS/Atom Feeds', () => {
    test('RSS feed is available', async ({ page }) => {
      const response = await page.goto('/blog/rss.xml')
      expect(response?.status()).toBe(200)
      // Content-type could be text/xml or application/rss+xml depending on server
      expect(response?.headers()['content-type']).toMatch(/xml/)
    })

    test('Atom feed is available', async ({ page }) => {
      const response = await page.goto('/blog/atom.xml')
      expect(response?.status()).toBe(200)
      expect(response?.headers()['content-type']).toMatch(/xml/)
    })

    test('JSON feed is available', async ({ page }) => {
      const response = await page.goto('/blog/feed.json')
      expect(response?.status()).toBe(200)
      expect(response?.headers()['content-type']).toMatch(/json/)
    })

    test('RSS feed contains blog posts', async ({ page }) => {
      const response = await page.goto('/blog/rss.xml')
      const content = await response?.text()
      expect(content).toContain('Advanced Features')
      expect(content).toContain('<item>')
    })
  })
})
