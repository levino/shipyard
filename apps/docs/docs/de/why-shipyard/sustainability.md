---
title: Nachhaltigkeit & Produktionsreife
slug: 'de/why-shipyard/sustainability'
sidebar:
  position: 3
---

# Nachhaltigkeit & Produktionsreife

Ist shipyard bereit für den Produktionseinsatz? Wer pflegt es? Wird es in einem Jahr noch da sein? Diese Seite beantwortet diese Fragen ehrlich.

> **Hinweis:** Diese Seite spiegelt den Stand des Projekts im Dezember 2025 wider.

## Ist shipyard produktionsreif?

**Ja.** shipyard wird bereits in mehreren Produktionsprojekten eingesetzt. Die meisten Features funktionieren gut.

Hier ist eine ehrliche Einschätzung des aktuellen Stands:

| Aspekt | Status |
|--------|--------|
| **Kernfunktionalität** | Solide – Layouts, Navigation, Doku und Blog funktionieren zuverlässig |
| **Aktive Entwicklung** | Ja – Features werden basierend auf echten Projektbedürfnissen priorisiert |
| **Semantic Versioning** | Ja – Breaking Changes resultieren in Versionssprüngen |
| **Dokumentation** | Wachsend – Kern-Features sind dokumentiert |
| **Testabdeckung** | E2E-Tests für kritische Pfade |

## Wer pflegt shipyard?

shipyard ist aktuell ein **Ein-Personen-Projekt**, gepflegt von [Levin Keller](https://github.com/levino).

### Ist das ein Problem?

Nicht unbedingt. Bedenke:

- **Starlight hat genauso angefangen** – [Chris Swithinbank](https://github.com/delucis) hat es als Solo-Projekt gebaut, bevor er von Astro eingestellt wurde
- **Viele erfolgreiche Tools sind Kleinteam-Projekte** – Qualität erfordert kein großes Team
- **Fokussierte Entwicklung** – Ein Maintainer bedeutet konsistente Vision und schnelle Entscheidungen

### Was ist mit langfristiger Nachhaltigkeit?

shipyard wird in Produktion für die eigenen Projekte des Maintainers eingesetzt. Das bedeutet:

- Es gibt echten Anreiz, es am Laufen zu halten
- Features sind battle-tested in echten Anwendungsfällen
- Bugs werden gefixt wenn sie Produktion betreffen

## Die Funding-Frage

Lass uns direkt über Ressourcen sprechen:

| Projekt | Unterstützung |
|---------|---------------|
| **Docusaurus** | Meta (Facebook) – signifikante Unternehmensressourcen |
| **Starlight** | Astro – Chris Swithinbank ist jetzt bei Astro angestellt |
| **shipyard** | Unabhängig – ein Entwickler, keine Unternehmensunterstützung |

Das ist ein echter Unterschied. Docusaurus hat dedizierte Ingenieure. Starlight hat offizielle Astro-Unterstützung. shipyard hat eine Person, die in ihrer verfügbaren Zeit daran arbeitet.

### Warum shipyard trotzdem konkurrieren kann

**KI-augmentierte Entwicklung ändert die Gleichung.**

shipyard ist auch ein Experiment: Kann ein einzelner Entwickler, augmentiert durch KI-Tools wie Claude, den gleichen Wert liefern wie ein gut finanziertes Team? Bisher scheint die Antwort ja zu sein.

- shipyard hat bereits Features, die Starlight fehlen
- Die Entwicklungsgeschwindigkeit ist höher als man von einem Solo-Projekt erwarten würde
- KI-Unterstützung übernimmt viel von der Implementierungsarbeit

Es geht nicht darum, mit Metas Ressourcen zu konkurrieren. Es geht darum zu beweisen, dass moderne KI-Tools das Spielfeld für unabhängige Entwickler ebnen können, die qualitativ hochwertige Open-Source-Software bauen.

## Beitragen

Willst du helfen? Beiträge sind willkommen:

- **Öffne ein Issue** – Melde Bugs oder fordere Features an auf [GitHub](https://github.com/levino/shipyard/issues)
- **Reiche einen Pull Request ein** – Code-Beiträge sind willkommen
- **Teile Feedback** – Erzähl uns, was shipyard für deine Projekte nützlicher machen würde
- **Verbreite es weiter** – Gib dem Repo einen Stern, teile es mit anderen

## Versionspolitik

shipyard folgt Semantic Versioning:

- **Patch-Versionen** (0.x.Y) – Bugfixes, keine Breaking Changes
- **Minor-Versionen** (0.X.0) – Neue Features, potenziell breaking in 0.x
- **Major-Versionen** (X.0.0) – Breaking Changes (wenn wir 1.0 erreichen)

Du wirst nicht von Breaking Changes überrascht. Update wenn du bereit bist, prüfe das Changelog und migriere in deinem eigenen Tempo.

## Das Fazit

shipyard ist heute produktionsreif. Es wird von jemandem gepflegt, der es in Produktion nutzt. Es hat vielleicht nicht Metas Ressourcen, aber es wird aktiv entwickelt und verbessert.

Wenn du die Sicherheit von Unternehmensunterstützung brauchst, wähle Docusaurus. Wenn du schlanke, komponierbare Bausteine willst und mit einem unabhängigen Projekt zufrieden bist, ist shipyard bereit für dich.
