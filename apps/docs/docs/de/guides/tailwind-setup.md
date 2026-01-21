---
title: Tailwind CSS Setup
sidebar:
  position: 1
description: Konfiguriere Tailwind CSS 4 mit shipyard
---

# Tailwind CSS Setup

shipyard verwendet Tailwind CSS 4 mit DaisyUI für das Styling. Diese Anleitung erklärt, wie du Tailwind CSS konfigurierst, damit es korrekt mit shipyard-Komponenten funktioniert.

## Schnell-Setup

Erstelle `src/styles/app.css`:

```css
/* Tailwind CSS 4 Setup */
@import "tailwindcss";

/* Importiere shipyard-Pakete - enthält Styles und @source-Direktiven */
@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";

@plugin "daisyui";
@plugin "@tailwindcss/typography";
```

Aktualisiere `astro.config.mjs`:

```javascript
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      brand: 'Meine Seite',
      title: 'Meine tolle Seite',
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

Installiere Dependencies:

```bash
npm install tailwindcss @tailwindcss/vite daisyui @tailwindcss/typography
```

Das war's! Die shipyard-Pakete enthalten eigene `@source`-Direktiven, sodass Tailwind automatisch alle Komponenten-Klassen erkennt.

## So funktioniert es

Jedes shipyard-Paket exportiert CSS über conditional exports. Bei CSS-Import wird es zu einer CSS-Datei aufgelöst, die enthält:

1. **Komponenten-Styles** - CSS-Regeln mit `@apply`-Direktiven
2. **@source-Direktiven** - Sagen Tailwind, wo es nach Klassenverwendung suchen soll

Wenn du `@import "@levino/shipyard-base"` importierst, macht Tailwind CSS 4:

1. Verarbeitet die Komponenten-Styles
2. Folgt den `@source`-Direktiven um die Quelldateien des Pakets zu scannen
3. Fügt alle erkannten Utility-Klassen in deinen Build ein

Das bedeutet, du musst keine Pfade manuell konfigurieren oder dir Sorgen um Monorepo vs. normale Installation machen.

## Das Setup verstehen

| Direktive | Zweck |
|-----------|-------|
| `@import "tailwindcss"` | Initialisiert Tailwind CSS |
| `@import "@levino/shipyard-*"` | Importiert shipyard-Styles und `@source`-Direktiven |
| `@plugin "daisyui"` | Aktiviert DaisyUI-Komponenten-Klassen |
| `@plugin "@tailwindcss/typography"` | Aktiviert Prosa-Styling für Markdown-Inhalte |

### Warum `?url` Import?

Das `?url`-Suffix in `import appCss from './src/styles/app.css?url'` weist Vite an, den Dateipfad zur Build-Zeit aufzulösen. Dies ermöglicht shipyard, dein CSS in der richtigen Verarbeitungsreihenfolge einzubinden.

### Warum `@tailwindcss/vite`?

Tailwind CSS 4 verwendet ein Vite-Plugin (`@tailwindcss/vite`) statt der älteren `@astrojs/tailwind`-Integration. Dies bietet bessere Performance und native Vite-Integration.

## Fehlerbehebung

### Fehlende Styles oder kaputte Komponenten

Wenn Komponenten ungestylt erscheinen:

1. **Prüfe CSS-Imports** - Stelle sicher, dass alle drei shipyard-Pakete importiert werden
2. **Überprüfe CSS-Import-Reihenfolge** - `@import "tailwindcss"` muss zuerst kommen
3. **Prüfe die css-Konfiguration** - Stelle sicher, dass du `css: appCss` an die shipyard-Integration übergibst

### "Cannot apply unknown utility class"

Dieser Fehler bedeutet, dass Tailwind nicht initialisiert ist, wenn eine CSS-Datei verarbeitet wird. Stelle sicher, dass deine app.css `@import "tailwindcss"` als ersten Import hat.

### Build-Fehler nach Upgrade

Wenn du nach einem Upgrade Fehler siehst, versuche:

1. Lösche `node_modules` und installiere neu
2. Leere deinen Build-Cache: `rm -rf dist .astro`
3. Überprüfe, dass alle shipyard-Pakete auf kompatiblen Versionen sind

## Migration von Tailwind CSS 3

Wenn du von Tailwind CSS 3 migrierst:

1. **Entferne `tailwind.config.mjs`** - Konfiguration lebt jetzt in CSS
2. **Entferne `@astrojs/tailwind`** - Nicht mehr benötigt
3. **Installiere `@tailwindcss/vite`** - Das neue Vite-Plugin
4. **Erstelle `src/styles/app.css`** - Mit dem oben gezeigten Setup
5. **Aktualisiere `astro.config.mjs`** - Füge Vite-Plugin hinzu und importiere CSS mit `?url`

### Vorher (Tailwind 3)

```javascript
// astro.config.mjs
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({ /* ... */ }),
  ],
})
```

```javascript
// tailwind.config.mjs
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    'node_modules/@levino/shipyard-*/**/*.{astro,js,ts}',
  ],
  plugins: [typography, daisyui],
}
```

### Nachher (Tailwind 4)

```javascript
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite'
import appCss from './src/styles/app.css?url'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    shipyard({
      css: appCss,
      /* ... */
    }),
  ],
})
```

```css
/* src/styles/app.css */
@import "tailwindcss";
@import "@levino/shipyard-base";
@import "@levino/shipyard-blog";
@import "@levino/shipyard-docs";
@plugin "daisyui";
@plugin "@tailwindcss/typography";
```
