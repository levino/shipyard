---
title: Versionslebenszyklus
sidebar_position: 3
description: Verwaltung des vollständigen Lebenszyklus von Dokumentationsversionen
---

# Versionslebenszyklus Beispiel

Dieses Beispiel zeigt, wie Versionen über ihren gesamten Lebenszyklus verwaltet werden: von der Veröffentlichung einer neuen Version, über die Markierung als stabil, die Abkündigung älterer Versionen bis hin zur Archivierung.

## Versionsstatus

Eine Dokumentationsversion durchläuft typischerweise diese Status:

| Status | Badge | Beschreibung |
|--------|-------|--------------|
| **Unreleased** | `info` | Pre-Release, Beta oder Release Candidate |
| **Current** | `primary` | Die neueste veröffentlichte Version |
| **Stable** | `success` | Die empfohlene Version für die meisten Benutzer |
| **Deprecated** | `warning` | Noch verfügbar, aber nicht mehr gepflegt |
| **Archived** | (entfernt) | Nicht mehr in der Dokumentation verfügbar |

## Szenario: Veröffentlichung von v3

Betrachten wir ein typisches Szenario, bei dem Sie v1 und v2 haben und v3 veröffentlichen.

### Ausgangszustand (Vor v3 Release)

```javascript
// astro.config.mjs - Vor v3 Release
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',
        available: [
          { version: 'v2', label: 'Version 2.0' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',
      },
    }),
  ],
})
```

### Schritt 1: v3 als Unreleased hinzufügen

Fügen Sie zunächst v3 als Pre-Release-Version hinzu, während Sie sie noch entwickeln:

```javascript
// astro.config.mjs - v3 in Entwicklung
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v2',  // v2 ist noch der Standard
        available: [
          { version: 'v3', label: 'Version 3.0 (Beta)', banner: 'unreleased' },
          { version: 'v2', label: 'Version 2.0' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v2',  // v2 ist noch stabil
      },
    }),
  ],
})
```

Erstellen Sie das neue Versionsverzeichnis:

```bash
mkdir -p docs/v3
cp -r docs/v2/* docs/v3/
```

Aktualisieren Sie die Content Collection:

```typescript
// src/content.config.ts
const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2', 'v3'],  // v3 hinzufügen
    fallbackVersion: 'v2',
  }),
)
```

### Schritt 2: v3 veröffentlichen (Current machen)

Wenn v3 bereit zur Veröffentlichung ist:

```javascript
// astro.config.mjs - v3 veröffentlicht
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v3',  // v3 ist jetzt current
        available: [
          { version: 'v3', label: 'Version 3.0' },  // 'unreleased' Banner entfernen
          { version: 'v2', label: 'Version 2.0' },
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1'],
        stable: 'v3',  // v3 ist jetzt stabil
      },
    }),
  ],
})
```

**Was sich ändert:**
- Benutzer, die `/docs/` besuchen, werden zu `/docs/v3/` weitergeleitet
- `/docs/latest/` zeigt jetzt auf v3
- v3 zeigt das "Stable" Badge

### Schritt 3: v2 abkündigen

Nachdem v3 eine Weile stabil war, kündigen Sie v2 ab:

```javascript
// astro.config.mjs - v2 abgekündigt
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v3',
        available: [
          { version: 'v3', label: 'Version 3.0' },
          { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },  // Banner hinzufügen
          { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
        ],
        deprecated: ['v1', 'v2'],  // v2 zur deprecated Liste hinzufügen
        stable: 'v3',
      },
    }),
  ],
})
```

**Was sich ändert:**
- v2-Seiten zeigen jetzt das Abkündigungs-Warnbanner
- v2 zeigt das "Deprecated" Badge
- Das Banner enthält einen Link zur gleichen Seite in v3

### Schritt 4: v1 archivieren

Wenn eine Version so alt ist, dass sie nicht mehr nützlich ist, entfernen Sie sie vollständig:

```javascript
// astro.config.mjs - v1 archiviert
export default defineConfig({
  integrations: [
    shipyardDocs({
      versions: {
        current: 'v3',
        available: [
          { version: 'v3', label: 'Version 3.0' },
          { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },
          // v1 aus available entfernt
        ],
        deprecated: ['v2'],  // v1 aus deprecated entfernen
        stable: 'v3',
      },
    }),
  ],
})
```

Aktualisieren Sie die Content Collection:

```typescript
// src/content.config.ts
const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v2', 'v3'],  // v1 entfernen
    fallbackVersion: 'v3',
  }),
)
```

Optional können Sie den Inhalt archivieren:

```bash
# v1 Inhalt archivieren (optional, zur Referenz)
tar -czf archive/docs-v1.tar.gz docs/v1/
rm -rf docs/v1/
```

## Vollständige Konfigurations-Timeline

So entwickelt sich die Konfiguration über einen typischen Versionslebenszyklus:

### Zeitachse

```
Zeit ──────────────────────────────────────────────────────────────────>

v1:  [stable]────────[deprecated]──────────────────────[archived]
v2:           [unreleased]──[stable]───────[deprecated]───────────────>
v3:                              [unreleased]──[stable]───────────────>
v4:                                                 [unreleased]──────>
```

### Konfiguration an jedem Punkt

**Punkt A: v2 ist neu**
```javascript
versions: {
  current: 'v1',
  available: [
    { version: 'v2', label: 'Version 2.0 (Beta)', banner: 'unreleased' },
    { version: 'v1', label: 'Version 1.0' },
  ],
  deprecated: [],
  stable: 'v1',
}
```

**Punkt B: v2 veröffentlicht**
```javascript
versions: {
  current: 'v2',
  available: [
    { version: 'v2', label: 'Version 2.0' },
    { version: 'v1', label: 'Version 1.0' },
  ],
  deprecated: [],
  stable: 'v2',
}
```

**Punkt C: v1 abgekündigt**
```javascript
versions: {
  current: 'v2',
  available: [
    { version: 'v2', label: 'Version 2.0' },
    { version: 'v1', label: 'Version 1.0', banner: 'unmaintained' },
  ],
  deprecated: ['v1'],
  stable: 'v2',
}
```

**Punkt D: v3 veröffentlicht, v1 archiviert**
```javascript
versions: {
  current: 'v3',
  available: [
    { version: 'v3', label: 'Version 3.0' },
    { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },
  ],
  deprecated: ['v2'],
  stable: 'v3',
}
```

## Best Practices

### Wann abkündigen

Kündigen Sie eine Version ab, wenn:
- Eine neuere Version für mindestens einen Release-Zyklus stabil war
- Die alte Version keine Sicherheitsupdates mehr erhält
- Sie Benutzer zur Migration ermutigen möchten

### Wann archivieren

Archivieren Sie eine Version, wenn:
- Weniger als 5% des Traffics auf diese Version entfällt
- Die Version mehr als 2-3 Hauptversionen zurückliegt
- Die Pflege des Inhalts nicht mehr lohnenswert ist
- Sie den Benutzern genügend Zeit für die Migration gegeben haben

### Abkündigungszeitraum

Ein typischer Abkündigungs-Zeitplan:
1. **Abkündigung ankündigen** in den Release Notes, wenn die neue Version erscheint
2. **Abkündigungsbanner hinzufügen** 1-2 Monate nachdem die neue Version stabil ist
3. **Archivieren** 6-12 Monate nach der Abkündigung (abhängig von Ihrem Release-Zyklus)

### Änderungen kommunizieren

- Verwenden Sie die `banner`-Eigenschaft, um klare Warnungen bei abgekündigten Versionen anzuzeigen
- Aktualisieren Sie das `label`, um den Status anzuzeigen (z.B. "Version 1.0 (Legacy)")
- Fügen Sie Migrationsanleitungen hinzu, die von abgekündigten zur aktuellen Version verlinken
- Erwägen Sie Blog-Posts oder Changelogs für größere Versionsübergänge

## Sonderfälle behandeln

### Release Candidates

Für Pre-Release-Versionen:

```javascript
{ version: 'v3-rc', label: 'Version 3.0 RC1', path: 'v3-rc', banner: 'unreleased' }
```

### LTS (Long-Term Support) Versionen

Für LTS-Versionen mit erweitertem Support:

```javascript
{
  current: 'v4',
  available: [
    { version: 'v4', label: 'Version 4.0' },
    { version: 'v3-lts', label: 'Version 3.0 LTS', path: 'v3-lts' },
    { version: 'v2', label: 'Version 2.0', banner: 'unmaintained' },
  ],
  deprecated: ['v2'],
  stable: 'v4',  // oder 'v3-lts' wenn LTS für Produktion empfohlen wird
}
```

### Parallele Hauptversionen

Wenn Sie zwei aktive Hauptversionen pflegen (z.B. Python 2/3 Situation):

```javascript
{
  current: 'v3',
  available: [
    { version: 'v3', label: 'Version 3.x' },
    { version: 'v2', label: 'Version 2.x' },  // Kein Abkündigungsbanner
  ],
  deprecated: [],
  stable: 'v3',  // v3 für neue Projekte empfehlen
}
```

## Nächste Schritte

- Siehe [Einfache Versionierung](./basic-versioning) für die Ersteinrichtung
- Siehe [Dokumentations-Versionierung Leitfaden](../guides/versioning) für Konfigurationsreferenz
- Siehe [Migration zu versionierten Docs](../guides/migration-to-versioned) für Migrationshilfe
