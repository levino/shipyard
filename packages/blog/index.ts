import { z } from 'astro/zod'

export const blogSchema = z.object({
  date: z.date(),
  title: z.string(),
})

interface BlogData {
  title: string
  description?: string
}

import { getCollection } from 'astro:content'

export const getStaticPaths = async () => {
  const getParams = (slug: string) => {
    const [locale, ...rest] = slug.split('/')
    return {
      slug: rest.join('/'),
      locale,
    }
  }
  const blogPosts = await getCollection<BlogData>('blog')
  return blogPosts.map((entry) => ({
    params: getParams(entry.slug),
    props: { entry },
  }))
}
