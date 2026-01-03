import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { file, glob } from 'astro/loaders'
import { blogSchema, tagSchema } from '../../../packages/blog/src/index.ts'

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})
const tags = defineCollection({
  schema: tagSchema,
  loader: file('./tags/tags.yaml'),
})

export const collections = { blog, docs, tags }
