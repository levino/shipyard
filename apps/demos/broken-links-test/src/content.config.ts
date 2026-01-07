import { defineCollection } from 'astro:content'
import { docsSchema } from '@levino/shipyard-docs'
import { glob } from 'astro/loaders'

const docs = defineCollection({
  schema: docsSchema,
  loader: glob({ pattern: '**/*.md', base: './docs' }),
})

export const collections = { docs }
