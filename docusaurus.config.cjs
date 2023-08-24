// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Levin Keller',
  tagline: 'So Sachen, die ich mache oder interessant finde.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://levinkeller.de',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'levino', // Usually your GitHub org/user name.
  projectName: 'levinkeller.de', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
  },
  plugins: [
    () => ({
      name: 'responsive-images',
      configureWebpack: (_, isServer) => ({
        mergeStrategy: {
          'module.rules': 'prepend',
        },
        module: {
          rules: [
            {
              test: /\.(?:png|jpe?g)$/i,
              use: [
                {
                  loader: require.resolve('@docusaurus/responsive-loader'),
                  options: {
                    // Don't emit for server-side rendering
                    emitFile: !isServer,
                    // eslint-disable-next-line global-require
                    adapter: require('@docusaurus/responsive-loader/sharp'),
                    name: 'assets/img/[name].[hash:hex:7].[width].[ext]',
                    max: 1920,
                    min: 640,
                    steps: 4,
                  },
                },
              ],
            },
          ],
        },
      }),
    }),
    () => ({
      name: 'docusaurus-tailwindcss',
      configurePostCss: (postcssOptions) => ({
        ...postcssOptions,
        plugins: [
          ...postcssOptions.plugins,
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      }),
    }),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/levino/levinkeller.de/tree/main',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/levino/levinkeller.de/tree/main',
          blogSidebarTitle: 'Letzte Beiträge',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Levin Keller',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/work',
            label: 'Software Development',
          },
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Wissen',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/levino/levinkeller.de',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Levin Keller.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
