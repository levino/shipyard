---
title: Seitenleisten-Demo-Bereich
sidebar_position: 0
---

# Seitenleisten-Demo

Willkommen im Seitenleisten-Demo-Bereich. Dieser Bereich demonstriert die Docusaurus-ähnlichen Seitenleisten-Frontmatter-Optionen.

## Neuanordnungs-Demo

Beachten Sie, dass die Seitenleistenelemente unten in dieser Reihenfolge erscheinen:

1. **Benutzerdefinierte Klasse** (Position 10) - alphabetisch zweiter, wird als erstes angezeigt
2. **Fancy Label** (Position 30) - alphabetisch erster, wird als zweites angezeigt

Dies zeigt, dass `sidebar_position` die Reihenfolge steuert, unabhängig von Dateinamen!

## Verfügbare Frontmatter-Optionen

- `sidebar_position` - Steuert die Reihenfolge der Elemente in der Seitenleiste
- `sidebar_label` - Überschreibt die Anzeigebeschriftung in der Seitenleiste
- `sidebar_class_name` - Fügt dem Seitenleistenelement benutzerdefinierte CSS-Klassen hinzu

## Warum keine `sidebar_custom_props`?

Anders als Docusaurus unterstützt shipyard derzeit keine `sidebar_custom_props`. In Docusaurus werden benutzerdefinierte Props für Funktionen wie Badges ("Neu", "Beta", "Veraltet") oder andere Metadaten verwendet, die von benutzerdefinierten Seitenleistenkomponenten gerendert werden können.

Da shipyard eine Standard-Seitenleistenkomponente verwendet, die keine benutzerdefinierten Props verarbeitet, würde die Unterstützung dieser Funktion erfordern, dass Benutzer ihre eigene Seitenleistenkomponente erstellen. Wir könnten diese Funktion in einer zukünftigen Version hinzufügen, wenn wir einen klareren Anwendungsfall und Implementierungsplan haben.

Vorerst können Sie ähnliche visuelle Effekte mit `sidebar_class_name` und Tailwind/DaisyUI Utility-Klassen erreichen.
