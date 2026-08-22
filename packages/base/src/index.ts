import { fileURLToPath } from 'node:url'
import { isUnifiedProcessor, unified } from '@astrojs/markdown-remark'
import type { AstroIntegration } from 'astro'
import { remarkAdmonitions } from './remark/remarkAdmonitions'
import { remarkBlockDirective } from './remark/remarkBlockDirective'
import { remarkNpm2Yarn } from './remark/remarkNpm2Yarn'
import type { Config } from './schemas/config'
import { checkLinks, reportBrokenLinks } from './tools/linkChecker'

export type { Entry } from '../astro/components/types'
export type * from './schemas/config'
export { checkLinks, reportBrokenLinks } from './tools/linkChecker'
export { getTitle } from './tools/title'
export * from './types'

const shipyardConfigId = 'virtual:shipyard/config'
const shipyardLocalesId = 'virtual:shipyard/locales'
const shipyardCssId = 'virtual:shipyard/css'

const resolveId: Record<string, string | undefined> = {
  [shipyardConfigId]: `${shipyardConfigId}`,
  [shipyardLocalesId]: `${shipyardLocalesId}`,
  [shipyardCssId]: `${shipyardCssId}`,
}

export default (config: Config): AstroIntegration => {
  let isServerMode = false

  return {
    name: 'shipyard',
    hooks: {
      'astro:config:setup': ({ updateConfig, config: astroConfig, logger }) => {
        // Detect server mode (output: 'server' or 'hybrid')
        isServerMode = astroConfig.output === 'server'

        // Extract locales from Astro's i18n config
        const locales = astroConfig.i18n?.locales ?? []
        const localeList = locales.map((locale) =>
          typeof locale === 'string' ? locale : locale.path,
        )

        const load = {
          [shipyardConfigId]: `export default ${JSON.stringify(config)}`,
          [shipyardLocalesId]: `export const locales = ${JSON.stringify(localeList)}; export default ${JSON.stringify(localeList)};`,
          // Virtual CSS module - imports user's CSS if provided
          [shipyardCssId]: config.css ? `import '${config.css}';` : '',
        } as Record<string, string | undefined>

        // Astro 7 renders Markdown with Sätteri by default, which does not run
        // unified plugins. shipyard's admonitions, npm2yarn tabs and block
        // directives are all remark plugins, so we pin the unified processor
        // from @astrojs/markdown-remark. Any plugins the user already put on
        // their own `unified()` processor are carried over so both sets run;
        // plugins they pass via the deprecated `markdown.remarkPlugins` option
        // are appended by Astro afterwards.
        const userProcessor = astroConfig.markdown?.processor
        const inherited =
          userProcessor && isUnifiedProcessor(userProcessor)
            ? userProcessor.options
            : undefined

        if (userProcessor && !inherited) {
          logger.warn(
            `\`markdown.processor\` is set to \`${userProcessor.name}\`, which does not run remark plugins. ` +
              'Overriding it with `unified()` so shipyard admonitions, npm2yarn tabs and block directives keep working.',
          )
        }

        updateConfig({
          markdown: {
            processor: unified({
              ...inherited,
              remarkPlugins: [
                ...(inherited?.remarkPlugins ?? []),
                remarkBlockDirective,
                remarkAdmonitions,
                remarkNpm2Yarn,
              ],
            }),
          },
          vite: {
            plugins: [
              {
                name: 'shipyard',
                resolveId: (id: string) => resolveId[id],
                load: (id: string) => load[id],
              },
            ],
          },
        })
      },
      'astro:build:done': ({ dir, logger }) => {
        const onBrokenLinks = config.onBrokenLinks ?? 'warn'

        if (onBrokenLinks === 'ignore') {
          return
        }

        // Skip link checking in server mode - pages are rendered on-demand
        if (isServerMode) {
          logger.info(
            'Link checking skipped in server mode (pages are rendered on-demand)',
          )
          return
        }

        const buildDir = fileURLToPath(dir)
        const result = checkLinks(buildDir)

        reportBrokenLinks(result, onBrokenLinks, logger)
      },
    },
  }
}
