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
}
