---
title: Erste Schritte
sidebar:
  position: 2
description: Lerne wie du shipyard für dein Astro-Projekt installierst und konfigurierst
---

# Erste Schritte mit shipyard

Diese Anleitung führt dich durch die Einrichtung von shipyard in deinem Astro-Projekt. Am Ende hast du eine vollständig konfigurierte Seite mit Dokumentations- und Blog-Funktionalität.

## Voraussetzungen

Bevor du beginnst, stelle sicher dass du hast:

- **Node.js** 18 oder neuer
- **npm** (kommt mit Node.js)
- Ein bestehendes Astro-Projekt, oder erstelle eines mit `npm create astro@latest`

## Installation

### Schritt 1: Pakete installieren

Installiere die shipyard-Pakete die du brauchst:

```bash
# Vollausgestattete Seite (Doku + Blog)
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog

# Nur Dokumentationsseite
npm install @levino/shipyard-base @levino/shipyard-docs

# Nur Blog-Seite
npm install @levino/shipyard-base @levino/shipyard-blog

# Nur Kern-Komponenten
npm install @levino/shipyard-base
```

### Schritt 2: Peer Dependencies installieren

shipyard benötigt folgende Peer Dependencies:

```bash
npm install tailwindcss daisyui @tailwindcss/typography @astrojs/tailwind
```

## Konfiguration

### Astro-Konfiguration

Aktualisiere deine `astro.config.mjs`:

```javascript
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({
      brand: 'Meine Seite',
      title: 'Meine tolle Seite',
      tagline: 'Erstellt mit shipyard',
      navigation: {
        docs: { label: 'Doku', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(),
    shipyardBlog(),
  ],
})
```

**Wichtige Konfigurationshinweise:**

| Einstellung | Warum sie benötigt wird |
|-------------|-------------------------|
| `tailwind({ applyBaseStyles: false })` | Verhindert Konflikte zwischen Tailwinds Basis-Styles und DaisyUI. Ohne diese Einstellung können Komponenten ungestylt oder fehlerhaft erscheinen. |
| Integrations-Reihenfolge | Tailwind muss vor den shipyard-Integrationen kommen, damit Styles korrekt verarbeitet werden. |

### Tailwind-Konfiguration

Erstelle oder aktualisiere `tailwind.config.mjs`:

```javascript
import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './docs/**/*.md',
    './blog/**/*.md',
    'node_modules/@levino/shipyard-*/**/*.{astro,js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
}
```

### Content Collections

Erstelle `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'
import { blogSchema } from '@levino/shipyard-blog'
import { glob } from 'astro/loaders'

const docs = defineCollection(createDocsCollection('./docs'))

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})

export const collections = { docs, blog }
```

## Projektstruktur

Nach der Einrichtung sollte dein Projekt so aussehen:

```
meine-seite/
├── docs/                       # Dokumentations-Markdown-Dateien
│   ├── index.md               # Doku-Startseite
│   └── getting-started.md     # Dokumentationsseiten
├── blog/                       # Blog-Beitrags-Markdown-Dateien
│   └── 2025-01-15-erster-beitrag.md
├── src/
│   ├── content.config.ts      # Content Collection Konfiguration
│   └── pages/                 # Zusätzliche Seiten
│       └── index.astro        # Startseite
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Inhalte erstellen

### Dokumentationsseiten

Erstelle Markdown-Dateien im `docs/`-Verzeichnis:

```markdown
---
title: Einführung
sidebar:
  position: 1
description: Lerne unser Projekt kennen
---

# Einführung

Dein Dokumentationsinhalt hier...
```

**Wichtige Frontmatter-Optionen:**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `title` | `string` | Seitentitel |
| `sidebar.position` | `number` | Position in Sidebar (niedriger = früher) |
| `description` | `string` | Seitenbeschreibung für SEO |

Siehe [@levino/shipyard-docs](./docs-package) für alle Frontmatter-Optionen.

### Blog-Beiträge

Erstelle Markdown-Dateien im `blog/`-Verzeichnis:

```markdown
---
title: Mein erster Beitrag
description: Eine kurze Beschreibung dieses Beitrags
date: 2025-01-15
---

# Mein erster Beitrag

Dein Blog-Beitragsinhalt hier...
```

**Erforderliches Frontmatter:**

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `title` | `string` | Beitragstitel |
| `description` | `string` | Beitragsbeschreibung/Auszug |
| `date` | `Date` | Veröffentlichungsdatum (YYYY-MM-DD) |

Siehe [@levino/shipyard-blog](./blog-package) für alle Frontmatter-Optionen.

### Benutzerdefinierte Seiten mit Layouts

Für eigenständige Seiten, die nicht Teil von Docs oder Blog Collections sind, verwende die Layouts von shipyard direkt.

**Markdown-Seiten** – Verwende das Markdown-Layout für Seiten mit Prosa-Styling:

```markdown
---
layout: '@levino/shipyard-base/layouts/Markdown.astro'
title: Über uns
description: Erfahre mehr über unser Team
---

# Über uns

Dein Markdown-Inhalt mit schönem Typografie-Styling...
```

**Astro-Komponenten-Seiten** – Importiere das Page-Layout für volle Kontrolle:

```astro
---
// src/pages/index.astro
import { Page } from '@levino/shipyard-base/layouts'
---

<Page title="Startseite" description="Willkommen auf unserer Seite">
  <div class="hero min-h-[60vh] bg-base-200">
    <div class="hero-content text-center">
      <h1 class="text-5xl font-bold">Willkommen!</h1>
      <p>Dein benutzerdefinierter Startseiten-Inhalt...</p>
    </div>
  </div>
</Page>
```

**Landing Pages** – Verwende das Splash-Layout für zentrierten Inhalt ohne Prosa-Styling:

```markdown
---
layout: '@levino/shipyard-base/layouts/Splash.astro'
title: Willkommen
---

<div class="hero min-h-screen">
  <h1 class="text-5xl font-bold">Meine Landing Page</h1>
</div>
```

Siehe [@levino/shipyard-base Layouts](./base-package#layouts) für alle verfügbaren Layouts und Optionen.

## Internationalisierung hinzufügen

shipyard unterstützt Astros i18n-Features. Aktualisiere deine Astro-Konfiguration:

```javascript
export default defineConfig({
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    // ... deine Integrationen
  ],
})
```

Organisiere Inhalte nach Locale:

```
docs/
├── de/
│   ├── index.md
│   └── getting-started.md
├── en/
│   ├── index.md
│   └── getting-started.md

blog/
├── de/
│   └── 2025-01-15-erster-beitrag.md
├── en/
│   └── 2025-01-15-first-post.md
```

## Seite starten

Starte den Entwicklungsserver:

```bash
npm run dev
```

Für Produktion bauen:

```bash
npm run build
```

## Paketübersicht

shipyard besteht aus drei Paketen, die zusammenarbeiten:

| Paket | Zweck | Dokumentation |
|-------|-------|---------------|
| `@levino/shipyard-base` | Kern-Layouts, Komponenten und Konfiguration | [Base Package](./base-package) |
| `@levino/shipyard-docs` | Dokumentations-Features, Sidebar, Paginierung | [Docs Package](./docs-package) |
| `@levino/shipyard-blog` | Blog-Funktionalität, Beitragsliste, Navigation | [Blog Package](./blog-package) |

## Nächste Schritte

Jetzt wo du shipyard eingerichtet hast, erkunde diese Themen:

- **[@levino/shipyard-base](./base-package)** – Layouts, Komponenten und Konfiguration
- **[@levino/shipyard-docs](./docs-package)** – Dokumentations-Features und Anpassung
- **[@levino/shipyard-blog](./blog-package)** – Blog-Features und Anpassung
- **[Server-Modus (SSR)](./server-mode)** – shipyard mit Server-Side Rendering verwenden
- **[Feature-Roadmap](./roadmap)** – Sieh welche Features als nächstes kommen

## Hilfe gebraucht?

- Schau im [GitHub Repository](https://github.com/levino/shipyard) für Issues und Diskussionen
- Erkunde die [Live-Demo](https://i18n.demos.shipyard.levinkeller.de/en/) für Beispiele
