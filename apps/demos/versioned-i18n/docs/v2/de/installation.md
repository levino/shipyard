---
title: Installation (v2)
description: Wie du das Projekt mit Version 2.0 installierst und einrichtest
sidebar_position: 1
---

# Installationsanleitung (v2)

Diese Anleitung behandelt die Installation der neuesten v2 Version.

## Voraussetzungen

- Node.js 18.x oder höher (v2 Anforderung)
- npm 9.x oder höher

## Schnellstart

```bash
# Neues Projekt erstellen
npm create astro@latest mein-projekt

# shipyard Pakete installieren
npm install @levino/shipyard-base @levino/shipyard-docs

# Entwicklungsserver starten
npm run dev
```

## Neu in v2

Der v2 Installationsprozess beinhaltet:

- **Automatisches TypeScript-Setup**: Keine manuelle Konfiguration nötig
- **Optimierte Abhängigkeiten**: Kleinere Installationsgröße
- **Integriertes Tailwind**: Vorkonfiguriertes Styling

## Nächste Schritte

Nach der Installation:

1. Konfiguriere dein Projekt - siehe [Konfiguration](/de/docs/v2/configuration)
2. Bei Upgrade von v1, siehe [Migrationsanleitung](/de/docs/v2/migration)
