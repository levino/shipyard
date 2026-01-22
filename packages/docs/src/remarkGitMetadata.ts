/**
 * Remark plugin that extracts git metadata at build time and adds it to frontmatter.
 *
 * This plugin runs during Astro's content processing pipeline, which executes at build time.
 * It uses Node.js child_process to get git info, but since this runs during build
 * (not at SSR request time), it doesn't affect edge runtime compatibility.
 *
 * The extracted metadata is stored in frontmatter fields:
 * - _gitLastUpdated: ISO date string of last commit
 * - _gitLastAuthor: Name of last commit author
 *
 * Usage in astro.config.mjs:
 * ```ts
 * import { remarkGitMetadata } from '@levino/shipyard-docs'
 *
 * export default defineConfig({
 *   markdown: {
 *     remarkPlugins: [remarkGitMetadata],
 *   },
 * })
 * ```
 */
import { execFileSync } from 'node:child_process'
import type { Root } from 'mdast'
import type { VFile } from 'vfile'

export interface RemarkGitMetadataOptions {
  /**
   * Whether to extract the last updated timestamp.
   * @default true
   */
  showLastUpdateTime?: boolean
  /**
   * Whether to extract the last author name.
   * @default true
   */
  showLastUpdateAuthor?: boolean
}

/**
 * Get git metadata for a file path.
 * This is called at build time, not at runtime.
 */
function getGitInfo(filePath: string): {
  lastUpdated?: string
  lastAuthor?: string
} {
  try {
    const dateOutput = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', filePath],
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()

    const authorOutput = execFileSync(
      'git',
      ['log', '-1', '--format=%an', '--', filePath],
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()

    return {
      lastUpdated: dateOutput || undefined,
      lastAuthor: authorOutput || undefined,
    }
  } catch {
    // Git command failed (not a git repo, file not tracked, etc.)
    return {}
  }
}

/**
 * Remark plugin that injects git metadata into the frontmatter.
 */
export function remarkGitMetadata(
  options: RemarkGitMetadataOptions = {},
): (tree: Root, file: VFile) => void {
  const { showLastUpdateTime = true, showLastUpdateAuthor = true } = options

  return (_tree: Root, file: VFile) => {
    // Get the file path from the VFile
    const filePath = file.path || file.history[0]
    if (!filePath) return

    // Only process if we need git metadata
    if (!showLastUpdateTime && !showLastUpdateAuthor) return

    // Get git info
    const gitInfo = getGitInfo(filePath)

    // Inject into frontmatter data
    // Astro stores frontmatter in file.data.astro.frontmatter
    if (!file.data) file.data = {}
    if (!file.data.astro) file.data.astro = {}
    if (!file.data.astro.frontmatter) file.data.astro.frontmatter = {}

    const frontmatter = file.data.astro.frontmatter as Record<string, unknown>

    if (showLastUpdateTime && gitInfo.lastUpdated) {
      frontmatter._gitLastUpdated = gitInfo.lastUpdated
    }

    if (showLastUpdateAuthor && gitInfo.lastAuthor) {
      frontmatter._gitLastAuthor = gitInfo.lastAuthor
    }
  }
}

export default remarkGitMetadata
