---
title: Dokumentations-Versionierung
sidebar_position: 1
description: Erfahren Sie, wie Sie versionierte Dokumentation mit shipyard erstellen
---

# Dokumentations-Versionierung

shipyard unterstützt versionierte Dokumentation, mit der Sie mehrere Versionen Ihrer Dokumentation parallel zu Ihren Software-Releases pflegen können. Dies ist nützlich, wenn Sie Dokumentation für verschiedene Versionen Ihres Produkts oder Ihrer API bereitstellen müssen.

## Überblick

Mit versionierten Docs können Benutzer:
- Zwischen verschiedenen Versionen über einen Version-Selector wechseln
- Auf Dokumentation für ältere Releases zugreifen
- Deprecation-Warnungen bei veralteten Versionen sehen
- Einen `/latest/`-Alias verwenden, der immer auf die aktuelle Version zeigt

## Schnellstart

### 1. Versionseinstellungen konfigurieren

Aktualisieren Sie Ihre `astro.config.mjs`, um die Versionskonfiguration hinzuzufügen:

```javascript
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

### 2. Content Collection einrichten

Aktualisieren Sie Ihre `src/content.config.ts`, um den Helper für versionierte Collections zu verwenden:

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

### 3. Inhalte nach Version organisieren

Strukturieren Sie Ihr docs-Verzeichnis mit Versions-Unterverzeichnissen:

```
docs/
├── v2/
│   ├── index.md
│   ├── installation.md
│   └── configuration.md
└── v1/
    ├── index.md
    └── installation.md
```

Das war's! Ihre versionierte Dokumentation ist jetzt unter `/docs/v2/`, `/docs/v1/` und `/docs/latest/` verfügbar.

---

## Konfigurationsreferenz

### Version Config Optionen

Die `versions`-Option in `shipyardDocs()` akzeptiert folgende Eigenschaften:

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|-------------|-----|--------------|--------------|
| `current` | `string` | Ja | Die Standardversion, die angezeigt wird, wenn Benutzer `/docs/` besuchen |
| `available` | `SingleVersionConfig[]` | Ja | Array aller verfügbaren Versionen |
| `deprecated` | `string[]` | Nein | Versions-Identifier, die als deprecated markiert werden sollen |
| `stable` | `string` | Nein | Die stabile Release-Version (Standard: `current`) |

### SingleVersionConfig Optionen

Jeder Eintrag im `available`-Array kann folgende Eigenschaften haben:

| Eigenschaft | Typ | Erforderlich | Beschreibung |
|-------------|-----|--------------|--------------|
| `version` | `string` | Ja | Der Versions-Identifier (z.B. `"v2"`, `"1.0.0"`) |
| `label` | `string` | Nein | Benutzerfreundliches Label für die UI (Standard: `version`) |
| `path` | `string` | Nein | URL-Pfad-Segment (Standard: `version`) |
| `banner` | `'unreleased' \| 'unmaintained'` | Nein | Banner, das für diese Version angezeigt wird |

### Beispielkonfiguration

```javascript
shipyardDocs({
  versions: {
    // Die Standardversion für /docs/
    current: 'v2',

    // Alle verfügbaren Versionen (Reihenfolge wichtig für UI-Anzeige)
    available: [
      {
        version: 'v3-beta',
        label: 'Version 3.0 (Beta)',
        banner: 'unreleased',
      },
      {
        version: 'v2',
        label: 'Version 2.0 (Aktuell)',
      },
      {
        version: 'v1',
        label: 'Version 1.x',
        banner: 'unmaintained',
      },
    ],

    // Versionen, die Deprecation-Warnungen anzeigen
    deprecated: ['v1'],

    // Das stabile Release
    stable: 'v2',
  },
})
```

---

## Verzeichnisstruktur

### Grundstruktur

Für versionierte Docs ohne i18n:

```
docs/
├── v2/                    # Aktuelle/neueste Version
│   ├── index.md
│   ├── getting-started.md
│   └── advanced/
│       └── configuration.md
└── v1/                    # Vorherige Version
    ├── index.md
    └── getting-started.md
```

### Mit Internationalisierung

Wenn Sie Versionen mit i18n kombinieren, fügen Sie Locale-Verzeichnisse innerhalb jeder Version hinzu:

```
docs/
├── v2/
│   ├── en/
│   │   ├── index.md
│   │   └── getting-started.md
│   └── de/
│       ├── index.md
│       └── getting-started.md
└── v1/
    ├── en/
    │   └── index.md
    └── de/
        └── index.md
```

URLs werden zu: `/en/docs/v2/getting-started`, `/de/docs/v1/`, etc.

### Benennung von Versionsordnern

**Wichtig:** Vermeiden Sie Punkte in Versionsordnernamen. Astros Content-Collection-Loader entfernt Punkte aus Ordnernamen in Dokument-IDs, was zu Problemen führen kann.

| Ordnername | Status | Hinweise |
|------------|--------|----------|
| `v1/` | Gut | Einfach, sauber |
| `v2/` | Gut | |
| `next/` | Gut | Für unveröffentlichte Versionen |
| `v1.0/` | Vermeiden | Punkte werden aus IDs entfernt |
| `2.0.0/` | Vermeiden | Punkte verursachen Probleme |

Verwenden Sie die `label`-Eigenschaft, um die vollständige Versionsnummer in der UI anzuzeigen:

```javascript
{ version: 'v2', label: 'Version 2.0.0' }
```

---

## URL-Struktur

### Routen-Muster

| Muster | Beispiel | Beschreibung |
|--------|----------|--------------|
| `/docs/[version]/[...slug]` | `/docs/v2/installation` | Standard-versionierte Route |
| `/docs/latest/[...slug]` | `/docs/latest/installation` | Alias für aktuelle Version |
| `/docs/` | `/docs/` | Weiterleitung zur aktuellen Version |

Mit aktiviertem i18n:

| Muster | Beispiel |
|--------|----------|
| `/[locale]/docs/[version]/[...slug]` | `/en/docs/v2/installation` |
| `/[locale]/docs/latest/[...slug]` | `/de/docs/latest/installation` |

### Der `/latest/`-Alias

Der `/latest/`-Alias wird automatisch für alle Seiten der aktuellen Version generiert. Dies ermöglicht es Benutzern, auf Dokumentation zu verlinken, die immer auf die neueste Version zeigt.

```markdown
<!-- Verlinkt immer auf aktuelle Version -->
Siehe die [Installationsanleitung](/docs/latest/installation)
```

---

## Eine neue Version hinzufügen

Beim Release einer neuen Version:

1. **Versionsverzeichnis erstellen**
   ```bash
   mkdir -p docs/v3
   ```

2. **Inhalte von der vorherigen Version kopieren**
   ```bash
   cp -r docs/v2/* docs/v3/
   ```

3. **Konfiguration aktualisieren**
   ```javascript
   versions: {
     current: 'v3',  // current aktualisieren
     available: [
       { version: 'v3', label: 'Version 3.0 (Aktuell)' },  // Neu hinzufügen
       { version: 'v2', label: 'Version 2.0' },  // Label aktualisieren
       { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
     ],
     deprecated: ['v1'],  // Beibehalten oder aktualisieren
     stable: 'v3',  // stable aktualisieren
   }
   ```

4. **Content Collection Konfiguration aktualisieren**
   ```typescript
   createVersionedDocsCollection('./docs', {
     versions: ['v1', 'v2', 'v3'],  // Neue Version hinzufügen
     fallbackVersion: 'v3',  // Fallback aktualisieren
   })
   ```

5. **Inhalte der neuen Version aktualisieren**
   - Neue Features dokumentieren
   - Geänderte APIs aktualisieren
   - Veraltete Features entfernen

---

## Eine Version deprecaten

Beim Deprecaten einer älteren Version:

1. **Zur deprecated-Liste hinzufügen**
   ```javascript
   deprecated: ['v1', 'v2'],  // Deprecated Version hinzufügen
   ```

2. **Unmaintained-Banner hinzufügen**
   ```javascript
   available: [
     { version: 'v3', label: 'Version 3.0 (Aktuell)' },
     { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },  // Banner hinzufügen
     { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
   ],
   ```

3. **Sehr alte Versionen entfernen (optional)**

   Sie können Versionen vollständig entfernen durch:
   - Entfernen aus dem `available`-Array
   - Entfernen aus dem `deprecated`-Array
   - Löschen des Versionsverzeichnisses
   - Entfernen aus der Content Collection Konfiguration

---

## Version Selector

Die Version-Selector-UI erscheint automatisch in der Navbar und der mobilen Sidebar, wenn mehrere Versionen konfiguriert sind.

### Anzeige-Badges

Der Version Selector zeigt Badges an, um Benutzern den Versionsstatus zu verdeutlichen:

| Badge | Bedeutung | Auslöser |
|-------|-----------|----------|
| **stable** (grün) | Stabiles Release | Entspricht der `stable`-Konfigurationseigenschaft |
| **deprecated** (gelb) | Veraltet/nicht mehr gepflegt | Im `deprecated`-Array oder hat `banner: 'unmaintained'` |
| **unreleased** (blau) | Vorschau/Beta-Version | Hat `banner: 'unreleased'` |

### Verhalten

- Ein Klick auf eine Version navigiert zur gleichen Seite in der ausgewählten Version
- Wenn die Seite in der Zielversion nicht existiert, wird zum Index der Version navigiert
- Die aktuelle Version wird visuell hervorgehoben

---

## Best Practices

### Content-Management

1. **Mit einer Version beginnen**: Bringen Sie Ihre Docs zuerst ohne Versionierung zum Laufen, dann fügen Sie Versionen hinzu, wenn Sie sie benötigen.

2. **Versionen fokussiert halten**: Pflegen Sie nur aktiv unterstützte Versionen. Entfernen Sie sehr alte Versionen, wenn sie nicht mehr relevant sind.

3. **Breaking Changes dokumentieren**: Wenn sich eine Seite zwischen Versionen erheblich ändert, dokumentieren Sie die Unterschiede klar.

4. **Konsistente Struktur verwenden**: Behalten Sie nach Möglichkeit die gleiche Seitenhierarchie über Versionen hinweg bei, damit Links beim Versionswechsel nicht brechen.

### Konfigurationstipps

1. **Beschreibende Labels verwenden**: Machen Sie deutlich, welche Version latest/stable ist:
   ```javascript
   { version: 'v2', label: 'Version 2.0 (Aktuell)' }
   ```

2. **Pre-Release-Versionen markieren**: Verwenden Sie das `unreleased`-Banner für Beta/Preview-Versionen:
   ```javascript
   { version: 'v3-beta', banner: 'unreleased' }
   ```

3. **Versionen geordnet halten**: Listen Sie Versionen von neu nach alt im `available`-Array auf.

### Performance-Überlegungen

Jede Version generiert einen vollständigen Satz statischer Seiten. Bei großen Dokumentationsseiten mit vielen Versionen:

- Erwägen Sie, die Anzahl der gepflegten Versionen zu begrenzen
- Entfernen Sie deprecated Versionen nach einem angemessenen Deprecation-Zeitraum
- Verwenden Sie sinnvolle Seitengrenzen, um sehr große einzelne Seiten zu vermeiden

---

## Siehe auch

- [@levino/shipyard-docs](../docs-package) - Vollständige Docs-Paket-Referenz
- [Erste Schritte](../getting-started) - Einführungsleitfaden
