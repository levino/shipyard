import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { AstroIntegrationLogger } from 'astro'
import type { OnBrokenLinksAction } from '../schemas/config'

export interface BrokenLink {
  /** The source file where the broken link was found */
  sourceFile: string
  /** The broken link href */
  href: string
  /** The line number where the link was found (if available) */
  line?: number
}

export interface LinkCheckResult {
  /** Total number of links checked */
  totalLinks: number
  /** Number of broken links found */
  brokenCount: number
  /** Details of each broken link */
  brokenLinks: BrokenLink[]
}

/**
 * Recursively finds all HTML files in a directory
 */
function findHtmlFiles(dir: string): string[] {
  const files: string[] = []

  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath))
    } else if (entry.endsWith('.html')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extracts all internal links from an HTML file
 * Returns links that start with / (internal links)
 */
function extractInternalLinks(html: string): { href: string; line: number }[] {
  const links: { href: string; line: number }[] = []
  const lines = html.split('\n')

  // Match href attributes that start with /
  // Excludes: external URLs (http/https), anchors (#), javascript:, mailto:, tel:
  const hrefRegex = /href=["']([^"']+)["']/g

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    for (const match of line.matchAll(hrefRegex)) {
      const href = match[1]

      // Skip external URLs, anchors, and special protocols
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('data:')
      ) {
        continue
      }

      // Only include internal links (start with /)
      if (href.startsWith('/')) {
        links.push({ href, line: i + 1 })
      }
    }
  }

  return links
}

/**
 * Normalizes a link path for checking
 * Handles trailing slashes and index.html
 */
function normalizePath(href: string): string[] {
  // Remove query string and hash
  const path = href.split('?')[0].split('#')[0]

  // Generate possible file paths to check
  const paths: string[] = []

  if (path.endsWith('/')) {
    // /foo/ -> check /foo/index.html
    paths.push(`${path}index.html`)
    // Also check /foo.html (some sites use this pattern)
    paths.push(`${path.slice(0, -1)}.html`)
  } else if (path.endsWith('.html')) {
    // /foo.html -> check as-is
    paths.push(path)
  } else if (path.includes('.')) {
    // /foo.css, /foo.js, etc. -> check as-is (asset files)
    paths.push(path)
  } else {
    // /foo -> check /foo/index.html, /foo.html, and /foo (directory)
    paths.push(`${path}/index.html`)
    paths.push(`${path}.html`)
    paths.push(path)
  }

  return paths
}

/**
 * Checks if a link target exists in the build output
 */
function linkExists(href: string, buildDir: string): boolean {
  const possiblePaths = normalizePath(href)

  for (const path of possiblePaths) {
    // Remove leading slash and join with build dir
    const fullPath = join(buildDir, path.startsWith('/') ? path.slice(1) : path)

    if (existsSync(fullPath)) {
      return true
    }
  }

  return false
}

/**
 * Checks all internal links in the build output directory
 */
export function checkLinks(buildDir: string): LinkCheckResult {
  const htmlFiles = findHtmlFiles(buildDir)
  const brokenLinks: BrokenLink[] = []
  let totalLinks = 0

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf-8')
    const links = extractInternalLinks(html)

    for (const link of links) {
      totalLinks++

      if (!linkExists(link.href, buildDir)) {
        brokenLinks.push({
          sourceFile: relative(buildDir, file),
          href: link.href,
          line: link.line,
        })
      }
    }
  }

  return {
    totalLinks,
    brokenCount: brokenLinks.length,
    brokenLinks,
  }
}

/**
 * Reports broken links according to the configured action
 */
export function reportBrokenLinks(
  result: LinkCheckResult,
  action: OnBrokenLinksAction,
  logger: AstroIntegrationLogger,
): void {
  if (action === 'ignore' || result.brokenCount === 0) {
    if (result.brokenCount === 0 && action !== 'ignore') {
      logger.info(`Link check passed: ${result.totalLinks} links verified`)
    }
    return
  }

  const message = `Found ${result.brokenCount} broken link${result.brokenCount === 1 ? '' : 's'}:`
  const details = result.brokenLinks
    .map(
      (link) =>
        `  - ${link.href} (in ${link.sourceFile}${link.line ? `:${link.line}` : ''})`,
    )
    .join('\n')

  const fullMessage = `${message}\n${details}`

  switch (action) {
    case 'log':
      logger.info(fullMessage)
      break
    case 'warn':
      logger.warn(fullMessage)
      break
    case 'throw':
      throw new Error(`Broken links found:\n${details}`)
  }
}
