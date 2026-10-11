import { i18n } from 'astro:config/server'
import config from 'virtual:shipyard/config'
import { getUiStrings, resolveLocale } from './ui'

export type { UiStringKey, UiStrings } from './ui'
export { formatUiString, getUiStrings, resolveLocale, uiStrings } from './ui'

/**
 * Locale of the page being rendered. Pass `Astro.currentLocale`.
 */
export const getPageLocale = (currentLocale: string | undefined) =>
  resolveLocale({
    currentLocale,
    i18nDefaultLocale: i18n?.defaultLocale,
    configLocale: config.locale,
  })

/**
 * shipyard's UI labels in the language of the page being rendered.
 * Pass `Astro.currentLocale`.
 */
export const useUiStrings = (currentLocale: string | undefined) =>
  getUiStrings(getPageLocale(currentLocale))
