import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

const path = require('node:path')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    path.join(
      path.dirname(require.resolve('@levino/shipyard-base')),
      '../astro/**/*.astro',
    ),
    path.join(
      path.dirname(require.resolve('@levino/shipyard-docs')),
      '../astro/**/*.astro',
    ),
    path.join(
      path.dirname(require.resolve('@levino/shipyard-blog')),
      '../astro/**/*.astro',
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui, typography],
}
