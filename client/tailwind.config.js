/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'], // Body font
        display: ['Outfit', 'system-ui', 'sans-serif'], // Headings
      },
      colors: {
        brand: {
          50:  '#e6f4f5',
          100: '#ccebec',
          200: '#99d7da',
          300: '#66c3c7',
          400: '#33afb4',
          500: '#01696f', // Primary
          600: '#015f65',
          700: '#01545a',
          800: '#01484f',
          900: '#003c43',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f8f8fc', // Slight off-white for depth
          muted: '#f1f1f5',
        },
        border: {
          DEFAULT: '#e2e2ee',
          light: '#f0f0f5',
        }
      },
      boxShadow: {
        // Multi-layered transparent shadows for realistic depth (SKILL.md)
        'layered-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'layered': '0 1px 2px -1px rgba(0, 0, 0, 0.05), 0 3px 6px -2px rgba(0, 0, 0, 0.04), 0 6px 12px -4px rgba(0, 0, 0, 0.03)',
        'layered-lg': '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 6px 12px -2px rgba(0, 0, 0, 0.05), 0 12px 24px -4px rgba(0, 0, 0, 0.04)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)', // Expressive deceleration (SKILL.md)
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
