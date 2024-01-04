import { defineCollection, z } from 'astro:content'

import { plantsSchema } from './schema'
export const collections = {
  docs: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  }),
  plants: defineCollection({ type: 'content', schema: plantsSchema }),
  blog: defineCollection({
    type: 'content',
    schema: z.object({
      date: z.date(),
      title: z.string(),
    }),
  }),
}
