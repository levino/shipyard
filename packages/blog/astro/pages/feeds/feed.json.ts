import { i18n } from 'astro:config/server'
import { type CollectionKey, getCollection } from 'astro:content'
import registry from 'virtual:shipyard-blog/registry'
import type { APIContext, GetStaticPaths } from 'astro'
import { createJsonFeedResponse } from '../../../src/feeds'
import { getInstanceConfig, getLocalePaths } from '../../../src/staticPaths'

export const getStaticPaths = (({ routePattern }) => {
  const { blogConfig } = getInstanceConfig(routePattern, registry)
  if (!blogConfig.feedOptions?.json) return []
  return getLocalePaths(i18n)
}) satisfies GetStaticPaths

export const GET = async (context: APIContext) => {
  const { blogConfig, collectionName } = getInstanceConfig(
    context.routePattern,
    registry,
  )
  const allPosts = await getCollection(collectionName as CollectionKey)
  return createJsonFeedResponse({
    allPosts,
    blogConfig,
    site: context.site,
    currentLocale: context.currentLocale,
    i18n,
    isDev: import.meta.env.DEV,
  })
}
