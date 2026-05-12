/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#e6f4f5',
          100: '#ccebec',
          200: '#99d7da',
          300: '#66c3c7',
          400: '#33afb4',
          500: '#01696f',
          600: '#015f65',
          700: '#01545a',
          800: '#01484f',
          900: '#003c43',
        },
      },
    },
  },
  plugins: [],
}
