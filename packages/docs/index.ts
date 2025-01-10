import { z } from 'astro/zod'

export const docsSchema = z.object({
  sidebar: z
    .object({
      render: z.boolean().default(true),
      label: z.string().optional(),
    })
    .default({ render: true }),
  title: z.string(),
  description: z.string().optional(),
})
