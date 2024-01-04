import { z, type SchemaContext } from 'astro:content'
import { MONTHS_EN } from '@/types'

const months = z.enum(MONTHS_EN)

export const plantsSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.object({ latin: z.string(), german: z.string() }),
    description: z.string().optional(),
    height: z.number(),
    soil: z.array(z.enum(['moist', 'dry', 'normal', 'wet'])),
    sunExposure: z.array(z.enum(['full', 'semi-shade', 'shade'])),
    hardiness: z.enum(['hardy', 'tender']),
    spread: z.number(),
    flowerColor: z.array(
      z.enum([
        'red',
        'blue',
        'yellow',
        'white',
        'pink',
        'green',
        'brown',
        'orange',
        'violet',
      ]),
    ),
    foliageColor: z.enum(['green', 'red', 'silver']),
    lifecycle: z.enum(['annual', 'perennial', 'biennial', 'shrub', 'tree']),
    germination: z.enum(['cold', 'cool', 'normal']),
    sowingTime: z.array(months).optional(),
    floweringSeason: z.array(months),
    images: z
      .array(
        z.object({
          src: image(),
          alt: z.string(),
        }),
      )
      .optional(),
  })
