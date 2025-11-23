import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

const config: Config = {
  title: 'Metro Gardens',
  tagline: 'Growing community, one plant at a time.',
  favicon: 'img/favicon.svg',

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'levino',
  projectName: 'shipyard',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
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

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'guides',
        sidebarPath: './sidebars.ts',
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Metro Gardens',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          docsPluginId: 'guides',
          position: 'left',
          label: 'Guides',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Metro Gardens.`,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
