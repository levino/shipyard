import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'
import { blogSchema } from '../../../packages/blog/src/index.ts'

// 3. Define your collection(s)
const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, docs }
