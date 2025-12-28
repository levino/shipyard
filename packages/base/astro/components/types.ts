export type Entry = Record<
  string,
  {
    label?: string
    href?: string
    subEntry?: Entry
    active?: boolean
    className?: string
    /**
     * If true, shows a copy-to-clipboard button next to the link.
     * Useful for llms.txt links that users want to paste into prompts.
     */
    copyUrl?: boolean
  }
>
