import { execFileSync } from 'node:child_process'

export interface GitMetadata {
  lastUpdated?: Date
  lastAuthor?: string
}

/**
 * Gets git metadata for a file (last commit date and author).
 * This function executes git commands to retrieve the information.
 *
 * @param filePath - Absolute path to the file
 * @returns Git metadata including last updated date and author, or empty object if git info unavailable
 */
export function getGitMetadata(filePath: string): GitMetadata {
  try {
    // Get the last commit date for the file
    const dateOutput = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', filePath],
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim()

    // Get the last commit author for the file
    const authorOutput = execFileSync(
      'git',
      ['log', '-1', '--format=%an', '--', filePath],
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim()

    return {
      lastUpdated: dateOutput ? new Date(dateOutput) : undefined,
      lastAuthor: authorOutput || undefined,
    }
  } catch {
    // Git command failed (not a git repo, file not tracked, etc.)
    return {}
  }
}

/**
 * Generates an edit URL for a documentation file.
 *
 * @param editUrlBase - The base URL for editing (e.g., 'https://github.com/user/repo/edit/main/docs')
 * @param docId - The document ID (file path relative to the docs directory)
 * @returns The full URL to edit the document, or undefined if no base URL provided
 */
export function getEditUrl(
  editUrlBase: string | undefined,
  docId: string,
): string | undefined {
  if (!editUrlBase) return undefined

  // Ensure the base URL doesn't end with a slash and the docId doesn't start with one
  const normalizedBase = editUrlBase.replace(/\/+$/, '')
  const normalizedDocId = docId.replace(/^\/+/, '')

  // Add .md extension if not present
  const fileId = normalizedDocId.endsWith('.md')
    ? normalizedDocId
    : `${normalizedDocId}.md`

  return `${normalizedBase}/${fileId}`
}
