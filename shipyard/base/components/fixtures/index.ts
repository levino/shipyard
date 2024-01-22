import type { Config } from '@/schemas/config'

export const config: Config = {
  brand: 'Levin Keller',
  navigation: {
    home: { href: '/', label: 'Home' },
    about: { href: '/about', label: 'About' },
    more: {
      label: 'More',
      subEntry: {
        contact: { href: '/contact', label: 'Contact' },
        blog: { href: '/blog', label: 'Blog' },
      },
    },
  },
}

export const localNavigation = {
  tech: { href: '/docs/tech', label: 'Tech' },
  garden: { href: '/docs/garden', label: 'Garden' },
  politics: {
    label: 'Politics',
    subEntry: {
      global: { href: '/docs/politics/global', label: 'Global' },
      local: { href: '/docs/politics/local', label: 'Local' },
    },
  },
}
