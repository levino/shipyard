// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'

import { Tilgungsrechner } from './Tilgungsrechner'

const meta: Meta<typeof Tilgungsrechner> = {
  component: Tilgungsrechner,
}

export default meta
type Story = StoryObj<typeof Tilgungsrechner>

export const KFW: Story = {
  render: () => <Tilgungsrechner />,
}
