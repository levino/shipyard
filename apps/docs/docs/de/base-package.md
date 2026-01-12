---
title: '@levino/shipyard-base'
sidebar:
  position: 3
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

### Tailwind-Konfiguration

Damit Tailwind die in shipyard-Komponenten verwendeten Klassen korrekt erkennt, musst du die Paketpfade zum `content`-Array in deiner `tailwind.config.mjs` hinzufügen:

```javascript
const path = require('node:path')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // Füge dies hinzu, um shipyard-base Komponenten-Styles einzuschließen
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../astro/**/*.astro',
    ),
  ],
  // ... Rest deiner Konfiguration
}
```

Dies stellt sicher, dass Tailwind die shipyard-Komponentendateien scannt und alle notwendigen CSS-Klassen in deinen Build einschließt.

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
| `footer` | `FooterConfig` | Nein | — | Footer-Konfiguration (Links, Copyright, Stil) |
| `hideBranding` | `boolean` | Nein | `false` | "Built with Shipyard" Branding ausblenden |
| `onBrokenLinks` | `'ignore' \| 'log' \| 'warn' \| 'throw'` | Nein | `'warn'` | Verhalten bei defekten internen Links während des Builds |

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

### Footer-Konfiguration

Passe den Footer deiner Seite mit Links, Copyright-Hinweis und Styling an. Shipyard unterstützt sowohl einfache (einzeilige) als auch mehrspaltige Footer-Layouts, ähnlich wie Docusaurus.

#### Einfacher Footer

Ein einfacher Footer zeigt Links in einer horizontalen Zeile:

```javascript
shipyard({
  // ... andere Optionen
  footer: {
    links: [
      { label: 'Dokumentation', to: '/docs' },
      { label: 'Blog', to: '/blog' },
      { label: 'GitHub', href: 'https://github.com/myorg/myrepo' },
    ],
    copyright: 'Copyright © 2025 Meine Firma. Alle Rechte vorbehalten.',
  },
})
```

#### Mehrspaltiger Footer

Für ein mehrspaltiges Layout verwende Objekte mit `title` und `items`:

```javascript
shipyard({
  // ... andere Optionen
  footer: {
    style: 'dark',
    links: [
      {
        title: 'Doku',
        items: [
          { label: 'Erste Schritte', to: '/docs' },
          { label: 'API-Referenz', to: '/docs/api' },
        ],
      },
      {
        title: 'Community',
        items: [
          { label: 'Blog', to: '/blog' },
          { label: 'GitHub', href: 'https://github.com/myorg/myrepo' },
        ],
      },
    ],
    copyright: 'Copyright © 2025 Meine Firma.',
  },
})
```

#### Footer-Optionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `style` | `'light' \| 'dark'` | `'light'` | Footer-Farbthema |
| `links` | `(FooterLink \| FooterLinkColumn)[]` | `[]` | Footer-Links oder -Spalten |
| `copyright` | `string` | — | Copyright-Hinweis (unterstützt HTML) |
| `logo` | `FooterLogo` | — | Optionales Footer-Logo |

#### FooterLink-Eigenschaften

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|-------------|-----|--------------|--------------|
| `label` | `string` | Ja | Anzeigetext für den Link |
| `to` | `string` | Eines von `to`/`href` | Interner Link-Pfad (Locale-Präfix wird automatisch hinzugefügt) |
| `href` | `string` | Eines von `to`/`href` | Externe URL (öffnet in neuem Tab) |

#### FooterLinkColumn-Eigenschaften

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|-------------|-----|--------------|--------------|
| `title` | `string` | Ja | Spalten-Überschrift |
| `items` | `FooterLink[]` | Ja | Links innerhalb dieser Spalte |

#### FooterLogo-Eigenschaften

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|-------------|-----|--------------|--------------|
| `alt` | `string` | Ja | Alt-Text für das Logo |
| `src` | `string` | Ja | Logo-Bildquelle URL |
| `srcDark` | `string` | Nein | Optionales Dark-Mode-Logo |
| `href` | `string` | Nein | Link-URL beim Klick auf das Logo |
| `width` | `number` | Nein | Logo-Breite in Pixel |
| `height` | `number` | Nein | Logo-Höhe in Pixel |

#### Shipyard-Branding

Standardmäßig zeigt der Footer einen "Built with Shipyard" Link. Um dieses Branding auszublenden:

```javascript
shipyard({
  // ... andere Optionen
  hideBranding: true,
})
```

---

## Layouts

shipyard bietet Layouts für deine Seiten.

### Page Layout

Das Basis-Layout für alle Seiten. Enthält Navigationsleiste, optionale Sidebar und Footer. Verwende es für eigene Astro-Komponenten.

**Verwendung in Astro:**

```astro
---
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="Meine Seite" description="Seitenbeschreibung">
  <h1>Seiteninhalt</h1>
</Page>
```

| Prop | Typ | Beschreibung |
|------|-----|--------------|
| `title` | `string` | Seitentitel (kombiniert mit Seitentitel) |
| `description` | `string` | Seitenbeschreibung für SEO |

### Markdown Layout

Ein Layout mit Tailwind Typography (prose) Styling. Verwende es für eigenständige Markdown-Seiten.

```markdown
---
layout: '@levino/shipyard-base/layouts/Markdown.astro'
title: Meine Seite
---

# Meine Seite

Dein Markdown-Inhalt mit schöner Typografie...
```

### Splash Layout

Ein Layout mit zentriertem Inhalt aber ohne Prose-Styling. Ideal für Landing Pages mit eigenem Styling.

```markdown
---
layout: '@levino/shipyard-base/layouts/Splash.astro'
title: Willkommen
---

<div class="hero">
  <h1>Willkommen auf meiner Seite</h1>
</div>
```

---

## Defekte Link-Erkennung

Shipyard prüft während Produktions-Builds automatisch auf defekte interne Links. Dies hilft dir, Probleme zu erkennen, bevor du deine Seite veröffentlichst.

### Konfiguration

Verwende die `onBrokenLinks`-Option, um zu steuern, was passiert, wenn defekte Links erkannt werden:

| Wert | Verhalten |
|------|-----------|
| `'ignore'` | Nicht auf defekte Links prüfen |
| `'log'` | Defekte Links protokollieren, aber Build fortsetzen |
| `'warn'` | Warnungen für defekte Links protokollieren (Standard) |
| `'throw'` | Build bei defekten Links abbrechen |

**Beispiel - Build bei defekten Links abbrechen:**

```javascript
shipyard({
  brand: 'Meine Seite',
  title: 'Meine Seite',
  tagline: 'Erstellt mit shipyard',
  navigation: { /* ... */ },
  onBrokenLinks: 'throw',
})
```

### Was geprüft wird

- Interne Links die mit `/` beginnen (z.B. `/docs/getting-started`)
- Links mit Query-Strings und Hash-Fragmenten (der Basispfad wird validiert)
- Links zu HTML-Seiten, Verzeichnissen mit `index.html` und Asset-Dateien

### Was ignoriert wird

- Externe URLs (`https://`, `http://`)
- Anker-Links (`#section`)
- Spezielle Protokolle (`mailto:`, `tel:`, `javascript:`, `data:`)

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
