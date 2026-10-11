import { describe, expect, it } from 'vitest'
import { formatUiString, getUiStrings, resolveLocale, uiStrings } from './ui'

describe('getUiStrings', () => {
  it('returns English labels without a locale', () => {
    expect(getUiStrings(undefined).onThisPage).toBe('On this page')
  })

  it('returns German labels for de', () => {
    expect(getUiStrings('de').onThisPage).toBe('Auf dieser Seite')
  })

  it('falls back from a region subtag to the language', () => {
    expect(getUiStrings('de-AT').onThisPage).toBe('Auf dieser Seite')
    expect(getUiStrings('DE').next).toBe('Weiter')
  })

  it('falls back to English for unknown languages', () => {
    expect(getUiStrings('xx').onThisPage).toBe('On this page')
  })

  it('has the same keys in every language', () => {
    const keys = Object.keys(uiStrings.en).sort()
    for (const strings of Object.values(uiStrings)) {
      expect(Object.keys(strings).sort()).toEqual(keys)
    }
  })
})

describe('resolveLocale', () => {
  it('prefers the current route locale', () => {
    expect(
      resolveLocale({
        currentLocale: 'en',
        i18nDefaultLocale: 'de',
        configLocale: 'fr',
      }),
    ).toBe('en')
  })

  it('falls back to the i18n default locale, then the config locale', () => {
    expect(resolveLocale({ i18nDefaultLocale: 'de', configLocale: 'fr' })).toBe(
      'de',
    )
    expect(resolveLocale({ configLocale: 'de' })).toBe('de')
    expect(resolveLocale({})).toBeUndefined()
  })
})

describe('formatUiString', () => {
  it('fills placeholders and keeps unknown ones', () => {
    expect(formatUiString('von {author}', { author: 'Levin' })).toBe(
      'von Levin',
    )
    expect(formatUiString('{missing}', {})).toBe('{missing}')
  })
})
