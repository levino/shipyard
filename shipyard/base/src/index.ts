import type { AstroIntegration } from 'astro'
import type { Config } from './schemas/config'

const shipyardConfigId = 'virtual:shipyard/config'

const resolveId: Record<string, string | undefined> = {
  [shipyardConfigId]: `${shipyardConfigId}`,
}

const load = (config: Config) =>
  ({
    [shipyardConfigId]: `export default ${JSON.stringify(config)}`,
  }) as Record<string, string | undefined>

export default (config: Config): AstroIntegration => ({
  name: 'shipyard',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [
            {
              name: 'shipyard',
              resolveId: (id: string) => resolveId[id],
              load: (id: string) => load(config)[id],
            },
          ],
        },
      })
    },
  },
})
