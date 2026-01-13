/**
 * Remark plugins for shipyard markdown processing.
 *
 * Note: These plugins are automatically registered by the shipyard integration.
 * You don't need to configure them manually. They are exported here for
 * advanced use cases where you need direct access to the plugins.
 */

// Re-export remark-directive for convenience
export { default as remarkDirective } from 'remark-directive'
export { type AdmonitionType, remarkAdmonitions } from './remarkAdmonitions'
export { remarkNpm2Yarn } from './remarkNpm2Yarn'
