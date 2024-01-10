import { defineCollection, reference, z } from 'astro:content'
import { vegetablesSchema } from './_vegetableSchema'
import { plantsSchema } from './_plantSchema'
import { blogSchema } from '@shipyard/blog'

export const collections = {
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
  plants: defineCollection({ type: 'data', schema: plantsSchema }),
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
    }),
  }),
  vegetables: defineCollection({
    type: 'data',
    schema: vegetablesSchema,
  }),
  suppliers: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      url: z.string(),
    }),
  }),
}
