---
title: Einfache Versionierung
sidebar_position: 1
description: Minimale Einrichtung für versionierte Dokumentation
---

# Beispiel: Einfache Versionierung

Eine minimale Konfiguration für versionierte Dokumentation mit zwei Versionen.

## Was Sie erhalten

- Zwei Versionen: v1 (veraltet) und v2 (aktuell)
- Versionsauswahl in Navigationsleiste und Seitenleiste
- Warnbanner für veraltete Dokumentation auf v1-Seiten
- `/latest/`-Alias für v2

## Zu erstellende/ändernde Dateien

### 1. astro.config.mjs

```javascript
import { defineConfig } from 'astro/config'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',
        available: [
          { version: 'v2', label: 'Version 2.0 (Aktuell)' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',
      },
    }),
  ],
})
```

### 2. src/content.config.ts

```typescript
import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2'],
    fallbackVersion: 'v2',
  }),
)

export const collections = { docs }
```

### 3. Verzeichnisstruktur

```
ihr-projekt/
├── astro.config.mjs
├── src/
│   └── content.config.ts
└── docs/
    ├── v2/
    │   ├── index.md
    │   ├── installation.md
    │   └── configuration.md
    └── v1/
        ├── index.md
        └── installation.md
```

### 4. Beispiel-Inhaltsdateien

**docs/v2/index.md**
```markdown
---
title: Willkommen
sidebar_position: 1
---

# Willkommen zu Version 2.0

Dies ist die aktuelle Version der Dokumentation.

## Neu in v2

- Neue Funktion A
- Verbesserte Funktion B
- Fehlerbehebungen

## Erste Schritte

Siehe [Installation](./installation) um zu beginnen.
```

**docs/v2/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Voraussetzungen

- Node.js 18+
- npm oder yarn

## Installieren

\`\`\`bash
npm install your-package@latest
\`\`\`
```

**docs/v2/configuration.md**
```markdown
---
title: Konfiguration
sidebar_position: 3
---

# Konfiguration

## Grundeinrichtung

Erstellen Sie eine Konfigurationsdatei:

\`\`\`javascript
export default {
  option1: true,
  option2: 'wert',
}
\`\`\`
```

**docs/v1/index.md**
```markdown
---
title: Willkommen
sidebar_position: 1
---

# Willkommen zu Version 1.0

Diese Dokumentation behandelt Version 1.0.

## Erste Schritte

Siehe [Installation](./installation) um zu beginnen.
```

**docs/v1/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Voraussetzungen

- Node.js 16+
- npm oder yarn

## Installieren

\`\`\`bash
npm install your-package@1.0
\`\`\`
```

## Generierte URLs

Nach dem Build erhalten Sie:

| URL | Inhalt |
|-----|--------|
| `/docs/` | Weiterleitung zu `/docs/v2/` |
| `/docs/v2/` | v2-Willkommensseite |
| `/docs/v2/installation` | v2-Installationsanleitung |
| `/docs/v2/configuration` | v2-Konfigurationsanleitung |
| `/docs/v1/` | v1-Willkommensseite (mit Warnbanner) |
| `/docs/v1/installation` | v1-Installationsanleitung |
| `/docs/latest/` | Alias für `/docs/v2/` |
| `/docs/latest/installation` | Alias für `/docs/v2/installation` |

## Nächste Schritte

- Fügen Sie weitere Versionen hinzu, indem Sie neue Versionsverzeichnisse erstellen und die Konfiguration aktualisieren
- Siehe [Dokumentations-Versionierung](../guides/versioning) für erweiterte Konfigurationsoptionen
- Siehe [Migration zu versionierter Dokumentation](../guides/migration-to-versioned) wenn Sie bestehende Dokumentation haben

