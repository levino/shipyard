export interface NavigationEntry {
  label?: string
  href?: string
  subEntry?: NavigationTree
  active?: boolean
}

export type NavigationTree = Record<string, NavigationEntry>

export type Config = {
  brand: string
  navigation: NavigationTree
  title: string
  tagline: string
  locales: string[]
  defaultLocale: string
}
