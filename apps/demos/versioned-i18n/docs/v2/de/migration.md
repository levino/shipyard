---
title: Migration zu v2
description: Wie du von v1 auf v2 migrierst
sidebar_position: 3
---

# Migrationsanleitung: v1 zu v2

Diese Anleitung hilft dir beim Upgrade von v1 auf v2.

## Überblick

v2 bringt signifikante Verbesserungen und erhält wo möglich Abwärtskompatibilität.

## Breaking Changes

1. **Node.js 18+ erforderlich**: v2 unterstützt Node.js 16 nicht mehr
2. **Konfigurationsänderungen**: Einige Optionen wurden umbenannt
3. **Import-Pfade**: Einige Imports haben sich geändert

## Schritt-für-Schritt Migration

### 1. Abhängigkeiten aktualisieren

```bash
npm install @levino/shipyard-base@latest @levino/shipyard-docs@latest
```

### 2. Konfiguration aktualisieren

```diff
// astro.config.mjs
- import { shipyard } from '@levino/shipyard-base'
+ import shipyard from '@levino/shipyard-base'
```

### 3. Inhalte aktualisieren

Überprüfe deine Inhalte auf veraltete Funktionen und aktualisiere entsprechend.

## Hilfe bekommen

Wenn du bei der Migration auf Probleme stößt:

1. Schau in die [Konfigurationsanleitung](/de/docs/v2/configuration)
2. Sieh dir die [v1 Dokumentation](/de/docs/v1/) als Referenz an
