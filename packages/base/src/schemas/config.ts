import type { AstroConfig } from 'astro'

export interface NavigationEntry {
  label?: string
  href?: string
  subEntry?: NavigationTree
  active?: boolean
}

export type NavigationTree = Record<string, NavigationEntry>

export interface Config {
  brand: string
  navigation: NavigationTree
  title: string
  tagline: string
}

export interface FinalConfig extends Config {
  i18n: NonNullable<AstroConfig['i18n']>
}
