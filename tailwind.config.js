/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
      },
      colors: {
        'moroccan': {
          'primary': '#c53030',
          'secondary': '#2c5282',
          'accent': '#ecc94b',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}