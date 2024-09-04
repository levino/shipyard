import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { plantsSchema } from './_plantSchema'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const collections = {
  plants: defineCollection({
    loader: glob({
      pattern: '*.yaml',
      base: path.resolve(__dirname, './plants'),
    }),
    schema: plantsSchema,
  }),
  suppliers: defineCollection({
    loader: glob({
      pattern: '**/*.yaml',
      base: path.resolve(__dirname, './suppliers'),
    }),
    schema: z.object({
      name: z.string(),
      url: z.string(),
    }),
  }),
}
