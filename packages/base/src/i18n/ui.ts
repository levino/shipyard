/**
 * Built-in labels of shipyard's UI (table of contents, navigation, docs
 * footer, …). Pure data and helpers so they can be unit-tested; the Astro
 * glue that picks the page's locale lives in `./index.ts`.
 */
export const uiStrings = {
  en: {
    onThisPage: 'On this page',
    skipToContent: 'Skip to content',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeSidebar: 'Close sidebar',
    mainMenu: 'Main menu',
    theme: 'Theme',
    previous: 'Previous',
    next: 'Next',
    docsNavigation: 'Docs navigation',
    lastUpdated: 'Last updated:',
    lastUpdatedBy: 'by {author}',
    editThisPage: 'Edit this page',
    draftNotice: 'This page is a draft and will not be visible in production.',
    closeAnnouncement: 'Close announcement',
    contentTabs: 'Content tabs',
  },
  de: {
    onThisPage: 'Auf dieser Seite',
    skipToContent: 'Zum Inhalt springen',
    menu: 'Menü',
    openMenu: 'Menü öffnen',
    closeSidebar: 'Seitenleiste schließen',
    mainMenu: 'Hauptmenü',
    theme: 'Design',
    previous: 'Zurück',
    next: 'Weiter',
    docsNavigation: 'Navigation in der Dokumentation',
    lastUpdated: 'Zuletzt aktualisiert:',
    lastUpdatedBy: 'von {author}',
    editThisPage: 'Diese Seite bearbeiten',
    draftNotice:
      'Diese Seite ist ein Entwurf und erscheint nicht in der Produktion.',
    closeAnnouncement: 'Ankündigung schließen',
    contentTabs: 'Inhalts-Tabs',
  },
} as const satisfies Record<string, Record<string, string>>

export type UiStringKey = keyof (typeof uiStrings)['en']
export type UiStrings = Record<UiStringKey, string>

export const defaultUiLocale = 'en'

/**
 * Returns the UI labels for a locale. Region subtags fall back to the
 * language (`de-AT` → `de`); unknown languages fall back to English.
 */
export const getUiStrings = (locale: string | undefined): UiStrings => {
  if (!locale) return uiStrings.en
  const normalized = locale.toLowerCase()
  const language = normalized.split('-')[0] ?? normalized
  const strings =
    (uiStrings as Record<string, UiStrings>)[normalized] ??
    (uiStrings as Record<string, UiStrings>)[language]
  return strings ?? uiStrings.en
}

/**
 * The locale a page is rendered in: the current i18n route locale, else
 * Astro's i18n default locale, else the `locale` set in the shipyard config.
 * `undefined` when none of them is set.
 */
export const resolveLocale = ({
  currentLocale,
  i18nDefaultLocale,
  configLocale,
}: {
  currentLocale?: string | undefined
  i18nDefaultLocale?: string | undefined
  configLocale?: string | undefined
}): string | undefined => currentLocale ?? i18nDefaultLocale ?? configLocale

/** Replaces `{name}` placeholders in a label. */
export const formatUiString = (
  template: string,
  values: Record<string, string>,
): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
