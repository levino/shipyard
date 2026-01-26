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
npm install tailwindcss daisyui @tailwindcss/typography
```

## Übersicht der erforderlichen Dateien

Bevor wir in die Konfigurationsdetails eintauchen, hier eine kurze Checkliste der Dateien, die du erstellen oder ändern musst:

| Datei | Zweck | Erforderlich? |
|-------|-------|---------------|
| `astro.config.mjs` | Astro-Integrationen und Seiten-Einstellungen | Ja |
| `src/styles/app.css` | Tailwind CSS 4 Setup mit `@source`-Direktiven | Ja |
| `src/content.config.ts` | **Content Collection Schemas und Loader** | Ja |
| `docs/` Verzeichnis | Dokumentations-Markdown-Dateien | Ja (für Doku) |
| `blog/` Verzeichnis | Blog-Beitrags-Markdown-Dateien | Ja (für Blog) |

Die am häufigsten vergessene Datei ist `src/content.config.ts` — ohne sie erhältst du Fehler wie "The collection does not exist" beim Bauen deiner Seite.

## Konfiguration

### CSS-Setup (Tailwind CSS 4)

Erstelle `src/styles/app.css` mit der Tailwind CSS 4 Konfiguration:

```css
/* Tailwind CSS 4 Setup */
@import "tailwindcss";

/* Importiere shipyard-Pakete - enthält sowohl Styles als auch @source-Direktiven */
@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";

@plugin "daisyui";
@plugin "@tailwindcss/typography";
```

**Wichtig:** Die shipyard-Pakete enthalten automatisch die nötigen `@source`-Direktiven, damit Tailwind die CSS-Klassen in den Komponenten erkennt. Siehe [Tailwind CSS Setup](../guides/tailwind-setup) für detaillierte Konfigurationsoptionen und Fehlerbehebung.

### Astro-Konfiguration

Aktualisiere deine `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

// Importiere deine CSS-Datei mit ?url
import appCss from './src/styles/app.css?url'

export default defineConfig({
  integrations: [
    shipyard({
      css: appCss,  // Erforderlich: übergib dein CSS an shipyard
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
| `css: appCss` | Übergibt dein Tailwind CSS Setup an shipyard. Ohne dies werden keine Styles angewendet. |
| `?url` Import | Weist Vite an, den Dateipfad zur Build-Zeit aufzulösen für korrekte CSS-Verarbeitung. |

### Content Collections (Erforderlich)

Erstelle `src/content.config.ts` — **diese Datei ist essentiell**, damit shipyard deine Dokumentations- und Blog-Inhalte finden und rendern kann:

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
│   ├── styles/
│   │   └── app.css            # Tailwind CSS 4 Setup
│   └── pages/                 # Zusätzliche Seiten
│       └── index.astro        # Startseite
├── astro.config.mjs
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

## Fehlerbehebung

### "The collection does not exist" oder "Cannot read properties of undefined"

```
The collection "docs" does not exist or is empty.
Cannot read properties of undefined (reading 'render')
```

**Ursache:** Fehlende oder falsch konfigurierte `src/content.config.ts` Datei.

**Lösung:** Erstelle die Content-Config-Datei wie oben in [Content Collections](#content-collections-erforderlich) gezeigt. Stelle sicher:
1. Die Datei befindet sich unter `src/content.config.ts` (nicht im Root-Verzeichnis)
2. Du exportierst ein `collections` Objekt mit deinen definierten Collections
3. Die Collection-Namen entsprechen dem, was die shipyard-Plugins erwarten (`docs` für Dokumentation, `blog` für Blog-Beiträge)

### Build-Fehler nach der Installation

Wenn du sofort nach der Installation TypeScript- oder Build-Fehler siehst:

1. **Prüfe Peer Dependencies** — Stelle sicher, dass alle erforderlichen Peer Dependencies installiert sind:
   ```bash
   npm install tailwindcss daisyui @tailwindcss/typography
   ```

2. **Überprüfe CSS-Setup** — Stelle sicher, dass `src/styles/app.css` existiert und die shipyard-Pakete mit `@import` importiert

3. **Prüfe css-Konfiguration** — Stelle sicher, dass du `css: appCss` an die shipyard-Integration übergibst

### Styles werden nicht richtig angewendet

Wenn Komponenten ungestylt oder kaputt erscheinen:

1. **Prüfe CSS-Imports** — Stelle sicher, dass alle benötigten shipyard-Pakete in deiner `app.css` importiert werden

2. **Überprüfe CSS-Import-Reihenfolge** — In deiner app.css muss `@import "tailwindcss"` vor den shipyard-Paket-Imports kommen

3. **Prüfe css-Konfiguration** — Stelle sicher, dass `astro.config.mjs` dein CSS mit `?url` importiert und an shipyard übergibt

Siehe [Tailwind CSS Setup](../guides/tailwind-setup) für detaillierte Fehlerbehebung.

### Dokumentationsseiten geben 404 zurück

1. **Prüfe Ordnerstruktur** — Dokumentationsdateien sollten in `docs/` im Projekt-Root sein, nicht in `src/docs/`
2. **Überprüfe content.config.ts** — Stelle sicher, dass der Glob-Loader auf das richtige Verzeichnis zeigt (`'./docs'`)
3. **Prüfe auf index.md** — Stelle sicher, dass du mindestens eine Markdown-Datei hast (z.B. `docs/index.md`)

## Hilfe gebraucht?

- Schau im [GitHub Repository](https://github.com/levino/shipyard) für Issues und Diskussionen
- Erkunde die [Live-Demo](https://i18n.demos.shipyard.levinkeller.de/en/) für Beispiele
