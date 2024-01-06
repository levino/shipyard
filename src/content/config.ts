import { defineCollection, reference, z } from 'astro:content'

import { plantsSchema } from './schema'
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
    schema: z.object({
      date: z.date(),
      title: z.string(),
    }),
  }),
  beds: defineCollection({
    type: 'content',
    schema: z.object({
      plants: z.array(reference('plants')),
    }),
  }),
  vegetables: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.object({
        latin: z.string(),
        common: z.string(),
      }),
      supplier: reference('suppliers'),
      inStock: z.boolean().default(false),
    }),
  }),
  suppliers: defineCollection({
    type: 'data',
    schema: z.object({
      name: z.string(),
      url: z.string(),
    }),
  }),
  shoppingLists: defineCollection({
    type: 'data',
    schema: z.object({
      vegetables: z.array(reference('vegetables')),
    }),
  }),
}
