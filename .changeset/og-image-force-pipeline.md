---
'@levino/shipyard-base': patch
'@levino/shipyard-blog': patch
'@levino/shipyard-docs': patch
---

OG/Twitter card images set via frontmatter `image:` are now always run through Astro's image pipeline. The `image` field in the docs and blog content-collection schemas no longer accepts an absolute URL string — it must be a relative path that Astro's `image()` helper can resolve into an `ImageMetadata`. That means a phone-camera JPEG dropped into your content folder is automatically downscaled, cropped to 1200×630, EXIF-stripped, and re-encoded as a small JPEG — exactly the size and shape Facebook, LinkedIn, Twitter and chat clients expect. Previously, any string in `image:` was passed through verbatim, so authors who set `image: /images/foo.jpg` (or an external URL) ended up with no optimization at all and broken link previews on WhatsApp/Telegram.

The site-wide `defaultImage` option also accepts an imported `ImageMetadata` now, so you can do:

```js
import defaultOg from './src/assets/default-og.png'
shipyard({ defaultImage: defaultOg })
```

…and have the fallback go through the same pipeline. A plain string is still accepted for external URLs or `public/` paths, but is not optimized.

If you previously had `image: https://example.com/og.jpg` in a docs or blog post, move the file alongside the markdown and reference it as `image: ./og.jpg` to get optimization.
