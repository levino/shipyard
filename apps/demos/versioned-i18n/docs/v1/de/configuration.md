---
title: Konfiguration (v1)
description: Konfiguriere deine v1 Projekteinstellungen
sidebar_position: 2
---

# Konfigurationsanleitung (v1)

> **Hinweis**: Dies ist die Dokumentation für v1. Für die neueste Version, siehe die [v2 Konfigurationsanleitung](/de/docs/v2/configuration).

Diese Seite behandelt Konfigurationsoptionen in v1.

## Grundkonfiguration

Erstelle deine `astro.config.mjs`:

```javascript
import { shipyard } from '@levino/shipyard-base'
import { shipyardDocs } from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyard({
      title: 'Mein Projekt',
    }),
    shipyardDocs(),
  ],
})
```

## Verfügbare Optionen

| Option | Typ | Beschreibung |
|--------|-----|--------------|
| title | string | Seitentitel |
| brand | string | Markenname |
| navigation | object | Navigationslinks |

## Umgebungsvariablen

```bash
# .env
SITE_URL=https://example.com
```

## Upgrade

Für die neuesten Konfigurationsoptionen, upgrade auf [v2](/de/docs/v2/configuration).
