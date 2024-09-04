import { defineCollection, reference, z } from 'astro:content'
import { vegetablesSchema } from './_vegetableSchema'
import { collections as plantCollections } from 'astro-collection-plants'
import { blogSchema } from '@shipyard/blog'
import { glob } from 'astro/loaders'

export const collections = {
  ...plantCollections,
  docs: defineCollection({
    type: 'content',
    schema: z.object({
      sidebar: z
        .object({
          render: z.boolean().default(true),
          label: z.string().optional(),
        })
        .default({ render: true }),
      title: z.string(),
      description: z.string().optional(),
    }),
  }),
  plantDescriptions: defineCollection({
    type: 'content',
    schema: z.object({
      plant: reference('plants'),
    }),
  }),
  blog: defineCollection({
    type: 'content',
    schema: blogSchema,
  }),
  beds: defineCollection({
    type: 'content',
    schema: z.object({
      plants: z.array(reference('plants')),
      name: z.string(),
    }),
  }),
  vegetables: defineCollection({
    loader: glob({
      pattern: '**/*.yaml',
      base: './vegetables',
    }),
    schema: vegetablesSchema,
  }),
}
