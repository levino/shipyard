import type { Meta, StoryObj } from '@storybook/react'

import { GlobalDesktopNavigation } from './GlobalDesktopNavigation'
import { config } from './fixtures'

const meta: Meta<typeof GlobalDesktopNavigation> = {
  component: GlobalDesktopNavigation,
}

export default meta
type Story = StoryObj<typeof GlobalDesktopNavigation>

export const Simple: Story = {
  render: () => <GlobalDesktopNavigation config={config} />,
}
