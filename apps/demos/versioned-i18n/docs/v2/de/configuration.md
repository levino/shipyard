---
title: Konfiguration (v2)
description: Konfiguriere deine v2 Projekteinstellungen
sidebar_position: 2
---

# Konfigurationsanleitung (v2)

Diese Seite behandelt alle Konfigurationsoptionen in v2.

## Grundkonfiguration

Erstelle oder aktualisiere deine `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyard({
      title: 'Mein Projekt',
      brand: 'Meine Marke',
    }),
    shipyardDocs({
      showLastUpdateTime: true,
    }),
  ],
})
```

## Neu in v2

- **Versionierungsunterstützung**: Konfiguriere mehrere Dokumentationsversionen
- **i18n-Integration**: Eingebaute Internationalisierungsunterstützung
- **Erweiterte Navigation**: Verbesserte Sidebar-Konfiguration

## Umgebungsvariablen

```bash
# .env
SITE_URL=https://example.com
```

## Verwandte Themen

- [Installation](/de/docs/v2/installation)
- [Migration von v1](/de/docs/v2/migration)
