/**
 * Pre-shipped API route for llms.txt generation.
 * This file is injected with a static pattern like /docs/llms.txt
 * The route is determined at injection time, not by getStaticPaths.
 */

import { i18n } from 'astro:config/server'
import { type CollectionKey, getCollection, render } from 'astro:content'
import { docsConfigs } from 'virtual:shipyard-docs-configs'
import type { APIRoute } from 'astro'
import { generateLlmsTxt } from '../../src/llmsTxt'

export const prerender = true

// Extract the routeBasePath from the URL pattern this route was injected with
// The URL will be like /docs/llms.txt, so we extract 'docs' from it
function extractRouteBasePath(url: URL): string {
  const pathParts = url.pathname.split('/').filter(Boolean)
  // Remove 'llms.txt' from the end
  pathParts.pop()
  return pathParts.join('/')
}

export const GET: APIRoute = async ({ url, site }) => {
  // Extract routeBasePath from the URL this route was injected with
  const routeBasePath = extractRouteBasePath(url)
  const config = docsConfigs[routeBasePath]

  if (!config || !config.llmsTxtEnabled) {
    return new Response('Not Found', { status: 404 })
  }

  const { collectionName, llmsTxtConfig } = config

  const baseUrl = site?.toString() ?? 'https://example.com'
  const allDocs = await getCollection(collectionName as CollectionKey)

  // When i18n is enabled, only include docs from the default locale
  const defaultLocale = i18n?.defaultLocale
  const localeDocs = defaultLocale
    ? allDocs.filter(
        (doc) =>
          doc.id.startsWith(`${defaultLocale}/`) || doc.id === defaultLocale,
      )
    : allDocs

  // Filter out unlisted and non-rendered pages
  const docs = localeDocs.filter(
    (doc) => !doc.data.unlisted && doc.data.render !== false,
  )

  const entries = await Promise.all(
    docs.map(async (doc) => {
      const { headings } = await render(doc)
      const h1 = headings.find((h) => h.depth === 1)
      const cleanId = doc.id.replace(/\.md$/, '')

      // Generate slug for the _llms-txt path
      let slug = cleanId
      if (i18n && defaultLocale) {
        const [, ...rest] = cleanId.split('/')
        slug = rest.length ? rest.join('/') : cleanId
      }
      // Handle index pages
      if (slug.endsWith('/index')) {
        slug = `${slug.slice(0, -6)}/_index`
      } else if (slug === 'index') {
        slug = '_index'
      }

      const path = `/${routeBasePath}/_llms-txt/${slug}.txt`

      return {
        path,
        title: (doc.data.title as string | undefined) ?? h1?.text ?? doc.id,
        description: doc.data.description as string | undefined,
        position: (doc.data.sidebar as { position?: number } | undefined)
          ?.position,
      }
    }),
  )

  const content = generateLlmsTxt(entries, llmsTxtConfig ?? {}, baseUrl)

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
