---
title: '@levino/shipyard-base'
sidebar_position: 3
description: Kern-Paket mit Layouts und Konfiguration für shipyard
---

# @levino/shipyard-base

Das Base-Paket ist das Fundament von shipyard. Es bietet das Kern-Konfigurationssystem und Layouts, die deine Seite antreiben.

## Installation

```bash
npm install @levino/shipyard-base
```

### Peer Dependencies

```bash
npm install tailwindcss daisyui @tailwindcss/typography
```

| Paket | Version |
|-------|---------|
| `astro` | ^5.7 |
| `tailwindcss` | ^3 |
| `daisyui` | ^4 |
| `@tailwindcss/typography` | ^0.5.10 |

## Konfiguration

Füge die shipyard-Integration zu deiner `astro.config.mjs` hinzu:

```javascript
import shipyard from '@levino/shipyard-base'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    shipyard({
      brand: 'Meine Seite',
      title: 'Meine tolle Seite',
      tagline: 'Erstellt mit shipyard',
      navigation: {
        docs: { label: 'Dokumentation', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
  ],
})
```

### Konfigurationsoptionen

| Option | Typ | Erforderlich | Standard | Beschreibung |
|--------|-----|--------------|----------|--------------|
| `brand` | `string` | Ja | — | Markenname in Navigationsleiste und Sidebar |
| `title` | `string` | Ja | — | Seitentitel im HTML `<title>` Tag |
| `tagline` | `string` | Ja | — | Kurze Beschreibung deiner Seite |
| `navigation` | `NavigationTree` | Ja | — | Globale Navigationsstruktur (siehe unten) |
| `scripts` | `Script[]` | Nein | `[]` | Skripte im Seitenkopf |

### Navigationsstruktur

Die `navigation`-Option definiert die Hauptnavigation deiner Seite. Jeder Eintrag kann haben:

| Eigenschaft | Typ | Erforderlich | Standard | Beschreibung |
|-------------|-----|--------------|----------|--------------|
| `label` | `string` | Nein | Key-Name | Anzeigetext in Navigation |
| `href` | `string` | Nein | — | Link-Ziel-URL |
| `subEntry` | `NavigationTree` | Nein | — | Verschachtelte Einträge für Dropdown-Menüs |

**Einfache Navigation:**

```javascript
navigation: {
  docs: { label: 'Doku', href: '/docs' },
  blog: { label: 'Blog', href: '/blog' },
  about: { label: 'Über uns', href: '/about' },
}
```

**Verschachtelte Navigation mit Dropdowns:**

```javascript
navigation: {
  docs: {
    label: 'Dokumentation',
    subEntry: {
      'getting-started': { label: 'Erste Schritte', href: '/docs/getting-started' },
      'api-reference': { label: 'API-Referenz', href: '/docs/api' },
    },
  },
  blog: { label: 'Blog', href: '/blog' },
}
```

### Skripte hinzufügen

Füge Analytics oder andere Skripte zu jeder Seite hinzu:

```javascript
shipyard({
  // ... andere Optionen
  scripts: [
    'https://example.com/analytics.js',
    { src: 'https://example.com/script.js', async: true },
  ],
})
```

---

## Layouts

shipyard bietet Layouts für deine Seiten.

### Page Layout

Das Haupt-Layout für Inhaltsseiten. Enthält Navigationsleiste, optionale Sidebar und Footer.

**Verwendung in Astro:**

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="Meine Seite" description="Seitenbeschreibung">
  <h1>Seiteninhalt</h1>
</Page>
```

**Verwendung in Markdown:**

```markdown
---
layout: '@levino/shipyard-base/layouts/Page.astro'
title: Meine Seite
---

# Seiteninhalt
```

| Prop | Typ | Beschreibung |
|------|-----|--------------|
| `title` | `string` | Seitentitel (kombiniert mit Seitentitel) |
| `description` | `string` | Seitenbeschreibung für SEO |

### Splash Layout

Ein Layout ohne Prose-Styling. Ideal für Landing Pages und Custom-Layouts.

```markdown
---
layout: '@levino/shipyard-base/layouts/Splash.astro'
title: Willkommen
---

# Willkommen auf meiner Seite
```

---

## Internationalisierung

Navigationslinks erhalten automatisch Locale-Präfixe wenn Astros i18n konfiguriert ist:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: true },
  },
  integrations: [shipyard({ /* ... */ })],
})
```
