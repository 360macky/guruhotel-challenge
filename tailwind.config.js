/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      'almost-white': '#F5F5F5',
      'purple-darkest': '#221F5D',
      'purple-dark': '#51478B',
      'purple-light': '#8073BB',
      'purple-lighest': '#B1A2EE',
      'purple-so-lighest': '#e4d3ff',
      gray: '#F0F0F0',
      red: '#b4004e',
      'red-light': '#ff7fa9',
      green: '#005d27',
      'green-light': '#69f0ae',
      'almost-black': '#1b1b1b',
    },
    extend: {
      boxShadow: {
        custom: '0 2rem 3.75rem -1rem #B1A2EE',
      },
    },
  },
  plugins: [],
}
