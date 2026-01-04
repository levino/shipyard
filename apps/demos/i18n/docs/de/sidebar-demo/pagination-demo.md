---
title: Paginierungs-Demo
sidebar_position: 40
---

# Paginierungs-Demo

Diese Seite demonstriert die automatische Paginierungsfunktion in shipyard Dokumentationen.

## Was ist Paginierung?

Ähnlich wie Docusaurus fügt shipyard automatisch "Zurück"- und "Weiter"-Navigationsschaltflächen am Ende jeder Dokumentationsseite hinzu. Diese Schaltflächen helfen Benutzern, durch Ihre Dokumentation in der von Ihrer Seitenleiste definierten Reihenfolge zu navigieren.

## Wie es funktioniert

1. **Automatische Sortierung**: Die Paginierung folgt der Seitenleistenstruktur und -reihenfolge
2. **Verschachtelte Kategorien**: Funktioniert nahtlos über verschachtelte Dokumentationskategorien
3. **Anpassbar**: Sie können die Standard-Vor/Zurück-Seiten per Frontmatter überschreiben

## Paginierung anpassen

Sie können die Paginierung über Frontmatter anpassen:

```yaml
---
pagination_next: pfad/zur/naechsten/seite.md
pagination_prev: pfad/zur/vorherigen/seite.md
---
```

### Paginierung deaktivieren

Um die Weiter-Schaltfläche zu deaktivieren:
```yaml
---
pagination_next: null
---
```

Um die Zurück-Schaltfläche zu deaktivieren:
```yaml
---
pagination_prev: null
---
```

Um beide zu deaktivieren:
```yaml
---
pagination_next: null
pagination_prev: null
---
```

## Probieren Sie es aus

Schauen Sie am Ende dieser Seite - Sie sollten Paginierungsschaltflächen sehen, mit denen Sie zur vorherigen und nächsten Seite in der Dokumentation navigieren können.
