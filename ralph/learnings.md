# Learnings

This file contains permanent knowledge discovered during Ralph sessions. Add insights here that would help future sessions work more effectively.

---

## Codebase Patterns

<!-- Document patterns that work well in this codebase -->

### Virtual Modules
- Shipyard uses Astro virtual modules for configuration (e.g., `virtual:shipyard-docs-configs`)
- Configuration is passed through integration hooks and exposed via virtual module IDs

### Component Locations
- Base components: `packages/base/astro/components/`
- Docs components: `packages/docs/astro/`
- Layouts: `packages/*/astro/Layout.astro`

---

## Common Pitfalls

<!-- Document things that can go wrong and how to avoid them -->

### Biome Version
- Always use exact version: `npx @biomejs/biome@2.2.3 check --write .`
- CI uses 2.2.3 - mismatched versions cause schema errors

### NPM Scripts Security
- Use `npm run setup` instead of `npm install` (lavamoat security)
- Check `package.json` under `lavamoat.allowScripts` for allowed lifecycle scripts

---

## Useful Commands

```bash
# Run E2E tests
npm run test:e2e

# Lint and format
npx @biomejs/biome@2.2.3 check --write .

# Build demo
cd apps/demo && npm run build

# Run demo dev server
cd apps/demo && npm run dev
```

---

## Architectural Insights

<!-- Document important architectural decisions and their rationale -->

### i18n
- Uses Astro's native i18n config
- Locale extracted via virtual module in packages/base
- LanguageSwitcher component handles locale navigation

### Content Collections
- Docs use Astro content collections with Zod schemas
- Schema defined in `packages/docs/src/index.ts`
- Supports nested sidebar structure via tree building

---

## Testing Notes

- E2E tests in `apps/demos/*/tests/e2e/`
- Unit tests use Vitest, placed next to source: `*.test.ts`
- Run `npm run test:e2e` from repo root before committing

---

## Versioning System

### Content Structure for Versioned Docs
- **IMPORTANT**: Do NOT use dots in version folder names (e.g., `v1.0/`, `v2.0/`)
- Astro's content collection glob loader strips dots from folder names in document IDs
- Use short names like `v1/`, `v2/`, `latest/` instead
- The version config can use `label` property for display: `{ version: 'v1', label: 'Version 1.0' }`

### Version URL Structure
- Pattern: `/docs/[version]/[...slug]`
- With i18n: `/[locale]/docs/[version]/[...slug]`
- `latest` alias is auto-generated for current version
- Docs root redirects to current version

### VersionSelector Component
- Located in `packages/base/astro/components/VersionSelector.astro`
- Supports `dropdown` and `list` variants (like LanguageSwitcher)
- Prop-based design - must pass version config from parent
- Uses named slots `navbarExtra` and `sidebarExtra` in layouts

### Version-aware Sidebar
- Sidebar filtering happens in `Layout.astro` using `filterDocsForVersion()`
- The function filters docs by version AND strips version prefix from IDs
- Stripping the prefix is crucial for correct tree building (otherwise docs appear nested under version name)
- Paths are preserved as-is (they already contain version from initial doc transformation)
- Pagination also uses filtered docs to stay within same version

### Avoiding Circular Dependencies
- `packages/docs/src/index.ts` re-exports from multiple modules and also contains the integration
- Modules like `sidebarEntries.ts` and `routeHelpers.ts` can't import from index.ts without creating cycles
- Solution: Extract shared utilities to separate files like `versionHelpers.ts`
- Then both sidebarEntries.ts and index.ts can safely import from the helper file

### Astro Fragments and Slots
- **IMPORTANT**: Astro fragments (`<> ... </>`) do NOT work properly when children have `slot` attributes
- If you wrap slotted children in a fragment, Astro will silently ignore the slot assignments
- Instead of:
  ```astro
  {condition && (
    <>
      <Component slot="slotA" />
      <Component slot="slotB" />
    </>
  )}
  ```
- Use separate conditionals:
  ```astro
  {condition && (<Component slot="slotA" />)}
  {condition && (<Component slot="slotB" />)}
  ```
- This is a subtle bug that's hard to debug - the component appears to not render at all

### Astro Static Redirects
- `Astro.redirect()` in static output mode generates HTML with meta refresh, not HTTP redirects
- The meta refresh has a 2-second delay by default: `<meta http-equiv="refresh" content="2;url=/target/">`
- When testing redirects in E2E tests, use `await page.waitForURL(pattern, { timeout: 5000 })` to wait for the redirect
- For immediate redirects in SSG, consider generating the redirect page at the target URL instead

### Latest Alias Handling
- The 'latest' alias is auto-generated for docs in the current version
- **IMPORTANT**: In `extractVersionFromUrl()`, the 'latest' segment must be explicitly handled
- When URL contains `/docs/latest/...`, it should resolve to the `versionsConfig.current` version
- Without this handling, sidebar filtering and pagination won't work on latest alias pages
- Sidebar links on latest alias pages point to canonical version URLs (e.g., `/docs/v2/...`), not `/docs/latest/...`

### Docs Root Redirect with i18n
- **Known Limitation**: The docs root redirect (`/[locale]/docs/`) doesn't preserve the locale context
- When visiting `/de/docs/`, it redirects to `/en/docs/v2/` instead of `/de/docs/v2/`
- This happens because the redirect page is generated without awareness of the current locale
- Workaround: Users should link directly to versioned paths (e.g., `/de/docs/v2/`) instead of `/de/docs/`
- Future improvement: Generate locale-aware redirect pages or use middleware/SSR for smarter redirects

---

## Docusaurus Counterpart Demos

### Docusaurus Versioning Structure
- **Current version**: Docs go in `/docs/` (no version folder)
- **Previous versions**: Go in `/versioned_docs/version-X.X/` folders
- **versions.json**: Must list all versioned versions (NOT the current one)
- **versioned_sidebars/**: Each version needs `version-X.X-sidebars.json`

### Docusaurus Version Configuration
```typescript
// docusaurus.config.ts
docs: {
  versions: {
    current: {
      label: 'Version 2.0 (Latest)',
      badge: true,  // Shows badge in version dropdown
    },
    '1.0': {
      label: 'Version 1.0',
      banner: 'unmaintained',  // Shows deprecation banner
    },
  },
  lastVersion: 'current',  // Makes current docs the default
}
```

### Key Differences from Shipyard
| Aspect | Shipyard | Docusaurus |
|--------|----------|------------|
| Current docs location | `docs/v2/` | `docs/` |
| Versioned docs location | `docs/v1/` | `versioned_docs/version-1.0/` |
| Version tracking | `content.config.ts` | `versions.json` |
| Deprecation banner | `banner: 'unmaintained'` | `banner: 'unmaintained'` |
| URL pattern | `/docs/v2/page` | `/docs/page` (current) or `/docs/1.0/page` (versioned) |

### Docusaurus Demo Builds
- No E2E tests for Docusaurus demos (they're for comparison only)
- Build with `npm run build` in the demo directory
- Build includes `git fetch --unshallow || true` for shallow clone compatibility

---

<!-- Add new learnings below as you discover them -->
