import type { AstroIntegration } from 'astro'
import type { Config } from './schemas/config'

export type { Entry } from '../astro/components/types'
export type { AdmonitionType as RehypeAdmonitionType } from './rehype/rehypeAdmonitions'
export { default as rehypeAdmonitions } from './rehype/rehypeAdmonitions'
export type { AdmonitionType as RemarkAdmonitionType } from './remark/remarkAdmonitions'

export { default as remarkAdmonitions } from './remark/remarkAdmonitions'
export type { CodeBlockMeta } from './remark/remarkCodeBlocks'
export {
  default as remarkCodeBlocks,
  parseCodeMeta,
} from './remark/remarkCodeBlocks'
export type * from './schemas/config'
export { getTitle } from './tools/title'
export * from './types'

const shipyardConfigId = 'virtual:shipyard/config'
const shipyardLocalesId = 'virtual:shipyard/locales'

const resolveId: Record<string, string | undefined> = {
  [shipyardConfigId]: `${shipyardConfigId}`,
  [shipyardLocalesId]: `${shipyardLocalesId}`,
}

export default (config: Config): AstroIntegration => ({
  name: 'shipyard',
  hooks: {
    'astro:config:setup': ({ updateConfig, config: astroConfig }) => {
      // Extract locales from Astro's i18n config
      const locales = astroConfig.i18n?.locales ?? []
      const localeList = locales.map((locale) =>
        typeof locale === 'string' ? locale : locale.path,
      )

      const load = {
        [shipyardConfigId]: `export default ${JSON.stringify(config)}`,
        [shipyardLocalesId]: `export const locales = ${JSON.stringify(localeList)}; export default ${JSON.stringify(localeList)};`,
      } as Record<string, string | undefined>

      updateConfig({
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
  },
})
