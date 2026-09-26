import { isDeepStrictEqual } from 'node:util'
import { isUnifiedProcessor, unified } from '@astrojs/markdown-remark'
import { satteri } from '@astrojs/markdown-satteri'
import type { AstroConfig, AstroIntegrationLogger } from 'astro'
import { remarkAdmonitions } from './remark/remarkAdmonitions'
import { remarkBlockDirective } from './remark/remarkBlockDirective'
import { remarkNpm2Yarn } from './remark/remarkNpm2Yarn'

type MarkdownProcessor = AstroConfig['markdown']['processor']

const shipyardRemarkPlugins = [
  remarkBlockDirective,
  remarkAdmonitions,
  remarkNpm2Yarn,
]

// Astro fills in a fresh `satteri()` when `markdown.processor` is unset, so
// the resolved config cannot tell that default apart from an explicit bare
// `satteri()`. Both render identically, so both count as "not chosen".
const isAstroDefault = (processor: MarkdownProcessor) => {
  const defaultProcessor = satteri()
  return (
    processor.name === defaultProcessor.name &&
    isDeepStrictEqual(processor.options, defaultProcessor.options)
  )
}

/**
 * shipyard's admonitions, npm2yarn tabs and block directives are remark
 * plugins, and only the `unified()` processor runs those.
 *
 * - Astro's default processor is replaced with `unified()` carrying the
 *   shipyard plugins.
 * - A `unified()` processor the user configured keeps all its options; the
 *   shipyard plugins are appended to its own.
 * - Any other processor the user configured is left untouched, with a warning
 *   that the shipyard Markdown features will not render.
 *
 * Returns the processor to set, or `undefined` to leave the config alone.
 */
export const shipyardMarkdownProcessor = (
  current: MarkdownProcessor,
  logger: AstroIntegrationLogger,
): MarkdownProcessor | undefined => {
  if (isUnifiedProcessor(current)) {
    return unified({
      ...current.options,
      remarkPlugins: [
        ...current.options.remarkPlugins,
        ...shipyardRemarkPlugins,
      ],
    })
  }

  if (isAstroDefault(current)) {
    return unified({ remarkPlugins: shipyardRemarkPlugins })
  }

  logger.warn(
    `\`markdown.processor\` is set to \`${current.name}\`, which does not run remark plugins, ` +
      'so shipyard admonitions, npm2yarn tabs and block directives will not render. ' +
      'Use `unified()` from `@astrojs/markdown-remark` to enable them.',
  )
  return undefined
}
