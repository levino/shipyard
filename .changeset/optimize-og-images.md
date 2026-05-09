---
'@levino/shipyard-base': patch
'@levino/shipyard-docs': patch
'@levino/shipyard-blog': patch
---

Social previews now work out of the box on WhatsApp, Telegram, Facebook, LinkedIn and Twitter — even when authors drop full-resolution photos into their docs. When you set `image:` in frontmatter to a local file (e.g. `./hero.jpg`), shipyard automatically generates a 1200×630 JPEG variant for the OG/Twitter card. The optimized image is small enough for chat clients to fetch (typically under ~200 KB), and EXIF data (GPS, device, timestamp) is stripped during re-encoding. shipyard also emits the full set of meta tags scrapers expect: `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt` (defaulting to the page `description`), and `twitter:image:alt`.

You can also set a site-wide fallback image via the new `defaultImage` config option, so pages that don't specify their own `image:` in frontmatter still get a social preview:

```js
shipyard({
  // ...
  defaultImage: '/og-default.jpg',
})
```

Frontmatter `image` accepts both relative local paths (optimized) and absolute URLs (passed through unchanged), so existing external image URLs keep working.
