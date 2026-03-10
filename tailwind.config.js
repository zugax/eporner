/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Eporner-inspired colors
        primary: '#AE0000',      // Eporner red
        'primary-dark': '#8B0000',
        'primary-light': '#DC143C',
        dark: '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'dark-tertiary': '#252525',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
