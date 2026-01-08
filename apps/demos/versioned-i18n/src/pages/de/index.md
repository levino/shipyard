---
title: Versionierte i18n Demo
description: Demonstration der Dokumentationsversionierung von shipyard mit Internationalisierung
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Versionierte i18n Demo

Willkommen zur **Demo für versionierte internationalisierte Dokumentation**! Diese Demo zeigt shipyard's Versionierung kombiniert mit i18n-Unterstützung.

## Was ist diese Demo?

Diese Demo kombiniert zwei leistungsstarke shipyard-Funktionen:

1. **Dokumentationsversionierung**: Mehrere Versionen der Dokumentation verwalten
2. **Internationalisierung (i18n)**: Dokumentation in mehreren Sprachen bereitstellen

## Demonstrierte Funktionen

- **Versionsauswähler**: Zwischen v1 und v2 Dokumentation wechseln
- **Sprachumschalter**: Zwischen Englisch und Deutsch wechseln
- **Kombinierte URLs**: Routen wie `/de/docs/v2/installation` oder `/en/docs/v1/installation`
- **Lokalisierter Inhalt**: Jede Version hat Übersetzungen für jede Sprache

## Verfügbare Versionen

| Version | Status | Beschreibung |
|---------|--------|--------------|
| [v2](/de/docs/v2/) | **Aktuell** | Neueste stabile Version |
| [v1](/de/docs/v1/) | Veraltet | Vorherige Version |

## Verfügbare Sprachen

- 🇩🇪 **Deutsch** (aktuell)
- 🇬🇧 [English](/en/)

## URL-Struktur

Das URL-Muster ist: `/{locale}/docs/{version}/{seite}`

Beispiele:
- `/de/docs/v2/installation` - Deutsch, Version 2, Installationsseite
- `/en/docs/v1/configuration` - Englisch, Version 1, Konfigurationsseite

## Erste Schritte

1. **Dokumentation durchsuchen**: [v2 Dokumentation](/de/docs/v2/)
2. **Version wechseln**: Nutze den Versionsauswähler in der Navigation
3. **Sprache ändern**: Nutze den Sprachumschalter

## Implementierung

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: true },
  },
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',
        available: [
          { version: 'v2', label: 'Version 2.0 (Latest)' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',
      },
    }),
  ],
})
```
