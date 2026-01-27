/**
 * Pre-shipped API route for individual llms.txt page content.
 * This file is injected with a static pattern like /docs/_llms-txt/[...slug].txt
 * The routeBasePath is determined from the URL at request time.
 */

import { i18n } from 'astro:config/server'
import { type CollectionKey, getCollection, render } from 'astro:content'
import { docsConfigs } from 'virtual:shipyard-docs-configs'
import type { APIRoute, GetStaticPaths } from 'astro'

export const prerender = true

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for all llms-txt enabled configs
  // Each injected route will only match its own routeBasePath prefix
  const paths: Array<{
    params: { slug: string }
    props: { doc: unknown; routeBasePath: string }
  }> = []

  for (const [basePath, config] of Object.entries(docsConfigs)) {
    if (!config.llmsTxtEnabled) continue

    const allDocs = await getCollection(config.collectionName as CollectionKey)

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

    for (const doc of docs) {
      const cleanId = doc.id.replace(/\.md$/, '')
      // For i18n, strip the locale prefix from the slug
      let slug = cleanId
      if (i18n && defaultLocale) {
        const [, ...rest] = cleanId.split('/')
        slug = rest.length ? rest.join('/') : cleanId
      }
      // Handle index pages - use special suffix
      if (slug.endsWith('/index')) {
        slug = `${slug.slice(0, -6)}/_index`
      } else if (slug === 'index') {
        slug = '_index'
      }

      paths.push({
        params: { slug },
        props: { doc, routeBasePath: basePath },
      })
    }
  }

  return paths
}

export const GET: APIRoute = async ({ props }) => {
  // Get doc from props (static generation - this route is prerendered)
  const { doc } = props as {
    doc: {
      id: string
      data: { title?: string; description?: string }
      body?: string
    }
    routeBasePath: string
  }

  if (!doc) {
    return new Response('Not Found', { status: 404 })
  }

  const { headings } = await render(doc as Parameters<typeof render>[0])
  const h1 = headings.find((h) => h.depth === 1)

  // Build the plain text content with title and raw markdown body
  const title = doc.data.title ?? h1?.text ?? doc.id
  const description = doc.data.description ? `${doc.data.description}\n\n` : ''
  const body = doc.body ?? ''

  const content = `# ${title}\n\n${description}${body}`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
