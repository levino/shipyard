---
title: Migration zu versionierten Docs
sidebar_position: 2
description: Schritt-für-Schritt-Anleitung zur Migration bestehender Dokumentation zu versionierten Docs
---

# Migration zu versionierten Docs

Diese Anleitung führt Sie durch die Migration einer bestehenden shipyard-Dokumentationsseite zur Verwendung versionierter Dokumentation. Die Migration ist nicht-breaking und kann inkrementell durchgeführt werden.

## Voraussetzungen

Stellen Sie vor der Migration sicher, dass Sie:

- Eine bestehende shipyard-Docs-Seite haben, die ohne Versionierung funktioniert
- `@levino/shipyard-docs` Version 0.4.0 oder höher installiert haben
- Ein klares Verständnis davon haben, welche Version(en) Sie pflegen möchten

## Migrationsübersicht

Der Migrationsprozess umfasst:

1. Neuorganisation Ihrer Content-Verzeichnisstruktur
2. Aktualisierung Ihrer Content Collection Konfiguration
3. Hinzufügen der Versionskonfiguration zu Ihrer Astro-Konfiguration
4. Testen der migrierten Seite

**Wichtig:** Diese Migration ist nicht-breaking. Ihre bestehenden URLs funktionieren weiterhin, und das Versionssystem fügt neue URL-Muster hinzu, anstatt bestehende zu ändern.

---

## Schritt 1: Versionsstrategie planen

Bevor Sie Inhalte umstrukturieren, entscheiden Sie sich für Ihren Versionierungsansatz:

### Fragen zum Überlegen

1. **Wie viele Versionen werden Sie pflegen?**
   - Beginnen Sie mit 1-2 Versionen (aktuell + eine vorherige)
   - Fügen Sie bei Bedarf weitere hinzu

2. **Welches Versionsbenennungsschema werden Sie verwenden?**
   - Einfach: `v1`, `v2`, `v3`
   - Semantisch: `v1`, `v2` (vermeiden Sie Punkte in Ordnernamen)
   - Benannt: `stable`, `next`, `legacy`

3. **Müssen Sie die aktuellen Docs unverändert behalten?**
   - Falls ja, werden Ihre aktuellen Docs zu `v1`, und Sie erstellen `v2` für Änderungen
   - Falls nein, werden Ihre aktuellen Docs zur ersten Version

### Empfohlener Ansatz

Für die meisten Migrationen empfehlen wir:

- Aktuelle Docs werden Ihre erste Version (z.B. `v1`)
- Erstellen Sie eine neue Version (`v2`) nur bei Breaking Changes
- Halten Sie die Versionsanzahl anfangs niedrig

---

## Schritt 2: Content-Verzeichnis umstrukturieren

### Aktuelle Struktur (Nicht-versioniert)

Ihre bestehende Struktur sieht wahrscheinlich so aus:

```
docs/
├── index.md
├── getting-started.md
├── configuration.md
└── advanced/
    ├── api.md
    └── plugins.md
```

Oder mit i18n:

```
docs/
├── en/
│   ├── index.md
│   └── getting-started.md
└── de/
    ├── index.md
    └── getting-started.md
```

### Zielstruktur (Versioniert)

Verschieben Sie alle Inhalte in ein Versionsverzeichnis:

**Ohne i18n:**

```
docs/
└── v1/
    ├── index.md
    ├── getting-started.md
    ├── configuration.md
    └── advanced/
        ├── api.md
        └── plugins.md
```

**Mit i18n:**

```
docs/
└── v1/
    ├── en/
    │   ├── index.md
    │   └── getting-started.md
    └── de/
        ├── index.md
        └── getting-started.md
```

### Migrationsbefehle

Führen Sie diese Befehle vom Projektstamm aus:

**Ohne i18n:**

```bash
# Versionsverzeichnis erstellen
mkdir -p docs/v1

# Alle Inhalte in Versionsverzeichnis verschieben
mv docs/*.md docs/v1/
mv docs/*/ docs/v1/ 2>/dev/null || true

# Struktur überprüfen
ls -la docs/v1/
```

**Mit i18n:**

```bash
# Versionsverzeichnis erstellen
mkdir -p docs/v1

# Locale-Verzeichnisse in Versionsverzeichnis verschieben
mv docs/en docs/v1/
mv docs/de docs/v1/
# Für weitere Locales wiederholen

# Struktur überprüfen
ls -la docs/v1/
```

---

## Schritt 3: Content Collection aktualisieren

Aktualisieren Sie Ihre `src/content.config.ts` (oder `src/content/config.ts`):

### Vorher (Nicht-versioniert)

```typescript
import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './docs' }),
  schema: docsSchema,
})

export const collections = { docs }
```

### Nachher (Versioniert)

```typescript
import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1'],  // Bei Bedarf weitere Versionen hinzufügen
    fallbackVersion: 'v1',
  }),
)

export const collections = { docs }
```

### Was hat sich geändert

- Import von `createVersionedDocsCollection` statt `docsSchema` und `glob`
- Verwendung der Helper-Funktion, die Glob-Patterns und Schema automatisch behandelt
- Angabe Ihrer Version(en) im `versions`-Array

---

## Schritt 4: Versionskonfiguration hinzufügen

Aktualisieren Sie Ihre `astro.config.mjs`:

### Vorher (Nicht-versioniert)

```javascript
import { defineConfig } from 'astro/config'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      // bestehende Konfiguration
    }),
  ],
})
```

### Nachher (Versioniert)

```javascript
import { defineConfig } from 'astro/config'
import shipyardDocs from '@levino/shipyard-docs'

export default defineConfig({
  integrations: [
    shipyardDocs({
      // bestehende Konfiguration
      versions: {
        current: 'v1',
        available: [
          { version: 'v1', label: 'Version 1.0' },
        ],
        stable: 'v1',
      },
    }),
  ],
})
```

### Konfigurationsoptionen

| Eigenschaft | Beschreibung | Anfangswert |
|-------------|--------------|-------------|
| `current` | Standardversion für `/docs/` | Ihr Versionsname |
| `available` | Array von Versionskonfigurationen | Anfangs einzelne Version |
| `deprecated` | Versionen, die Warnungen anzeigen sollen | Leeres Array |
| `stable` | Als stabiles Release markiert | Gleich wie current |

---

## Schritt 5: Migration testen

### Build und Vorschau

```bash
# Seite bauen
npm run build

# Lokal vorschauen
npm run preview
```

### URLs überprüfen

Nach der Migration funktionieren Ihre URLs wie folgt:

| Alte URL | Neue URL | Hinweise |
|----------|----------|----------|
| `/docs/getting-started` | `/docs/v1/getting-started` | Versions-Präfix hinzugefügt |
| `/docs/` | `/docs/v1/` | Weiterleitung zur aktuellen Version |
| N/A | `/docs/latest/getting-started` | Neuer Alias für aktuelle Version |

Mit i18n:

| Alte URL | Neue URL |
|----------|----------|
| `/en/docs/getting-started` | `/en/docs/v1/getting-started` |
| `/de/docs/getting-started` | `/de/docs/v1/getting-started` |

### E2E-Tests ausführen

Falls Sie bestehende E2E-Tests haben, aktualisieren Sie die URL-Erwartungen:

```typescript
// Vorher
await page.goto('/docs/getting-started')

// Nachher
await page.goto('/docs/v1/getting-started')
// Oder den latest-Alias verwenden:
await page.goto('/docs/latest/getting-started')
```

---

## Schritt 6: Interne Links aktualisieren

Falls Ihre Dokumentation interne Links enthält, aktualisieren Sie diese, um die Version einzuschließen:

### Option A: Relative Links verwenden (Empfohlen)

Relative Links funktionieren automatisch innerhalb derselben Version:

```markdown
<!-- Funktioniert - bleibt in derselben Version -->
Siehe die [Konfigurationsanleitung](./configuration)
Siehe die [API-Referenz](../advanced/api)
```

### Option B: Latest-Alias verwenden

Für Links, die immer auf die aktuelle Version zeigen sollen:

```markdown
<!-- Zeigt immer auf aktuelle Version -->
Siehe die [Erste Schritte](/docs/latest/getting-started)
```

### Option C: Explizite Versionen verwenden

Für Links zu bestimmten Versionen:

```markdown
<!-- Links zu bestimmter Version -->
Siehe die [v1 Migrationsanleitung](/docs/v1/migration)
```

---

## Eine zweite Version hinzufügen

Wenn Sie bereit sind, eine neue Version hinzuzufügen:

### 1. Inhalte kopieren

```bash
cp -r docs/v1 docs/v2
```

### 2. Konfiguration aktualisieren

```javascript
// astro.config.mjs
versions: {
  current: 'v2',  // current aktualisieren
  available: [
    { version: 'v2', label: 'Version 2.0 (Aktuell)' },
    { version: 'v1', label: 'Version 1.0' },
  ],
  stable: 'v2',  // stable aktualisieren
},
```

### 3. Content Collection aktualisieren

```typescript
createVersionedDocsCollection('./docs', {
  versions: ['v1', 'v2'],  // Neue Version hinzufügen
  fallbackVersion: 'v2',   // Fallback aktualisieren
})
```

### 4. v2-Inhalte aktualisieren

Ändern Sie die Inhalte in `docs/v2/`, um die Änderungen der neuen Version widerzuspiegeln.

---

## Fehlerbehebung

### Häufige Probleme

**Build schlägt fehl mit "cannot find content"**

- Stellen Sie sicher, dass alle Dateien in das Versionsverzeichnis verschoben wurden
- Überprüfen Sie, dass das `versions`-Array alle Ihre Versionsordnernamen enthält
- Überprüfen Sie, ob die Ordnernamen exakt übereinstimmen (Groß-/Kleinschreibung beachten)

**Version Selector erscheint nicht**

- Der Selector erscheint nur bei 2+ konfigurierten Versionen
- Bei einer einzelnen Version wird kein Selector benötigt

**404-Fehler bei bestehenden URLs**

- Alte URLs ohne Versions-Präfix werden nicht automatisch weitergeleitet
- Erwägen Sie, Weiterleitungen in Ihrer Hosting-Konfiguration hinzuzufügen
- Oder aktualisieren Sie alle internen/externen Links auf neue versionierte URLs

**Sidebar zeigt falsche Seiten**

- Die Sidebar filtert automatisch nach aktueller Version
- Stellen Sie sicher, dass sich Ihre Inhalte im korrekten Versionsverzeichnis befinden

### Hilfe erhalten

Falls Sie auf Probleme stoßen:

1. Überprüfen Sie, dass Ihre Ordnerstruktur dem erwarteten Muster entspricht
2. Verifizieren Sie, dass Versionsnamen in allen Konfigurationsdateien konsistent sind
3. Führen Sie einen sauberen Build aus: `rm -rf dist .astro && npm run build`
4. Überprüfen Sie die Browser-Konsole auf Fehler

---

## Rollback-Plan

Falls Sie die Migration rückgängig machen müssen:

1. Inhalte aus dem Versionsverzeichnis zurückverschieben:
   ```bash
   mv docs/v1/* docs/
   rmdir docs/v1
   ```

2. `src/content.config.ts` zurücksetzen, um `docsSchema` und `glob` direkt zu verwenden

3. Die `versions`-Konfiguration aus `astro.config.mjs` entfernen

---

## Siehe auch

- [Dokumentations-Versionierung](./versioning) - Vollständige Versionierungsreferenz
- [@levino/shipyard-docs](../docs-package) - Vollständige Docs-Paket-Referenz
