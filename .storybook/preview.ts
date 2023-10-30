import type { Preview } from '@storybook/react'
import 'infima/dist/css/default/default.css'
import 'tailwindcss/tailwind.css'
import '../src/css/custom.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
