import type { AstroConfig } from 'astro'

export interface NavigationEntry {
  label?: string
  href?: string
  subEntry?: NavigationTree
  active?: boolean
}

export type NavigationTree = Record<string, NavigationEntry>

export type Script = string | astroHTML.JSX.IntrinsicElements['script']

export interface Config {
  brand: string
  navigation: NavigationTree
  title: string
  tagline: string
  scripts?: Script[]
}

export interface FinalConfig extends Config {
  i18n?: AstroConfig['i18n']
}
