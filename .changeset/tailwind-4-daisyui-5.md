---
"@levino/shipyard-base": minor
---

Upgrade to Tailwind CSS 4 and DaisyUI 5. This is a breaking change that requires migration from the old `@astrojs/tailwind` integration to the new `@tailwindcss/vite` plugin.

**Migration Guide:**

1. Update dependencies:
   - Replace `@astrojs/tailwind` with `@tailwindcss/vite`
   - Update `tailwindcss` to `^4`
   - Update `daisyui` to `^5`

2. Update `astro.config.mjs`:
   ```javascript
   // Before
   import tailwind from '@astrojs/tailwind'
   integrations: [tailwind({ applyBaseStyles: false })]
   
   // After
   import tailwindcss from '@tailwindcss/vite'
   vite: { plugins: [tailwindcss()] }
   ```

3. Remove `tailwind.config.mjs` - no longer needed. Tailwind 4 uses CSS-first configuration.

4. The globals.css now uses new CSS syntax with `@import "tailwindcss"` and `@plugin` directives.

5. DaisyUI class renames:
   - `avatar placeholder` → `avatar avatar-placeholder`
