import type { Meta, StoryObj } from '@storybook/react'

import { MobileSidebar } from './MobileSidebar'

const meta: Meta<typeof MobileSidebar> = {
  component: MobileSidebar,
}

export default meta
type Story = StoryObj<typeof MobileSidebar>

export const Simple: Story = {
  render: () => (
    <div className="h-full">
      <MobileSidebar
        local={{
          local1: {
            label: 'Local category',
            href: '#',
          },
        }}
        global={{
          global1: {
            label: 'Global category',
            href: '#',
          },
        }}
      />
    </div>
  ),
}
