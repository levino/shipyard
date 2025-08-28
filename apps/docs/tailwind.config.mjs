import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

const path = require('node:path')

console.log(
  path.join(
    path.dirname(require.resolve('@levino/shipyard-base')),
    '/layouts/**/*.{tsx,astro}',
  ),
)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../**/*.{tsx,astro}',
    ),
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../**/*.{tsx,astro}',
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui, typography],
}
