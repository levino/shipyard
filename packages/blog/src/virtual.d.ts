declare module 'virtual:shipyard-blog/config' {
  import type { BlogConfig } from './index'
  const config: BlogConfig
  export default config
}

declare module 'virtual:shipyard-blog/tags' {
  import type { TagsMap } from './tags'
  const tagsMap: TagsMap
  export default tagsMap
}
