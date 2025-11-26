declare module 'virtual:shipyard-docs-configs' {
  export const docsConfigs: Record<
    string,
    {
      editUrl?: string
      showLastUpdateTime: boolean
      showLastUpdateAuthor: boolean
      routeBasePath: string
      collectionName: string
    }
  >
}
