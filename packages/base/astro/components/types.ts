export type Entry = Record<
  string,
  {
    label?: string
    /**
     * Pre-rendered HTML content to use instead of the label string.
     * When provided, this will be rendered using set:html instead of the plain label.
     * Useful for custom label components like buttons, icons, or interactive elements.
     * This implements Docusaurus's sidebar `html` type functionality.
     */
    labelHtml?: string
    /**
     * When true, applies default menu styling to HTML content.
     * Only applies when labelHtml is set.
     * Corresponds to Docusaurus's `defaultStyle` property for html sidebar items.
     * @default false
     */
    defaultStyle?: boolean
    href?: string
    subEntry?: Entry
    active?: boolean
    className?: string
    /**
     * Custom properties for sidebar item.
     * Can be used for badges, icons, or other custom rendering.
     */
    customProps?: Record<string, unknown>
    /**
     * Whether the category can be collapsed.
     * From _category_.json/yml configuration.
     * @default true
     */
    collapsible?: boolean
    /**
     * Whether the category is collapsed by default.
     * From _category_.json/yml configuration.
     * @default true
     */
    collapsed?: boolean
  }
>
