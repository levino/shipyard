export interface NavigationEntry {
  label?: string
  href?: string
  subEntry?: NavigationTree
  active?: boolean
  /**
   * Custom HTML to render as the label (for special sidebar items).
   * When provided, this takes precedence over the label.
   */
  labelHtml?: string
}

export type NavigationTree = Record<string, NavigationEntry>

export type Script = string | astroHTML.JSX.IntrinsicElements['script']

/**
 * Announcement bar configuration.
 * Displays a dismissible banner above the navbar.
 */
export interface AnnouncementBar {
  /**
   * Unique identifier for the announcement.
   * Used to remember if the user has dismissed it.
   * @default 'announcement-bar'
   */
  id?: string
  /**
   * Content of the announcement bar.
   * Supports HTML for links and formatting.
   */
  content: string
  /**
   * Background color of the bar.
   * @default 'primary'
   */
  backgroundColor?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | string
  /**
   * Text color of the bar.
   * @default 'primary-content'
   */
  textColor?:
    | 'primary-content'
    | 'secondary-content'
    | 'accent-content'
    | 'base-content'
    | string
  /**
   * Whether the announcement bar can be dismissed.
   * @default true
   */
  isCloseable?: boolean
}

/**
 * Behavior for handling broken internal links during build.
 * - 'ignore': Don't check for broken links
 * - 'log': Log broken links but don't affect build
 * - 'warn': Log warnings for broken links
 * - 'throw': Throw an error and fail the build on broken links
 */
export type OnBrokenLinksAction = 'ignore' | 'log' | 'warn' | 'throw'

/**
 * Behavior for handling broken markdown links during build.
 * - 'ignore': Don't check for broken markdown links
 * - 'log': Log broken links but don't affect build
 * - 'warn': Log warnings for broken markdown links
 * - 'throw': Throw an error and fail the build on broken markdown links
 */
export type OnBrokenMarkdownLinksAction = 'ignore' | 'log' | 'warn' | 'throw'

export interface Config {
  brand: string
  navigation: NavigationTree
  title: string
  tagline: string
  scripts?: Script[]
  /**
   * Announcement bar configuration.
   * Shows a dismissible banner at the top of the page.
   */
  announcementBar?: AnnouncementBar
  /**
   * The behavior of Shipyard when it detects any broken internal link.
   * By default, it logs a warning. Set to 'throw' to fail the build on broken links.
   * Only runs during production builds.
   * @default 'warn'
   */
  onBrokenLinks?: OnBrokenLinksAction
  /**
   * The behavior of Shipyard when it detects any broken markdown link.
   * By default, it logs a warning. Set to 'throw' to fail the build on broken links.
   * Only runs during production builds.
   * @default 'warn'
   */
  onBrokenMarkdownLinks?: OnBrokenMarkdownLinksAction
}
