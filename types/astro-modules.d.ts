/// <reference types="astro/client" />

/**
 * Ambient declaration for `.astro` single-file components.
 *
 * `tsc` cannot resolve or type `.astro` files on its own — that requires the
 * Astro language server via `astro check` (`@astrojs/check`). `@astrojs/check`
 * currently peers on `typescript@^5 || ^6`, so it cannot be installed alongside
 * the TypeScript 7 this repo uses.
 *
 * This shim lets the package barrel files that re-export `.astro` components
 * (e.g. `packages/base/astro/components/index.ts`) stay inside the type-check
 * program, so genuine problems in them — a wrong relative path, a removed
 * component — are still caught. It deliberately does NOT describe component
 * props: `.astro` internals are checked at build time by the Astro compiler.
 *
 * It is scoped to the packages program via the root `tsconfig.json` `include`,
 * so it does not weaken type-checking in `apps/`.
 */
declare module '*.astro' {
  const Component: (props: Record<string, unknown>) => unknown
  export default Component
}

/**
 * `astro/client` above supplies Astro's ambient virtual modules — `astro:content`,
 * `astro:config/server`, `astro:assets` — and the `import.meta.env` typings that
 * the packages rely on. Without it those imports fail to resolve under bare `tsc`
 * even though Astro resolves them fine at build time.
 *
 * In an Astro *app* these types are sharpened by the generated `.astro/types.d.ts`
 * (collection names, config shape). The packages are libraries compiled inside a
 * consumer's project, so they only ever see the generic forms — which is correct
 * for checking library code that must work against any consumer's collections.
 */
