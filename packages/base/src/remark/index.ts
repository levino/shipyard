/**
 * Remark plugins for shipyard markdown processing.
 *
 * @example
 * ```ts
 * import remarkDirective from 'remark-directive'
 * import { remarkAdmonitions } from '@levino/shipyard-base/remark'
 *
 * export default defineConfig({
 *   markdown: {
 *     remarkPlugins: [remarkDirective, remarkAdmonitions],
 *   },
 * })
 * ```
 */

// Re-export remark-directive for convenience
export { default as remarkDirective } from 'remark-directive'
export { type AdmonitionType, remarkAdmonitions } from './remarkAdmonitions'
export { remarkNpm2Yarn } from './remarkNpm2Yarn'
