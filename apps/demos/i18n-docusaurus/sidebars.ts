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
        'sidebar-demo/custom-class',
        'sidebar-demo/custom-label',
      ],
    },
  ],
}

export default sidebars
