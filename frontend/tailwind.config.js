export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          800: '#4B0082',
          900: '#2E003E'
        },
        orange: {
          400: '#FF851B'
        },
        blue: {
          300: '#00BFFF'
        },
        black: '#000000'
      },
      animation: {
        marquee: 'marquee 30s linear infinite'
      }
    }
  },
  plugins: []
};