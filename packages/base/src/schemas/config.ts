import type { AstroConfig } from 'astro'

export interface NavigationEntry {
  label?: string
  href?: string
  subEntry?: NavigationTree
  active?: boolean
}

export type NavigationTree = Record<string, NavigationEntry>

export interface ScriptConfig {
  src: string
  async?: boolean
  defer?: boolean
  type?: string
  crossorigin?: string
  integrity?: string
  referrerpolicy?: string
  [key: string]: string | boolean | undefined
}

export type Script = string | ScriptConfig

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
