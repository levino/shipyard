import type { Meta, StoryObj } from '@storybook/react'

import { SidebarNavigation } from './SidebarNavigation'
import { config, localNavigation } from './fixtures'

const meta: Meta<typeof SidebarNavigation> = {
  component: SidebarNavigation,
}

export default meta
type Story = StoryObj<typeof SidebarNavigation>

export const Simple: Story = {
  render: () => (
    <SidebarNavigation global={config.navigation} local={localNavigation} />
  ),
}
