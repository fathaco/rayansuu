/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#e0d4ff',
          300: '#c9b3fc',
          400: '#a78bfa',
          500: '#8D37F2',
          600: '#7a2ed9',
          700: '#6b21c0',
          800: '#5a1b70',
          900: '#4a1359',
        },
        secondary: {
          500: '#d946a6',
          600: '#c73594',
          700: '#b52482',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7a2ed9 0%, #8D37F2 100%)',
        'gradient-light': 'linear-gradient(to bottom, #fff 0%, #f5f0ff 100%)',
        'gradient-card': 'linear-gradient(135deg, #ede5ff 0%, #e0d4ff 100%)',
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
