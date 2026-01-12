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
 * A single footer link.
 * Exactly one of `to` (internal link) or `href` (external link) must be provided.
 */
export type FooterLink =
  | {
      /**
       * Display text for the link.
       */
      label: string
      /**
       * Client-side routing path. Use for internal links.
       */
      to: string
      href?: never
    }
  | {
      /**
       * Display text for the link.
       */
      label: string
      /**
       * Full URL for external links.
       */
      href: string
      to?: never
    }

/**
 * A column of footer links with a title.
 * Used for multi-column footer layouts.
 */
export interface FooterLinkColumn {
  /**
   * Column title displayed above the links.
   */
  title: string
  /**
   * Links within this column.
   */
  items: FooterLink[]
}

/**
 * Footer logo configuration.
 */
export interface FooterLogo {
  /**
   * Alt text for the logo image.
   */
  alt: string
  /**
   * Logo image source URL.
   */
  src: string
  /**
   * Optional dark mode logo source.
   */
  srcDark?: string
  /**
   * Link URL when clicking the logo.
   */
  href?: string
  /**
   * Logo width in pixels.
   */
  width?: number
  /**
   * Logo height in pixels.
   */
  height?: number
}

/**
 * Footer configuration.
 * Supports both simple (single row of links) and multi-column layouts.
 */
export interface FooterConfig {
  /**
   * Footer color theme.
   * @default 'light'
   */
  style?: 'light' | 'dark'
  /**
   * Footer links. Can be a flat array of links (simple footer)
   * or an array of columns with titles (multi-column footer).
   */
  links?: (FooterLink | FooterLinkColumn)[]
  /**
   * Copyright notice displayed at the bottom of the footer.
   * Supports HTML for links and formatting.
   */
  copyright?: string
  /**
   * Optional footer logo.
   */
  logo?: FooterLogo
}

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
   * Footer configuration.
   * Customize footer links, copyright notice, and styling.
   */
  footer?: FooterConfig
  /**
   * Hide the "Built with Shipyard" branding in the footer.
   * Set to true to remove the branding link.
   * @default false
   */
  hideBranding?: boolean
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
