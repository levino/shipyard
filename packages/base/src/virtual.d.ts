declare module 'virtual:shipyard/config' {
  import type { Config } from './schemas/config'
  const config: Config
  export default config
}

declare module 'virtual:shipyard/locales' {
  export const locales: string[]
  export default locales
}
