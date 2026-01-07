import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './docs/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../../packages/base/astro/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../../packages/docs/astro/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
