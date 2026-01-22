---
title: '@levino/shipyard-blog'
sidebar:
  position: 5
description: Blog-Plugin für shipyard mit Paginierung und Sidebar
---

# @levino/shipyard-blog

Das Blog-Paket bietet Blog-Funktionalität für shipyard einschließlich paginierter Blog-Index, Sidebar mit neuesten Beiträgen und Git-Metadaten-Anzeige.

## Installation

```bash
npm install @levino/shipyard-blog
```

Erfordert dass `@levino/shipyard-base` installiert und konfiguriert ist.

### Tailwind-Konfiguration

shipyard verwendet Tailwind CSS 4, das einen CSS-basierten Konfigurationsansatz nutzt. Für detaillierte Setup-Anweisungen siehe die [Tailwind CSS Setup-Anleitung](./guides/tailwind-setup).

## Schnellstart

### 1. Astro konfigurieren

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardBlog from '@levino/shipyard-blog'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      brand: 'Meine Seite',
      title: 'Meine Seite',
      tagline: 'Ein Blog',
      navigation: {
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardBlog(),
  ],
})
```

### 2. Content Collection einrichten

Erstelle `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { blogSchema } from '@levino/shipyard-blog'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})

export const collections = { blog }
```

### 3. Blog-Beiträge erstellen

Füge Markdown-Dateien zum `blog/`-Verzeichnis hinzu:

```markdown
---
title: Mein erster Beitrag
description: Eine kurze Beschreibung
date: 2025-01-15
---

# Mein erster Beitrag

Dein Blog-Beitragsinhalt...
```

Das war's! Dein Blog ist jetzt unter `/blog` verfügbar.

---

## Konfiguration

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `blogSidebarCount` | `number \| 'ALL'` | `5` | Anzahl neuester Beiträge in Sidebar |
| `blogSidebarTitle` | `string` | `'Recent posts'` | Titel für Sidebar-Bereich |
| `postsPerPage` | `number` | `10` | Anzahl Beiträge pro Seite |
| `editUrl` | `string` | — | Basis-URL für "Diesen Beitrag bearbeiten"-Links |
| `showLastUpdateTime` | `boolean` | `false` | Zeige letzten Aktualisierungszeitpunkt aus Git |
| `showLastUpdateAuthor` | `boolean` | `false` | Zeige letzten Aktualisierungsautor aus Git |

### Beispiel

```javascript
shipyardBlog({
  blogSidebarCount: 10,
  blogSidebarTitle: 'Neueste Artikel',
  postsPerPage: 15,
  editUrl: 'https://github.com/user/repo/edit/main/blog',
  showLastUpdateTime: true,
})
```

---

## Frontmatter-Optionen

### Erforderlich

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `title` | `string` | Beitragstitel |
| `description` | `string` | Beitragsbeschreibung/Auszug |
| `date` | `Date` | Veröffentlichungsdatum (YYYY-MM-DD) |

### Optional

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `last_update_author` | `string \| false` | Override Autor, oder `false` zum Verstecken |
| `last_update_time` | `Date \| false` | Override Zeitstempel, oder `false` zum Verstecken |
| `custom_edit_url` | `string \| null` | Benutzerdefinierte Edit-URL, oder `null` zum Deaktivieren |

### Beispiel

```yaml
---
title: TypeScript verstehen
description: Ein tiefer Einblick in TypeScript Generics
date: 2025-01-15
---
```

---

## Internationalisierung

Organisiere Beiträge nach Locale:

```
blog/
├── de/
│   └── 2025-01-15-erster-beitrag.md
├── en/
│   └── 2025-01-15-first-post.md
```

Locale-basiertes Routing erfolgt automatisch wenn Astros i18n konfiguriert ist.
