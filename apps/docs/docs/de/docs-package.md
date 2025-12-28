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
