/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg:         '#090D16',
        darkCard:       '#131C2E',
        darkBorder:     '#22314D',
        brandMint:      '#4FD1C5',
        brandMintHover: '#38B2AC',
        brandGreen:     '#10B981',
        brandRed:       '#EF4444',
      },
      fontFamily: {
        sans:      ['Inter', 'sans-serif'],
        urbanist:  ['Urbanist', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
