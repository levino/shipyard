import type { Entry } from '@shipyard/base/components/LocalNavigation'
import { mergeDeepLeft } from 'ramda'
interface DocsData {
  title: string
  path: string
  link?: boolean
}

export const toSidebarEntries = (docs: DocsData[]): Entry =>
  docs.reduce((acc, { path, title, link = true }) => {
    const newObject = path
      .split('/')
      .slice(1)
      .reverse()
      .reduce((acc, node, index): Entry => {
        if (index === 0) {
          return {
            [node]: {
              label: title,
              ...(link ? { href: `${path}` } : {}),
            },
          }
        }
        return {
          [node]: {
            subEntry: acc,
          },
        }
      }, {} as Entry)
    return mergeDeepLeft(acc, newObject)
  }, {} as Entry)
