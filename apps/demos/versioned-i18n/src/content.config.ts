import { defineCollection } from 'astro:content'
import { createVersionedDocsCollection } from '@levino/shipyard-docs'

const docs = defineCollection(
  createVersionedDocsCollection('./docs', {
    versions: ['v1', 'v2'],
    fallbackVersion: 'v2',
  }),
)

export const collections = { docs }
