import type { AstroIntegration } from 'astro'
import type { Config, FinalConfig } from './schemas/config'
export type { Entry } from '../astro/components/types'
export * from './types'
export type * from './schemas/config'
export { getTitle } from './tools/title'
const shipyardConfigId = 'virtual:shipyard/config'

const resolveId: Record<string, string | undefined> = {
  [shipyardConfigId]: `${shipyardConfigId}`,
}

const load = (config: FinalConfig) =>
  ({
    [shipyardConfigId]: `export default ${JSON.stringify(config)}`,
  }) as Record<string, string | undefined>

export default (config: Config): AstroIntegration => ({
  name: 'shipyard',
  hooks: {
    'astro:config:setup': ({ updateConfig, config: { i18n } }) => {
      if (!i18n) {
        throw new Error(
          'Shipyard cannot be used without i18n. Please set at least one locale.',
        )
      }
      updateConfig({
        vite: {
          plugins: [
            {
              name: 'shipyard',
              resolveId: (id: string) => resolveId[id],
              load: (id: string) => load({ i18n, ...config })[id],
            },
          ],
        },
      })
    },
  },
})
