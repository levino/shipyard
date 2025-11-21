import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

const config: Config = {
  title: 'Single Language Demo',
  tagline: 'Shipyard without internationalization',
  favicon: 'img/favicon.svg',

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'levino',
  projectName: 'shipyard',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // No i18n configuration - single language site
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Single Lang Demo',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/about', label: 'About', position: 'left' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Single Language Demo.`,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
