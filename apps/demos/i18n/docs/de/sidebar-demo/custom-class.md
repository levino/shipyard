---
title: Demo Benutzerdefinierte Klasse
sidebar_class_name: font-bold text-warning
sidebar_position: 10
---

# Benutzerdefinierte Klasse

Dieses Element hat benutzerdefinierte Seitenleistenklassen `font-bold text-warning` angewendet.

Obwohl es alphabetisch an zweiter Stelle steht (`custom-class.md`), erscheint diese Seite **zuerst** in der Seitenleiste, weil `sidebar_position: 10` der niedrigste Wert ist.

Das Seitenleistenelement sollte **fett** mit einer **Warnfarbe** erscheinen (typischerweise gelb/orange je nach Theme).

```yaml
sidebar_class_name: font-bold text-warning
sidebar_position: 10
```
