---
title: Versionierung mit i18n
sidebar_position: 2
description: Dokumentations-Versionierung mit Internationalisierung kombinieren
---

# Versionierung mit i18n Beispiel

Kombinieren Sie versionierte Dokumentation mit mehreren Sprachen. Jede Version kann Inhalte in allen unterstützten Sprachen haben.

## Was Sie erhalten

- Zwei Versionen: v1 (veraltet) und v2 (aktuell)
- Zwei Sprachen: Englisch (Standard) und Deutsch
- Versionsauswahl und Sprachwechsler in der Navigationsleiste
- URLs wie `/en/docs/v2/installation` und `/de/docs/v1/configuration`
- Warnbanner für veraltete Version auf v1-Seiten in allen Sprachen

## Zu erstellende/ändernde Dateien

### 1. astro.config.mjs

```javascript
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  site: 'https://your-site.com',
  redirects: {
    '/': {
      status: 302,
      destination: 'en',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    shipyard({
      navigation: {
        docs: {
          label: 'Dokumentation',
          href: '/docs/v2/',
        },
      },
      title: 'Mein Projekt',
      brand: 'Meine Marke',
    }),
    shipyardDocs({
      // Versions-Konfiguration
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

Der entscheidende Punkt ist, dass die **Version vor dem Locale** in der Verzeichnisstruktur kommt:

```
your-project/
├── astro.config.mjs
├── src/
│   ├── content.config.ts
│   └── pages/
│       ├── en/
│       │   ├── index.astro    # Englische Startseite
│       │   └── about.astro    # Englische Über-Seite
│       └── de/
│           ├── index.astro    # Deutsche Startseite
│           └── about.astro    # Deutsche Über-Seite
└── docs/
    ├── v2/
    │   ├── en/
    │   │   ├── index.md
    │   │   ├── installation.md
    │   │   └── configuration.md
    │   └── de/
    │       ├── index.md
    │       ├── installation.md
    │       └── configuration.md
    └── v1/
        ├── en/
        │   ├── index.md
        │   └── installation.md
        └── de/
            ├── index.md
            └── installation.md
```

### 4. Beispiel-Inhaltsdateien

**docs/v2/en/index.md**
```markdown
---
title: Welcome
sidebar_position: 1
---

# Welcome to Version 2.0

This is the latest version of the documentation.

## What's New in v2

- New feature A
- Improved feature B
- Better internationalization support

## Getting Started

See [Installation](./installation) to get started.
```

**docs/v2/de/index.md**
```markdown
---
title: Willkommen
sidebar_position: 1
---

# Willkommen bei Version 2.0

Dies ist die neueste Version der Dokumentation.

## Was ist neu in v2

- Neue Funktion A
- Verbesserte Funktion B
- Bessere Internationalisierungsunterstützung

## Erste Schritte

Siehe [Installation](./installation) für die ersten Schritte.
```

**docs/v2/en/installation.md**
```markdown
---
title: Installation
sidebar_position: 2
---

# Installation

## Requirements

- Node.js 18+
- npm or yarn

## Install

\`\`\`bash
npm install your-package@latest
\`\`\`
```

**docs/v2/de/installation.md**
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

**docs/v1/en/index.md**
```markdown
---
title: Welcome
sidebar_position: 1
---

# Welcome to Version 1.0

This documentation covers version 1.0.

## Getting Started

See [Installation](./installation) to get started.
```

**docs/v1/de/index.md**
```markdown
---
title: Willkommen
sidebar_position: 1
---

# Willkommen bei Version 1.0

Diese Dokumentation behandelt Version 1.0.

## Erste Schritte

Siehe [Installation](./installation) für die ersten Schritte.
```

## URL-Muster

Die URL-Struktur kombiniert Locale, Docs-Pfad und Version:

```
/[locale]/docs/[version]/[...slug]
```

### Generierte URLs

Nach dem Build haben Sie diese URL-Muster:

| URL | Inhalt |
|-----|--------|
| `/en/docs/` | Weiterleitung zu `/en/docs/v2/` |
| `/de/docs/` | Weiterleitung zu `/de/docs/v2/` |
| `/en/docs/v2/` | Englische v2 Willkommensseite |
| `/de/docs/v2/` | Deutsche v2 Willkommensseite |
| `/en/docs/v2/installation` | Englische v2 Installationsanleitung |
| `/de/docs/v2/installation` | Deutsche v2 Installationsanleitung |
| `/en/docs/v1/` | Englische v1 Willkommensseite (Warnbanner) |
| `/de/docs/v1/` | Deutsche v1 Willkommensseite (Warnbanner) |
| `/en/docs/latest/` | Alias für `/en/docs/v2/` |
| `/de/docs/latest/` | Alias für `/de/docs/v2/` |

## UI-Verhalten

### Sprachwechsler

Der Sprachwechsler erscheint in der Navigationsleiste. Beim Sprachwechsel:
- Die Version bleibt erhalten
- Der Seiten-Slug bleibt erhalten
- Beispiel: `/en/docs/v2/installation` -> `/de/docs/v2/installation`

### Versionsauswahl

Die Versionsauswahl erscheint in der Navigationsleiste. Beim Versionswechsel:
- Die Sprache bleibt erhalten
- Der Seiten-Slug bleibt erhalten (wenn er in der Zielversion existiert)
- Beispiel: `/de/docs/v2/installation` -> `/de/docs/v1/installation`

### Kombiniertes Wechseln

Beide Steuerelemente funktionieren unabhängig. Benutzer können:
1. Sprache wechseln: `/en/docs/v2/installation` -> `/de/docs/v2/installation`
2. Dann Version wechseln: `/de/docs/v2/installation` -> `/de/docs/v1/installation`

## Wichtige Hinweise

1. **Verzeichnisreihenfolge ist wichtig**: Die Struktur ist `docs/[version]/[locale]/[...slug]`, nicht `docs/[locale]/[version]/[...slug]`

2. **Inhalte in allen Locales**: Jede Version sollte Inhalte in allen unterstützten Sprachen haben. Das Warnbanner für veraltete Versionen erscheint in allen Sprachen.

3. **Navigationslinks**: Die `href`-Werte in der Navigation sollten kein Locale-Präfix enthalten - shipyard handhabt dies automatisch.

4. **i18n-Fallback**: Wenn Sie Astros i18n-Fallback-Funktion verwenden, beachten Sie, dass dies mit explizit generierten Weiterleitungsseiten kollidieren kann. Erwägen Sie, Fallback zu deaktivieren, wenn alle Locales vollständige Inhalte haben.

## Nächste Schritte

- Siehe [Einfache Versionierung](./basic-versioning) für eine einfachere Einrichtung ohne i18n
- Siehe [Dokumentations-Versionierung](../guides/versioning) für erweiterte Konfigurationsoptionen
- Siehe [Migration zu versionierten Docs](../guides/migration-to-versioned) wenn Sie bereits bestehende Dokumentation haben
