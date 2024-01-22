// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'

import { SidebarElement } from './SidebarElement'

const meta: Meta<typeof SidebarElement> = {
  component: SidebarElement,
}

export default meta
type Story = StoryObj<typeof SidebarElement>

export const Simple: Story = {
  render: () => (
    <div className="menu">
      <SidebarElement
        entry={{
          cat1: {
            label: 'Category without subentry',
            href: '#',
          },
          cat2: {
            label: 'Category with subentry and link',
            href: '#',
            subEntry: {
              subCat1: {
                label: 'Subcategory 1',
                href: '#',
              },
            },
          },
          cat3: {
            label: 'Category with subentry but without a link',
            subEntry: {
              subCat1: {
                label: 'Subcategory 1',
                href: '#',
              },
            },
          },
          cat4: {
            label: 'Category with subentry but without a link',
            subEntry: {
              subCat1: {
                label: 'Subcategory 1',
                href: '#',
                subEntry: {
                  subSubCat1: {
                    label: 'Subsubcategory 1',
                    href: '#',
                  },
                  subSubCat2: {
                    label: 'Subsubcategory 2',
                    href: '#',
                  },
                },
              },
            },
          },
        }}
      />
    </div>
  ),
}
