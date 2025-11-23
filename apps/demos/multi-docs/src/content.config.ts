import { defineCollection } from 'astro:content'
import { createDocsCollection } from '@levino/shipyard-docs'

// Multiple docs collections using the helper function
const docs = defineCollection(createDocsCollection('./docs'))
const guides = defineCollection(createDocsCollection('./guides'))

export const collections = { docs, guides }
