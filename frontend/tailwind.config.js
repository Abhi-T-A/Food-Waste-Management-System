/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#1a3328',
        'sidebar-hover': '#2d5a45',
        'sidebar-active': '#22c55e',
        primary: '#16a34a',
        'primary-dark': '#15803d',
        'primary-light': '#dcfce7',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
