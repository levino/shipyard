/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            ['h1,h2,h3,h4,h5,h6']: {
              a: {
                textDecoration: 'none',
              },
            },
          },
        },
      },
    },
  },
  content: [
    './src/**/*.{ts,tsx,md,mdx,astro}',
    '../../shipyard/**/*.{tsx,astro}',
  ],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
