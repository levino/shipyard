# SSR Demo (Cloudflare)

Diese Demo zeigt **shipyard mit Server-Side Rendering (SSR)** auf Cloudflare Pages.

## Features

- **Dynamischer Content**: Zufälliges Tier das sich bei jedem Seitenaufruf ändert
- **Server-Side Rendering**: Alle Seiten werden on-demand gerendert
- **Cloudflare Pages**: Optimiert für Cloudflare's Edge Network
- **Blog & Docs**: Auch diese werden mit SSR statt statisch gerendert

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build

# Preview mit Wrangler
npm run preview
```

## Cloudflare Deployment

Diese App ist für Cloudflare Pages konfiguriert. Beim Deployment:

1. Build Command: `npm run build`
2. Build Output: `dist`
3. Node.js Version: 18+

## Konfiguration

Die SSR-Konfiguration in `astro.config.mjs`:

```js
import cloudflare from '@astrojs/cloudflare'
import shipyardDocs from '@levino/shipyard-docs'
import shipyardBlog from '@levino/shipyard-blog'

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    shipyardDocs({ prerender: false }),
    shipyardBlog({ prerender: false }),
  ],
})
```

## Unterschied zu statischen Sites

| Aspekt | Statisch | SSR |
|--------|----------|-----|
| Build | Alle Seiten vorgebaut | Nur Assets gebaut |
| Request | HTML aus CDN | HTML bei Request generiert |
| Content | Fix nach Build | Dynamisch pro Request |
| Use Case | Blogs, Docs | Auth, DB, dynamische Daten |
