import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

const config: Config = {
  title: 'Versioned Docs Demo',
  tagline: 'Documentation versioning demonstration with Docusaurus',
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
          // Show deprecation banner for old versions
          versions: {
            current: {
              label: 'Version 2.0 (Latest)',
              badge: true,
            },
            '1.0': {
              label: 'Version 1.0',
              banner: 'unmaintained',
            },
          },
          // last version is the current one (v2)
          lastVersion: 'current',
        },
        blog: false, // Disable blog for this demo
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Versioned Docs',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/about', label: 'About', position: 'left' },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Versioned Docs Demo.`,
    },
  } satisfies Preset.ThemeConfig,
}

export default config
