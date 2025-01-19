export type Entry = Record<
  string,
  {
    label?: string
    href?: string
    subEntry?: Entry
    active?: boolean
  }
>
