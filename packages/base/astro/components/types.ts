export type Entry = Record<
  string,
  {
    label?: string
    href?: string
    subEntry?: Entry
    active?: boolean
    className?: string
    // biome-ignore lint/suspicious/noExplicitAny: Allow any props
    customProps?: Record<string, any>
  }
>
