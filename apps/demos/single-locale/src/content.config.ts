import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'
import { blogSchema } from '../../../packages/blog/src/index.ts'

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
