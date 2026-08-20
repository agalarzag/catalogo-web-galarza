/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057B8',
          dark: '#003366',   
        },
        secondary: '#003366',
        accent: '#009DE0',   
        whatsapp: '#25D366', 
        text: {
          DEFAULT: '#0F172A',
          muted: '#475569',
        },
        border: '#E2E8F0',
        surface: '#FFFFFF',
        bg: '#F8FAFC',
      },
      fontFamily: {
        title: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}