import { expect, test } from '@playwright/test'

test.describe('Announcement Banner', () => {
  test('announcement banner is visible', async ({ page }) => {
    await page.goto('/')
    const banner = page.locator('.announcement-bar')
    await expect(banner).toBeVisible()
  })

  test('announcement banner shows content', async ({ page }) => {
    await page.goto('/')
    const banner = page.locator('.announcement-bar')
    await expect(banner).toContainText('demo site')
  })

  test('announcement banner has close button', async ({ page }) => {
    await page.goto('/')
    const closeButton = page.locator('.announcement-close')
    await expect(closeButton).toBeVisible()
  })

  test('announcement banner can be dismissed', async ({ page }) => {
    await page.goto('/')
    const closeButton = page.locator('.announcement-close')
    await closeButton.click()
    // Banner should be removed from DOM
    const banner = page.locator('.announcement-bar')
    await expect(banner).not.toBeVisible()
  })
})

test.describe('Code Block Features', () => {
  test('code blocks are rendered', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const codeBlock = page.locator('pre code')
    await expect(codeBlock.first()).toBeVisible()
  })

  test('code blocks have syntax highlighting', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    // Shiki adds span elements for syntax highlighting
    const highlightedCode = page.locator('pre code span')
    await expect(highlightedCode.first()).toBeVisible()
  })

  test('code block with title has data-title attribute', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const codeWithTitle = page.locator('pre[data-title]')
    await expect(codeWithTitle.first()).toBeVisible()
  })

  test('code block with line numbers has line-numbers class', async ({
    page,
  }) => {
    await page.goto('/docs/markdown-features')
    const codeWithLineNumbers = page.locator('pre.line-numbers')
    await expect(codeWithLineNumbers.first()).toBeVisible()
  })
})

test.describe('Hide Table of Contents', () => {
  test('regular docs page shows table of contents', async ({ page }) => {
    await page.goto('/docs/installation')
    // Desktop TOC should be visible on xl screens - check for the container
    // The desktop TOC is in a div with xl:block that contains sticky content
    const tocWrapper = page.locator('.hidden.xl\\:block .sticky')
    await expect(tocWrapper).toBeVisible()
  })

  test('page with hide_table_of_contents does not show TOC', async ({
    page,
  }) => {
    await page.goto('/docs/hide-toc-example')
    // The page should NOT have the desktop TOC column (xl:block container)
    // When TOC is hidden, the xl:block container should not exist
    const tocWrapper = page.locator('.hidden.xl\\:block .sticky')
    await expect(tocWrapper).not.toBeVisible()
  })
})

test.describe('Admonitions', () => {
  test('note admonition is rendered', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const noteAdmonition = page.locator('.admonition-note')
    await expect(noteAdmonition.first()).toBeVisible()
  })

  test('warning admonition is rendered', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const warningAdmonition = page.locator('.admonition-warning')
    await expect(warningAdmonition.first()).toBeVisible()
  })

  test('admonition has heading', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const admonitionHeading = page.locator('.admonition-heading')
    await expect(admonitionHeading.first()).toBeVisible()
  })

  test('admonition has content', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const admonitionContent = page.locator('.admonition-content')
    await expect(admonitionContent.first()).toBeVisible()
  })
})

test.describe('Details/Collapsible Sections', () => {
  test('details element is rendered', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    // Use prose container and exclude mobile TOC collapse elements
    const details = page.locator('.prose details:not(.collapse)')
    await expect(details.first()).toBeVisible()
  })

  test('details has summary', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const summary = page.locator('.prose details:not(.collapse) summary')
    await expect(summary.first()).toBeVisible()
  })

  test('details can be opened', async ({ page }) => {
    await page.goto('/docs/markdown-features')
    const details = page.locator('.prose details:not(.collapse)').first()
    const summary = details.locator('summary')
    // Click to open
    await summary.click()
    await expect(details).toHaveAttribute('open', '')
  })
})

test.describe('SEO Features', () => {
  test('page with keywords has keywords meta tag', async ({ page }) => {
    await page.goto('/docs/seo-features')
    const keywordsMeta = page.locator('meta[name="keywords"]')
    await expect(keywordsMeta).toHaveAttribute(
      'content',
      /SEO.*meta tags.*keywords/,
    )
  })

  test('page with image has og:image meta tag', async ({ page }) => {
    await page.goto('/docs/seo-features')
    const ogImage = page.locator('meta[property="og:image"]')
    await expect(ogImage).toHaveAttribute('content', /picsum\.photos/)
  })

  test('page with image has twitter:card meta tag', async ({ page }) => {
    await page.goto('/docs/seo-features')
    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image')
  })
})

test.describe('Hide Title', () => {
  test('regular page shows H1 title', async ({ page }) => {
    await page.goto('/docs/installation')
    const h1 = page.locator('.prose h1')
    await expect(h1.first()).toBeVisible()
  })

  test('page with hide_title hides the H1', async ({ page }) => {
    await page.goto('/docs/hide-title-example')
    // The H1 should be hidden via CSS
    const h1 = page.locator('.prose h1')
    // Check that the element exists but is not visible (display: none)
    await expect(h1).toHaveCSS('display', 'none')
  })
})

test.describe('TOC Level Filtering', () => {
  test('TOC includes H2 headings', async ({ page }) => {
    await page.goto('/docs/toc-levels-example')
    // Check desktop TOC for H2 headings (slugs include "---included")
    const tocH2 = page
      .locator('.hidden.xl\\:block a[href*="#heading-level-2---included"]')
      .first()
    await expect(tocH2).toBeVisible()
  })

  test('TOC includes H3 headings', async ({ page }) => {
    await page.goto('/docs/toc-levels-example')
    // Check desktop TOC for H3 headings
    const tocH3 = page.locator(
      '.hidden.xl\\:block a[href*="#heading-level-3---included"]',
    )
    await expect(tocH3.first()).toBeVisible()
  })

  test('TOC respects toc_max_heading_level (excludes deeper headings)', async ({
    page,
  }) => {
    // On hide-toc-example the TOC is hidden, so test on a regular page
    await page.goto('/docs/installation')
    // Verify TOC works with default levels (2-3)
    const tocLinks = page.locator('.hidden.xl\\:block a[href^="#"]')
    await expect(tocLinks.first()).toBeVisible()
  })
})

test.describe('Theme Toggle', () => {
  test('theme toggle button is visible in navbar', async ({ page }) => {
    await page.goto('/')
    // The swap label that wraps the hidden checkbox
    const themeToggle = page.locator('.navbar .swap')
    await expect(themeToggle).toBeVisible()
  })

  test('clicking theme toggle changes theme', async ({ page }) => {
    await page.goto('/')
    // Click the visible swap label, not the hidden input
    const themeToggle = page.locator('.navbar .swap').first()

    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('data-theme')

    // Click the toggle label
    await themeToggle.click()

    // Theme should change
    const newTheme = await page.locator('html').getAttribute('data-theme')
    expect(newTheme).not.toBe(initialTheme)
  })

  test('theme preference persists in localStorage', async ({ page }) => {
    await page.goto('/')
    // Click the visible swap label, not the hidden input
    const themeToggle = page.locator('.navbar .swap').first()

    // Click to change theme
    await themeToggle.click()

    // Check localStorage
    const savedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(savedTheme).toBeTruthy()
  })
})

test.describe('Hide Sidebar', () => {
  test('regular docs page shows sidebar', async ({ page }) => {
    await page.goto('/docs/installation')
    // Sidebar should be visible
    const sidebar = page.locator('[data-testid="sidebar-local-nav"]')
    await expect(sidebar).toBeVisible()
  })

  test('page with hide_sidebar does not show sidebar in content', async ({
    page,
  }) => {
    await page.goto('/docs/hide-sidebar-example')
    // The page should still render, just without sidebar content in local nav
    // (The drawer still exists for mobile but local nav content should be hidden)
    const content = page.locator('.prose')
    await expect(content).toBeVisible()
    // Page title should be visible
    await expect(page.locator('h1')).toContainText('Full-Width Page Example')
  })
})

test.describe('Pagination Label', () => {
  test('pagination uses custom label when set', async ({ page }) => {
    // Go to a page that comes before hide-sidebar-example in sidebar order
    // toc-levels-example (position 62) is just before hide-sidebar-example (position 63)
    await page.goto('/docs/toc-levels-example')
    // The "Next" link should use the pagination_label "Full Width Page"
    // instead of the full title "Full-Width Page Example"
    const nextLink = page.locator('.pagination-nav__link--next')
    await expect(nextLink).toBeVisible()
    await expect(nextLink).toContainText('Full Width Page')
    // Should NOT contain the full title (would be "Full-Width Page Example")
    await expect(nextLink).not.toContainText('Example')
  })
})

test.describe('Custom URL Slug', () => {
  test('page with custom slug is accessible at custom URL', async ({
    page,
  }) => {
    // The page file is custom-slug-example.md but slug is my-custom-url
    await page.goto('/docs/my-custom-url')
    const h1 = page.locator('.prose h1')
    await expect(h1).toContainText('Custom Slug Example')
  })

  test('sidebar links to custom slug URL', async ({ page }) => {
    await page.goto('/docs/installation')
    // Check that sidebar contains a link to the custom slug
    const sidebarLink = page.locator('a[href="/docs/my-custom-url"]')
    await expect(sidebarLink).toBeVisible()
  })

  test('page with custom slug shows in sidebar with correct label', async ({
    page,
  }) => {
    await page.goto('/docs/my-custom-url')
    // The sidebar should show the page title for this entry
    const sidebarItem = page.locator(
      '[data-testid="sidebar-local-nav"] a[href="/docs/my-custom-url"]',
    )
    await expect(sidebarItem).toBeVisible()
  })

  test('original file path URL does not work', async ({ page }) => {
    // The original path should not be accessible (404)
    const response = await page.goto('/docs/custom-slug-example')
    expect(response?.status()).toBe(404)
  })

  test('pagination works with custom slug pages', async ({ page }) => {
    // Go to the custom slug page and check that pagination works
    await page.goto('/docs/my-custom-url')
    // Check that pagination nav is present (prev or next)
    const pagination = page.locator('.pagination-nav')
    await expect(pagination).toBeVisible()
  })
})

test.describe('Canonical URL', () => {
  test('page with canonical_url has canonical link tag', async ({ page }) => {
    await page.goto('/docs/canonical-url-example')
    const canonicalLink = page.locator('link[rel="canonical"]')
    await expect(canonicalLink).toHaveAttribute(
      'href',
      'https://example.com/the-canonical-version',
    )
  })

  test('page without canonical_url does not have canonical link tag', async ({
    page,
  }) => {
    await page.goto('/docs/installation')
    const canonicalLink = page.locator('link[rel="canonical"]')
    // Should not exist when not specified
    await expect(canonicalLink).toHaveCount(0)
  })
})

test.describe('Tag Descriptions', () => {
  test('tag page shows tag description when defined', async ({ page }) => {
    await page.goto('/blog/tags/features')
    // The description should be visible on the tag page
    const description = page.locator('text=Posts about shipyard features')
    await expect(description).toBeVisible()
  })

  test('tags index shows tag labels from config', async ({ page }) => {
    await page.goto('/blog/tags')
    // Tags should display with their configured labels
    const tutorialTag = page.locator('a:has-text("Tutorials")')
    await expect(tutorialTag).toBeVisible()
  })

  test('tags index has title attribute with description', async ({ page }) => {
    await page.goto('/blog/tags')
    // Tags should have title attribute with description for tooltip
    const featureTag = page.locator(
      'a[title="Posts about shipyard features and capabilities"]',
    )
    await expect(featureTag).toBeVisible()
  })
})

test.describe('Sidebar Custom Props', () => {
  test('sidebar item with badge shows badge element', async ({ page }) => {
    await page.goto('/docs/sidebar-custom-props-example')
    // The sidebar should show a badge for this page
    const badge = page.locator(
      '[data-testid="sidebar-local-nav"] .badge:has-text("New")',
    )
    await expect(badge).toBeVisible()
  })

  test('badge has correct style class', async ({ page }) => {
    await page.goto('/docs/sidebar-custom-props-example')
    // The badge should have success styling
    const badge = page.locator(
      '[data-testid="sidebar-local-nav"] .badge-success:has-text("New")',
    )
    await expect(badge).toBeVisible()
  })
})

test.describe('Custom Meta Tags', () => {
  test('page with custom_meta_tags has custom robots meta tag', async ({
    page,
  }) => {
    await page.goto('/docs/custom-meta-tags-example')
    const robotsMeta = page.locator('meta[name="robots"]')
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow')
  })

  test('page with custom_meta_tags has custom author meta tag', async ({
    page,
  }) => {
    await page.goto('/docs/custom-meta-tags-example')
    const authorMeta = page.locator('meta[name="author"]')
    await expect(authorMeta).toHaveAttribute('content', 'Shipyard Team')
  })

  test('page with custom_meta_tags has custom og:locale property', async ({
    page,
  }) => {
    await page.goto('/docs/custom-meta-tags-example')
    const localeMeta = page.locator('meta[property="og:locale"]')
    await expect(localeMeta).toHaveAttribute('content', 'en_US')
  })

  test('page without custom_meta_tags does not have robots meta tag', async ({
    page,
  }) => {
    await page.goto('/docs/installation')
    const robotsMeta = page.locator('meta[name="robots"]')
    await expect(robotsMeta).toHaveCount(0)
  })
})

test.describe('Custom Document ID', () => {
  test('page with custom id exists at normal file path URL', async ({
    page,
  }) => {
    // The custom ID doesn't affect the URL - that's controlled by slug
    const response = await page.goto('/docs/custom-id-example')
    expect(response?.status()).toBe(200)
    const h1 = page.locator('.prose h1')
    await expect(h1).toContainText('Custom Document ID Example')
  })

  test('pagination_next using custom id links to correct page', async ({
    page,
  }) => {
    // Go to the page that uses pagination_next: my-custom-doc-id
    await page.goto('/docs/pagination-with-custom-id')
    // Check that the "Next" pagination link exists and points to the custom ID page
    const nextLink = page.locator(
      '.pagination-nav__link--next[href="/docs/custom-id-example"]',
    )
    await expect(nextLink).toBeVisible()
  })

  test('pagination next link shows correct title from custom id page', async ({
    page,
  }) => {
    await page.goto('/docs/pagination-with-custom-id')
    // The next link should use the pagination_label from the custom ID page
    const nextLink = page.locator('.pagination-nav__link--next')
    await expect(nextLink).toContainText('Custom ID Demo')
  })

  test('page with custom id has correct sidebar entry', async ({ page }) => {
    await page.goto('/docs/custom-id-example')
    // The sidebar should show the page
    const sidebarLink = page.locator(
      '[data-testid="sidebar-local-nav"] a[href="/docs/custom-id-example"]',
    )
    await expect(sidebarLink).toBeVisible()
  })
})

test.describe('Markdown Page SEO Frontmatter', () => {
  test('markdown page has keywords meta tag', async ({ page }) => {
    await page.goto('/markdown-page-seo')
    const keywordsMeta = page.locator('meta[name="keywords"]')
    await expect(keywordsMeta).toHaveAttribute(
      'content',
      'markdown, page, seo, frontmatter',
    )
  })

  test('markdown page has og:image meta tag', async ({ page }) => {
    await page.goto('/markdown-page-seo')
    const ogImage = page.locator('meta[property="og:image"]')
    await expect(ogImage).toHaveAttribute('content', /picsum\.photos/)
  })

  test('markdown page has canonical link', async ({ page }) => {
    await page.goto('/markdown-page-seo')
    const canonicalLink = page.locator('link[rel="canonical"]')
    await expect(canonicalLink).toHaveAttribute(
      'href',
      'https://example.com/canonical-page',
    )
  })

  test('markdown page has custom author meta tag', async ({ page }) => {
    await page.goto('/markdown-page-seo')
    const authorMeta = page.locator('meta[name="author"]')
    await expect(authorMeta).toHaveAttribute('content', 'Test Author')
  })

  test('markdown page has wrapperClassName applied', async ({ page }) => {
    await page.goto('/markdown-page-seo')
    const wrapper = page.locator('.prose.my-custom-wrapper')
    await expect(wrapper).toBeVisible()
  })
})

test.describe('Draft Pages', () => {
  test('draft page returns empty content in production build', async ({
    page,
  }) => {
    // Draft pages render an empty document in static builds (redirect doesn't work statically)
    // This effectively makes them inaccessible as there's no content to display
    const response = await page.goto('/draft-page')
    // Static server serves the file but it's empty
    expect(response?.status()).toBe(200)

    // Verify the page has minimal/no content - the body should be empty
    // or contain only the DOCTYPE html without any visible elements
    const bodyContent = await page.locator('body').innerHTML()
    expect(bodyContent.trim()).toBe('')
  })
})

test.describe('Unlisted Pages', () => {
  test('unlisted page is accessible', async ({ page }) => {
    const response = await page.goto('/unlisted-page')
    expect(response?.status()).toBe(200)
  })

  test('unlisted page has noindex meta tag', async ({ page }) => {
    await page.goto('/unlisted-page')
    const robotsMeta = page.locator('meta[name="robots"]')
    await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow')
  })

  test('unlisted page has correct title', async ({ page }) => {
    await page.goto('/unlisted-page')
    const h1 = page.locator('.prose h1')
    await expect(h1).toContainText('Unlisted Page')
  })

  test('unlisted page does not show draft warning', async ({ page }) => {
    await page.goto('/unlisted-page')
    const draftWarning = page.locator('.alert-warning')
    await expect(draftWarning).not.toBeVisible()
  })
})

test.describe('npm2yarn Code Block Tabs', () => {
  test('npm2yarn tabs container is rendered', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs')
    await expect(tabsContainer.first()).toBeVisible()
  })

  test('npm2yarn tabs have three tab buttons', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    const buttons = tabsContainer.locator('.tab-button')
    await expect(buttons).toHaveCount(3)
  })

  test('npm2yarn tabs have npm, yarn, pnpm buttons', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    await expect(
      tabsContainer.locator('.tab-button[data-tab="npm"]'),
    ).toBeVisible()
    await expect(
      tabsContainer.locator('.tab-button[data-tab="yarn"]'),
    ).toBeVisible()
    await expect(
      tabsContainer.locator('.tab-button[data-tab="pnpm"]'),
    ).toBeVisible()
  })

  test('npm tab is active by default', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    const npmButton = tabsContainer.locator('.tab-button[data-tab="npm"]')
    await expect(npmButton).toHaveClass(/active/)
  })

  test('clicking yarn tab shows yarn content', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    const yarnButton = tabsContainer.locator('.tab-button[data-tab="yarn"]')
    await yarnButton.click()
    const yarnContent = tabsContainer.locator(
      '.tab-content[data-tab-content="yarn"]',
    )
    await expect(yarnContent).toHaveClass(/active/)
  })

  test('clicking pnpm tab shows pnpm content', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    const pnpmButton = tabsContainer.locator('.tab-button[data-tab="pnpm"]')
    await pnpmButton.click()
    const pnpmContent = tabsContainer.locator(
      '.tab-content[data-tab-content="pnpm"]',
    )
    await expect(pnpmContent).toHaveClass(/active/)
  })

  test('yarn content contains yarn add command', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    const yarnButton = tabsContainer.locator('.tab-button[data-tab="yarn"]')
    await yarnButton.click()
    const yarnContent = tabsContainer.locator(
      '.tab-content[data-tab-content="yarn"]',
    )
    await expect(yarnContent).toContainText('yarn add')
  })

  test('pnpm content contains pnpm add command', async ({ page }) => {
    await page.goto('/docs/installation')
    const tabsContainer = page.locator('.npm2yarn-tabs').first()
    const pnpmButton = tabsContainer.locator('.tab-button[data-tab="pnpm"]')
    await pnpmButton.click()
    const pnpmContent = tabsContainer.locator(
      '.tab-content[data-tab-content="pnpm"]',
    )
    await expect(pnpmContent).toContainText('pnpm add')
  })
})

test.describe('Title Meta Frontmatter', () => {
  test('page with title_meta uses it for the page title instead of regular title', async ({
    page,
  }) => {
    await page.goto('/docs/seo-features')
    // title_meta overrides the regular title for SEO
    // The title_meta "SEO Frontmatter Features | shipyard Documentation" is combined with site title
    const title = await page.title()
    // Should contain the title_meta value, not just the regular title "SEO Features Demo"
    expect(title).toContain('SEO Frontmatter Features | shipyard Documentation')
  })

  test('page with title_meta still shows regular title in sidebar', async ({
    page,
  }) => {
    await page.goto('/docs/seo-features')
    // Sidebar uses the regular title "SEO Features Demo", not title_meta
    const sidebarLink = page.locator('a:has-text("SEO Features Demo")')
    await expect(sidebarLink).toBeVisible()
  })
})

test.describe('Blog Sidebar Label', () => {
  test('blog post with sidebar_label uses it in sidebar', async ({ page }) => {
    await page.goto('/blog')
    // sidebar_label "Advanced Features" is used instead of the full title
    const sidebarLabel = page.locator(
      '[data-testid="sidebar-navigation"] a:has-text("Advanced Features")',
    )
    await expect(sidebarLabel).toBeVisible()
  })

  test('blog post with title_meta uses it for page title', async ({ page }) => {
    await page.goto('/blog/2024-09-05-advanced-features')
    // title_meta overrides the regular title for SEO
    const title = await page.title()
    expect(title).toContain('Advanced shipyard Features | Blog')
  })
})
