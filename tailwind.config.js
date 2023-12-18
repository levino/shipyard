/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{blog,src,docs}/**/*.{mdx,js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
