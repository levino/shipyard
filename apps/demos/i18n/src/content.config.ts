import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { file, glob } from 'astro/loaders'
import { blogSchema, tagSchema } from '../../../packages/blog/src/index.ts'

// 3. Define your collection(s)
const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})
const guides = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './guides' }),
})
const tags = defineCollection({
  schema: tagSchema,
  loader: file('./tags/tags.yaml'),
})

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, docs, guides, tags }
