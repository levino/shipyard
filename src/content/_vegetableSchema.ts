import { reference, z } from 'astro:content'
import { MONTHS_EN } from '@/types'

const months = z.enum(MONTHS_EN)

export const vegetablesSchema = z.object({
  name: z.object({
    latin: z.string(),
    common: z.string(),
  }),
  sowing: z.array(months),
  harvest: z.array(months),
  planting: z.array(months),
  supplier: reference('suppliers'),
  inStock: z.boolean().default(false),
})
