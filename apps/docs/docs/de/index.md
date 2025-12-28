---
title: shipyard Dokumentation
slug: 'de'
---

# Erstelle wunderschöne Websites mit shipyard

**shipyard** ist dein komplettes Toolkit zum Erstellen beeindruckender Dokumentationsseiten, Blogs und content-fokussierter Websites mit [Astro](https://astro.build).

Hör auf, dich mit komplexen Konfigurationen herumzuschlagen und fang an zu gestalten. shipyard gibt dir alles was du brauchst: responsives Design, intelligente Navigation, Internationalisierung und modulare Komponenten, die nahtlos zusammenarbeiten.

## Warum shipyard?

- **Schnell startklar** – Deine Seite läuft in Minuten, nicht Stunden
- **Mobile-First** – Wunderschön auf jedem Gerät mit Tailwind CSS und DaisyUI
- **International** – Optionale Internationalisierung mit Locale-basiertem Routing
- **Modulares Design** – Nutze nur was du brauchst, erweitere wenn du wächst
- **Content-fokussiert** – Automatische Organisation und Collection für deine Inhalte

---

## Pakete

shipyard besteht aus drei Paketen, die zusammenarbeiten:

| Paket | Zweck | Dokumentation |
|-------|-------|---------------|
| [@levino/shipyard-base](./base-package) | Kern-Layouts, Komponenten, Navigation und Konfiguration | [Zur Doku →](./base-package) |
| [@levino/shipyard-docs](./docs-package) | Dokumentations-Features, Sidebar, Paginierung, Git-Metadaten | [Zur Doku →](./docs-package) |
| [@levino/shipyard-blog](./blog-package) | Blog-Funktionalität, Beitragsliste, Navigation | [Zur Doku →](./blog-package) |

---

## Schnellstart

### Installation

```bash
npm install @levino/shipyard-base @levino/shipyard-docs @levino/shipyard-blog
npm install tailwindcss daisyui @tailwindcss/typography @astrojs/tailwind
```

### Konfiguration

```javascript
// astro.config.mjs
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({
      brand: 'Meine Seite',
      title: 'Meine tolle Seite',
      tagline: 'Erstellt mit shipyard',
      navigation: {
        docs: { label: 'Doku', href: '/docs' },
        blog: { label: 'Blog', href: '/blog' },
      },
    }),
    shipyardDocs(),
    shipyardBlog(),
  ],
})
```

**[Lies den vollständigen Erste-Schritte-Guide →](./feature)**

---

## Live-Demos

Erkunde shipyards Features in Aktion mit unseren Demo-Seiten:

| Demo | Beschreibung |
|------|--------------|
| **[Single Language](https://single-language.demos.shipyard.levinkeller.de)** | Basis-shipyard-Setup mit Doku und Blog |
| **[Internationalisierung (i18n)](https://i18n.demos.shipyard.levinkeller.de)** | Mehrsprachige Seite mit Locale-basiertem Routing |
| **[Server-Modus](https://server-mode.demos.shipyard.levinkeller.de)** | Server-Side Rendering (SSR) mit On-Demand-Seitengenerierung |

Jede Demo zeigt verschiedene shipyard-Fähigkeiten. Der Quellcode für alle Demos ist im [Demos-Verzeichnis](https://github.com/levino/shipyard/tree/main/apps/demos) verfügbar.

---

## Dokumentationsübersicht

### Erste Schritte

- **[Erste Schritte](./feature)** – Installation, Konfiguration und Projektaufbau

### Paket-Referenz

- **[@levino/shipyard-base](./base-package)** – Kern-Konfiguration, Layouts und Komponenten
- **[@levino/shipyard-docs](./docs-package)** – Dokumentations-Plugin mit Sidebar und Paginierung
- **[@levino/shipyard-blog](./blog-package)** – Blog-Plugin mit Beitragsliste und Navigation

### Weitere Ressourcen

- **[Server-Modus (SSR)](./server-mode)** – shipyard mit Server-Side Rendering verwenden
- **[Feature-Roadmap](./roadmap)** – Docusaurus Feature-Parität und kommende Features

---

*Perfekt für Entwickler, Content-Ersteller und alle, die eine schöne, schnelle Website ohne Komplexität möchten.*
