import { defineCollection } from 'astro:content'
import { blogSchema } from '@levino/shipyard-blog'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
const newsletters = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './newsletters' }),
})
const reports = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './reports' }),
})
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})

export const collections = { blog, docs, newsletters, reports }
