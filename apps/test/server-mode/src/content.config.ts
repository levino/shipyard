import { defineCollection } from 'astro:content'
import { blogSchema } from '@levino/shipyard-blog'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  schema: blogSchema,
  loader: glob({ pattern: '**/*.md', base: './blog' }),
})
const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})

export const collections = { blog, docs }
