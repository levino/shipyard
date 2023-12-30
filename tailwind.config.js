/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{blog,src,docs}/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
  ],
}
