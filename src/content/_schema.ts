import { z } from 'astro:content'

export const plantsSchema = z.object({
  name: z.object({ latin: z.string(), german: z.string() }),
  description: z.string().optional(),
  height: z.number(),
  soil: z.array(z.enum(['moist', 'dry', 'normal'])),
  sunExposure: z.array(z.enum(['full', 'semi-shade', 'shade'])),
  hardiness: z.enum(['hardy', 'tender']),
  spread: z.number(),
  flowerColor: z.array(
    z.enum(['red', 'blue', 'yellow', 'white', 'pink', 'green', 'brown']),
  ),
  foliageColor: z.enum(['green', 'red', 'silver']),
  lifecycle: z.enum(['annual', 'perennial', 'biennial']),
  germination: z.enum(['cold', 'cool', 'normal']),
  floweringSeason: z.array(
    z.enum([
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'novemer',
      'december',
    ]),
  ),
  image: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
})
