---
title: Vergleich mit anderen Tools
slug: 'de/why-shipyard/comparison'
sidebar_position: 1
---

# Vergleich mit anderen Tools

Wie schneidet shipyard im Vergleich zu Docusaurus und Astro Starlight ab? Diese Seite bietet eine ehrliche Einschätzung der Stärken und Schwächen jedes Tools.

> **Hinweis:** Dieser Vergleich spiegelt den Stand der Tools im Dezember 2025 wider. Alle drei Projekte werden aktiv entwickelt, daher können sich Features seit dem Schreiben geändert haben. Im Zweifel die offizielle Dokumentation prüfen.

## Docusaurus: Toll, aber begrenzt

[Docusaurus](https://github.com/facebook/docusaurus) ist einer der besten Page Builder da draußen. Obwohl der Name suggeriert, dass es nur für Dokumentation ist, kannst du alle möglichen Seiten damit bauen. Das Schöne ist, dass Content im Codebase gespeichert wird, sodass ein KI-Assistent die gesamte Seite verwalten kann – Content, Layout, alles.

### Was Docusaurus gut macht

- **Ausgereiftes Ökosystem** mit umfangreichen Plugins
- **Versionierte Dokumentation** out of the box
- **Starke Unternehmensunterstützung** von [Meta Open Source](https://opensource.fb.com/projects/docusaurus/)
- **Große Community** und viele Beispiele

### Wo Docusaurus schwächelt

- **Eigene Funktionalität ist schwer.** Brauchst du Events mit schönen gefilterten Ansichten organisieren? Willst du beliebige Daten jenseits von Doku und Blog verwalten? Du wirst gegen das Framework kämpfen. Astros [Content Collections](https://docs.astro.build/en/guides/content-collections/) machen das trivial – du kannst beliebige Daten in Markdown und JSON-Dateien verwalten, dann filtern, transformieren und Seiten basierend auf diesen Daten rendern. Diese Flexibilität gibt es in Docusaurus einfach nicht ohne die Standardfunktionalität massiv zu erweitern.

- **Der SPA-Ansatz ist übertrieben.** Docusaurus liefert ein aufgeblähtes JavaScript-Bundle als Single-Page-Application. Für content-fokussierte Seiten ist das Overkill. Astros Ansatz – statisches HTML ohne JavaScript standardmäßig – ist viel schlanker und schneller.

- **React-fokussiert.** Wenn du einfachere Templates bevorzugst, bietet Docusaurus keine Alternative. [Astro-Komponenten](https://docs.astro.build/en/basics/astro-components/) haben eine einfachere Syntax und produzieren sauberen statischen Output.

- **Infima CSS stagniert.** Docusaurus nutzt [Infima](https://infima.dev/), ihre eigene CSS-Komponentenbibliothek ([GitHub](https://github.com/facebookincubator/infima)). Obwohl sie versucht haben, es wiederverwendbar zu machen, ist die Entwicklung ins Stocken geraten. Es ist nicht wirklich nutzbar für aufwendigeres Styling jenseits der Standards.

---

## Astro Starlight: Fast da, aber gekoppelt

[Astro](https://astro.build/) selbst ist ausgezeichnet – schlank, flexibel und mächtig. Aber es ist sehr basic. Du brauchst einen Page Builder um schnell loszulegen.

Der Standard-Page-Builder für Astro ist [Starlight](https://github.com/withastro/starlight), und es ist eine solide Wahl für reine Dokumentationsseiten.

### Was Starlight gut macht

- **Auf Astro gebaut** mit allen Performance-Vorteilen
- **Sauberes, zugängliches Design** out of the box
- **Aktive Entwicklung** durch [Chris Swithinbank](https://github.com/delucis), jetzt Astro Core Maintainer
- **Wachsendes Plugin-Ökosystem** durch Community-Beiträge

### Wo Starlight schwächelt

- **Doku-Funktionalität ist hardcoded.** Du kannst Starlights Templating, Design und Navigation nicht nutzen ohne auch sein Doku-System zu nutzen. In Docusaurus kannst du das schöne Styling und die einfache Struktur haben ohne überhaupt Doku zu nutzen – nur eine Marketing-Seite oder Blog. Starlight ist [speziell für Dokumentation gebaut](https://starlight.astro.build/) – es für andere Zwecke zu nutzen erfordert Workarounds.

- **Blog ist ein hackiger Workaround.** Um einen Blog in Starlight zum Laufen zu bekommen, brauchst du ein Drittanbieter-Plugin wie [starlight-blog](https://github.com/HiDeoo/starlight-blog) von HiDeoo. Es funktioniert, aber es quetscht Blog-Funktionalität in ein doku-fokussiertes System statt sauber getrennte Concerns zu haben.

- **Navigation-Anpassung ist begrenzt.** Willst du eigene Links zur Top-Navigationsleiste hinzufügen? Starlight [unterstützt das nicht out of the box](https://github.com/withastro/starlight/discussions/963). Du brauchst Component-Overrides oder Drittanbieter-Plugins wie [starlight-utils](https://starlight-utils.pages.dev/utilities/nav-links/). In shipyard ist Navigation von Anfang an voll konfigurierbar.

- **Undokumentierte Komponentenbibliothek.** Starlight hat seine eigene Komponentenbibliothek gebaut, die nicht als eigenständiges Projekt open-sourced, dokumentiert oder für Erweiterung designed ist. Wenn du darauf aufbauen willst, bist du auf dich allein gestellt.

---

## Wie sich shipyard unterscheidet

shipyard verfolgt einen anderen Ansatz: **komponierbare Bausteine auf Astro**.

- Nutze **@levino/shipyard-base** allein für eine Marketing-Seite – keine Doku erforderlich
- Füge **@levino/shipyard-docs** hinzu wenn du Dokumentation brauchst
- Füge **@levino/shipyard-blog** hinzu wenn du einen Blog brauchst
- Passe Navigation, Layouts und Styling von Tag eins an
- Nutze [DaisyUI](https://daisyui.com/) für gut dokumentierte, gepflegte Komponenten

Der Hauptunterschied ist Flexibilität. shipyard nimmt nicht an, dass du eine Dokumentationsseite baust – es gibt dir die Werkzeuge um zu bauen was du brauchst.

---

## Das Fazit

- **Wähle Docusaurus** wenn du versionierte Doku brauchst und das JavaScript-Bundle nicht stört
- **Wähle Starlight** wenn du nur Dokumentation brauchst und minimales Setup willst
- **Wähle shipyard** wenn du komponierbare Bausteine und die Flexibilität willst, über Doku hinauszuwachsen

Siehe auch: [Docusaurus Feature-Parität Roadmap](../roadmap) für einen detaillierten Vergleich unterstützter Features.
