---
title: Die shipyard-Philosophie
slug: 'de/why-shipyard/philosophy'
sidebar:
  position: 2
---

# Die shipyard-Philosophie

shipyard basiert auf einigen Kernprinzipien, die jede Design-Entscheidung leiten.

## Auf Astros Stärken gebaut

Anstatt gegen ein Framework zu kämpfen, umarmt shipyard was Astro am besten kann:

- **Content Collections** um jeden Content-Typ zu verwalten – Doku, Blogs, Events, Produkte, was immer du brauchst
- **Statischer HTML-Output** standardmäßig, mit optionalem Server-Side Rendering wenn nötig
- **Einfache Astro-Komponenten** mit sauberer Syntax und keinem Framework-Lock-in

Das bedeutet du bekommst Astros Performance und Flexibilität während shipyard die Page-Builder-Belange handhabt.

## Komponierbare Bausteine

Anders als Starlight, das alles an sein Doku-System koppelt, trennt shipyard Concerns in unabhängige Pakete:

| Paket | Zweck | Anwendungsfall |
|-------|-------|----------------|
| **@levino/shipyard-base** | Kern-Layouts, Navigation, Styling | Marketing-Seite, Landing Pages |
| **@levino/shipyard-docs** | Dokumentations-Features | Hinzufügen wenn du Doku brauchst |
| **@levino/shipyard-blog** | Blog-Funktionalität | Hinzufügen wenn du einen Blog brauchst |

**Mischen und kombinieren.** Nutze ein Paket oder alle drei. Deine Seite, deine Wahl.

### Warum das wichtig ist

Viele Projekte starten als einfache Landing Page, brauchen dann Doku, dann einen Blog. Mit Starlight müsstest du alles umstrukturieren um Non-Doku-Content hinzuzufügen. Mit shipyard installierst du einfach ein weiteres Paket.

Umgekehrt, wenn du nur eine Marketing-Seite mit Blog brauchst – keine Doku – zwingt dir shipyard keine Dokumentations-Infrastruktur auf.

## Battle-Tested Styling mit DaisyUI

Anstatt eine eigene Komponentenbibliothek zu bauen, die stagnieren könnte (wie Infima), nutzt shipyard [DaisyUI](https://daisyui.com/) – eine ausgereifte, gut dokumentierte, aktiv gepflegte Komponentenbibliothek auf [Tailwind CSS](https://tailwindcss.com/).

### Warum DaisyUI?

- **Das Rad nicht neu erfinden** – DaisyUI ist battle-tested durch tausende Projekte
- **Exzellente Dokumentation** – Alles ist dokumentiert und einfach anpassbar
- **Aktive Pflege** – Regelmäßige Updates und Bugfixes
- **Tailwind-Grundlage** – Vertrauter utility-first Ansatz
- **Theme-Support** – Eingebaute Themes und einfache Anpassung

Das lässt shipyard sich auf Page-Builder-Belange fokussieren während Styling an Experten delegiert wird.

## Einfache Migration rein und raus

**Dein Content ist einfach Markdown.** Das ist eine bewusste Entscheidung, die deine Optionen offen hält:

- **Von Docusaurus zu shipyard migrieren** dauert Minuten – deine Markdown-Dateien funktionieren wie sie sind
- **Von Starlight zu shipyard migrieren** ist genauso einfach
- **Von shipyard weg migrieren** ist genauso einfach wenn du es jemals brauchst

*Tipp: Nutze einen KI-Assistenten wie Claude um bei der Migration zu helfen. Da es nur Markdown-Dateien verschieben und Konfiguration anpassen ist, können KI-Tools die meiste Arbeit für dich erledigen.*

### Kein Vendor Lock-In

shipyard erfordert nicht:

- Proprietäre Dateiformate
- Komplexe Content-Transformationen
- Spezielle Syntax, die nur in shipyard funktioniert
- Ungewöhnliche Verzeichnisstrukturen

Wenn du entscheidest, dass shipyard nicht das Richtige für dich ist, nimm deine Markdown-Dateien und zieh weiter. Diese niedrigen Wechselkosten bedeuten, dass du shipyard ohne Commitment ausprobieren kannst – wenn es nicht klappt, hast du nichts verloren.

## Zusammenfassung der Design-Prinzipien

1. **Astro nutzen** – Nicht gegen das Framework kämpfen, es erweitern
2. **Concerns trennen** – Doku, Blog und Basis-Funktionalität sind unabhängig
3. **Bewährte Tools nutzen** – DaisyUI für Styling, Tailwind für Utilities
4. **Kein Lock-in** – Standard-Markdown, einfache Migration
5. **Schlank halten** – Statisches HTML standardmäßig, JavaScript nur wenn nötig
