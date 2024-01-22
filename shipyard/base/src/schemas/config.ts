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
  meta: {
    title: string
    description: string
  }
}
