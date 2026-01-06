export type Entry = Record<
  string,
  {
    label?: string
    /**
     * Pre-rendered HTML content to use instead of the label string.
     * When provided, this will be rendered using set:html instead of the plain label.
     * Useful for custom label components like buttons, icons, or interactive elements.
     */
    labelHtml?: string
    href?: string
    subEntry?: Entry
    active?: boolean
    className?: string
    /** Can category be collapsed (default: true) */
    collapsible?: boolean
    /** Initial collapsed state (default: true) */
    collapsed?: boolean
    /**
     * Custom properties for the sidebar entry.
     * Used for badges and other custom styling.
     */
    customProps?: Record<string, unknown>
  }
>
