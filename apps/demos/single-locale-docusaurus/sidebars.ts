import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    'installation',
    'configuration',
    {
      type: 'category',
      label: 'Details',
      items: ['details/index', 'details/cool-stuff'],
    },
  ],
}

export default sidebars
