---
title: Server-Modus (SSR)
sidebar:
  position: 7
description: Lerne wie du shipyard mit Astros Server-Side Rendering (SSR) Modus verwendest
---

# Server-Modus (SSR)

shipyard unterstützt vollständig Astros Server-Side Rendering (SSR) Modus, der es dir ermöglicht, Seiten bei jeder Anfrage zu rendern statt zur Build-Zeit.

## Wann Server-Modus verwenden

Server-Modus ist ideal für:

- **Dynamische Inhalte**, die sich häufig ändern
- **Benutzerauthentifizierung** und personalisierte Seiten
- **Datenbankgesteuerte Inhalte**, die Echtzeit-Updates benötigen
- **Anwendungen, die Daten zur Anfragezeit benötigen**

Für statische Inhalte wie Dokumentation und Blog-Beiträge empfehlen wir den statischen Modus (Standard) für bessere Performance und einfachere Bereitstellung.

## Konfiguration

### Schritt 1: Adapter installieren

Astro benötigt einen Adapter für Server-Side Rendering. Wähle einen basierend auf deiner Deployment-Plattform:

```bash
# Für Cloudflare Workers/Pages
npm install @astrojs/cloudflare

# Für Node.js
npm install @astrojs/node

# Für Vercel
npm install @astrojs/vercel

# Für Netlify
npm install @astrojs/netlify
```

### Schritt 2: Astro konfigurieren

Aktualisiere deine `astro.config.mjs` um den Server-Modus zu aktivieren:

```javascript
import cloudflare from '@astrojs/cloudflare' // oder dein gewählter Adapter
import tailwind from '@astrojs/tailwind'
import shipyard from '@levino/shipyard-base'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'server', // Server-Modus aktivieren
  adapter: cloudflare(), // Dein gewählter Adapter
  integrations: [
    tailwind({ applyBaseStyles: false }),
    shipyard({
      brand: 'Meine Seite',
      title: 'Meine Seite',
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

## Wie es funktioniert

Bei Verwendung des Server-Modus:

1. **Dokumentations- und Blog-Seiten** werden bei Anfrage gerendert
2. **Eigene Seiten** in `src/pages/` können dynamische serverseitige Logik enthalten
3. **Statische Assets** werden weiterhin aus dem Build-Output bereitgestellt

## Beispiel: Dynamische eigene Seite

Du kannst dynamische Seiten erstellen, die Daten zur Anfragezeit abrufen:

```astro
---
// src/pages/dashboard.astro
import { Page } from '@levino/shipyard-base/layouts'

// Dies wird bei jeder Anfrage ausgeführt
const userData = await fetchUserData()
---

<Page title="Dashboard" description="Dein persönliches Dashboard">
  <h1>Willkommen, {userData.name}!</h1>
  <p>Letzte Anmeldung: {userData.lastLogin}</p>
</Page>
```

## Hybrid-Rendering

Für optimale Performance kannst du statische und server-gerenderte Seiten mit Astros Hybrid-Modus mischen:

```javascript
export default defineConfig({
  output: 'hybrid', // Hybrid-Modus aktivieren
  adapter: cloudflare(),
  // ...
})
```

Im Hybrid-Modus sind Seiten standardmäßig statisch. Füge `export const prerender = false` zu jeder Seite hinzu, die Server-Side Rendering benötigt:

```astro
---
// src/pages/api-data.astro
export const prerender = false

const data = await fetch('https://api.example.com/data')
---
```

## Live-Demo

Sieh dir den Server-Modus in Aktion an: **[Server-Modus Demo](https://server-mode.demos.shipyard.levinkeller.de)**

## Deployment-Hinweise

Jeder Adapter hat spezifische Deployment-Anforderungen. Konsultiere die Astro-Dokumentation für deine gewählte Plattform:

- [Cloudflare Deployment](https://docs.astro.build/de/guides/deploy/cloudflare/)
- [Node.js Deployment](https://docs.astro.build/de/guides/deploy/node/)
- [Vercel Deployment](https://docs.astro.build/de/guides/deploy/vercel/)
- [Netlify Deployment](https://docs.astro.build/de/guides/deploy/netlify/)
