---
title: '@levino/shipyard-docs'
sidebar_position: 4
description: Dokumentations-Plugin für shipyard mit automatischer Sidebar und Paginierung
---

# @levino/shipyard-docs

Das Docs-Paket bietet Dokumentations-Features für shipyard einschließlich automatischer Sidebar-Generierung, Paginierung zwischen Seiten und Git-Metadaten-Anzeige.

## Installation

```bash
npm install @levino/shipyard-docs
```

Erfordert dass `@levino/shipyard-base` installiert und konfiguriert ist.

### Tailwind-Konfiguration

Damit Tailwind die in shipyard-docs-Komponenten verwendeten Klassen korrekt erkennt, musst du den Paketpfad zum `content`-Array in deiner `tailwind.config.mjs` hinzufügen:

```javascript
const path = require('node:path')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // shipyard-base einschließen (erforderlich)
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../astro/**/*.astro',
    ),
    // shipyard-docs einschließen
    path.join(
      path.dirname(require.resolve('@levino/shipyard-docs')),
      '../astro/**/*.astro',
    ),
  ],
  // ... Rest deiner Konfiguration
}
```

## Schnellstart

### 1. Astro konfigurieren

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    shipyard({
      brand: 'Meine Seite',
      title: 'Meine Seite',
      tagline: 'Dokumentation',
      navigation: {
        docs: { label: 'Doku', href: '/docs' },
      },
    }),
    shipyardDocs(),
  ],
})
```

### 2. Content Collection einrichten

Erstelle `src/content.config.ts`:

```typescript
import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(createDocsCollection('./docs'))

export const collections = { docs }
```

### 3. Dokumentation erstellen

Füge Markdown-Dateien zum `docs/`-Verzeichnis hinzu:

```markdown
---
title: Erste Schritte
sidebar_position: 1
---

# Erste Schritte

Dein Dokumentationsinhalt...
```

Das war's! Deine Dokumentation ist jetzt unter `/docs` verfügbar.

---

## Konfiguration

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `routeBasePath` | `string` | `'docs'` | Basis-URL-Pfad für Dokumentation |
| `collectionName` | `string` | Wie `routeBasePath` | Name der Content Collection |
| `editUrl` | `string` | — | Basis-URL für "Diese Seite bearbeiten"-Links |
| `showLastUpdateTime` | `boolean` | `false` | Zeige letzten Aktualisierungszeitpunkt aus Git |
| `showLastUpdateAuthor` | `boolean` | `false` | Zeige letzten Aktualisierungsautor aus Git |

### Beispiel

```javascript
shipyardDocs({
  routeBasePath: 'docs',
  editUrl: 'https://github.com/user/repo/edit/main/docs',
  showLastUpdateTime: true,
  showLastUpdateAuthor: true,
})
```

---

## Frontmatter-Optionen

### Basis

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `title` | `string` | Seitentitel |
| `description` | `string` | Seitenbeschreibung für SEO |

### Sidebar

| Feld | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `sidebar_position` | `number` | `Infinity` | Position in Sidebar (niedriger = früher) |
| `sidebar_label` | `string` | `title` | Benutzerdefiniertes Label für Sidebar |
| `sidebar.render` | `boolean` | `true` | Ob in Sidebar angezeigt |

### Paginierung

| Feld | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `pagination_next` | `string \| null` | Auto | Nächste Seite Doc-ID, oder `null` zum Deaktivieren |
| `pagination_prev` | `string \| null` | Auto | Vorherige Seite Doc-ID, oder `null` zum Deaktivieren |

### Git-Metadaten-Overrides

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `last_update_author` | `string \| false` | Override Autor, oder `false` zum Verstecken |
| `last_update_time` | `Date \| false` | Override Zeitstempel, oder `false` zum Verstecken |
| `custom_edit_url` | `string \| null` | Benutzerdefinierte Edit-URL, oder `null` zum Deaktivieren |

---

## Paginierung

Paginierung erfolgt automatisch basierend auf Sidebar-Reihenfolge.

**Paginierung deaktivieren:**

```yaml
---
pagination_next: null
pagination_prev: null
---
```

**Zu einer bestimmten Seite verlinken:**

```yaml
---
pagination_next: advanced/deployment.md
---
```

---

## Mehrere Dokumentations-Instanzen

```javascript
export default defineConfig({
  integrations: [
    shipyard({ /* ... */ }),
    shipyardDocs({ routeBasePath: 'docs', collectionName: 'docs' }),
    shipyardDocs({ routeBasePath: 'api', collectionName: 'api-docs' }),
  ],
})
```

Mit Content Collections:

```typescript
const docs = defineCollection(createDocsCollection('./docs'))
const apiDocs = defineCollection(createDocsCollection('./api-docs'))

export const collections = { docs, 'api-docs': apiDocs }
```

---

## Internationalisierung

Organisiere Doku nach Locale:

```
docs/
├── de/
│   └── getting-started.md
├── en/
│   └── getting-started.md
```

Locale-basiertes Routing erfolgt automatisch wenn Astros i18n konfiguriert ist.

---

## LLMs.txt-Unterstützung

shipyard-docs kann automatisch `llms.txt`- und `llms-full.txt`-Dateien gemäß der [llms.txt-Spezifikation](https://llmstxt.org/) generieren. Diese Dateien helfen Large Language Models, deine Dokumentation effizient zu parsen und zu verstehen.

### Konfiguration

Aktiviere die llms.txt-Generierung durch Hinzufügen der `llmsTxt`-Option:

```javascript
shipyardDocs({
  llmsTxt: {
    enabled: true,
    projectName: 'Mein Projekt',
    summary: 'Eine kurze Beschreibung deines Projekts für LLMs',
    description: 'Optionaler zusätzlicher Kontext über dein Projekt.',
    sectionTitle: 'Dokumentation', // Optional, Standard ist 'Documentation'
  },
})
```

### Generierte Dateien

Wenn aktiviert, werden zwei Dateien beim Build automatisch unter dem Docs-Pfad generiert:

| Datei | Beschreibung |
|-------|--------------|
| `/{routeBasePath}/llms.txt` | Index-Datei mit Links und Beschreibungen jeder Dokumentationsseite |
| `/{routeBasePath}/llms-full.txt` | Vollständige Datei mit dem kompletten Inhalt aller Dokumentationsseiten |

Zum Beispiel sind bei Standard-`routeBasePath` von `docs` die Dateien unter `/docs/llms.txt` und `/docs/llms-full.txt` verfügbar.

### Sidebar-Integration

Wenn llms.txt aktiviert ist, wird automatisch ein Link zu `/docs/llms.txt` in der Sidebar hinzugefügt. Dieser Link enthält einen Button zum Kopieren in die Zwischenablage, was das Kopieren der URL und Einfügen in KI-Assistenten-Prompts erleichtert.

### Internationalisierung

Wenn Astros i18n konfiguriert ist, enthält llms.txt nur Inhalte aus der **Standardsprache**. Dies verhindert das Mischen verschiedener Sprachen in derselben Datei und stellt sicher, dass LLMs konsistente, einsprachige Dokumentation erhalten.

### LLMs.txt-Optionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `enabled` | `boolean` | `false` | Aktiviert llms.txt-Generierung |
| `projectName` | `string` | `'Documentation'` | H1-Überschrift in der generierten Datei |
| `summary` | `string` | — | Kurze Projektzusammenfassung (als Blockquote angezeigt) |
| `description` | `string` | — | Zusätzliche Kontext-Absätze |
| `sectionTitle` | `string` | `'Documentation'` | Titel für den Links-Abschnitt |

### Beispiel-Ausgabe

Die generierte `llms.txt` folgt diesem Format:

```markdown
# Mein Projekt

> Eine kurze Beschreibung deines Projekts für LLMs

Optionaler zusätzlicher Kontext über dein Projekt.

## Dokumentation

- [Erste Schritte](https://example.com/docs/erste-schritte): Installations- und Setup-Anleitung
- [Konfiguration](https://example.com/docs/konfiguration): Referenz der Konfigurationsoptionen
```

Dies macht deine Dokumentation leicht zugänglich für KI-Coding-Assistenten wie Claude, Cursor und andere, die den llms.txt-Standard unterstützen.
