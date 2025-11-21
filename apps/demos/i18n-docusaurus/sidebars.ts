import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    'garden-beds',
    'vegetables',
    'harvesting',
    'feature',
    {
      type: 'category',
      label: 'Sidebar Demo',
      items: [
        'sidebar-demo/index',
        'sidebar-demo/custom-label',
        'sidebar-demo/custom-class',
      ],
    },
  ],
}

export default sidebars
