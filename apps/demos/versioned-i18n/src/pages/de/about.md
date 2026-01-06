---
title: Über
description: Über diese versionierte i18n Dokumentations-Demo
layout: '@levino/shipyard-base/layouts/Markdown.astro'
---

# Über diese Demo

Diese Demo-Anwendung zeigt **Dokumentationsversionierung kombiniert mit Internationalisierung** in shipyard.

## Zweck

Die versioned-i18n Demo demonstriert:

- Wie man mehrere Dokumentationsversionen mit i18n konfiguriert
- Wie der Versionsauswähler und Sprachumschalter zusammenarbeiten
- Wie Inhalte nach Version und Sprache organisiert werden
- Die URL-Struktur für versionierte, lokalisierte Dokumentation

## Technische Details

### Verzeichnisstruktur

```
docs/
├── v1/
│   ├── en/
│   │   ├── index.md
│   │   ├── installation.md
│   │   └── configuration.md
│   └── de/
│       ├── index.md
│       ├── installation.md
│       └── configuration.md
└── v2/
    ├── en/
    │   ├── index.md
    │   ├── installation.md
    │   ├── configuration.md
    │   └── migration.md
    └── de/
        ├── index.md
        ├── installation.md
        ├── configuration.md
        └── migration.md
```

### Konfiguration

Die Konfiguration kombiniert Astro's i18n mit shipyard's Versionierung:

- `i18n.locales`: Verfügbare Sprachen (en, de)
- `versions.current`: Die angezeigte Standardversion
- `versions.available`: Alle Versionen mit Labels

## Anwendungsfälle

Versionierte i18n-Dokumentation ist ideal für:

- **Globale Softwareprodukte**: Verschiedene Versionen in mehreren Sprachen
- **Internationale APIs**: Versionierte API-Docs für weltweite Entwickler
- **Enterprise-Lösungen**: Regionsspezifische versionierte Dokumentation

## Verwandt

- [Startseite](/de/)
- [v2 Dokumentation](/de/docs/v2/)
- [v1 Dokumentation](/de/docs/v1/)
- [Englische Version dieser Seite](/en/about)
