/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      },
      fontSize: {
        'mobile-xs': ['0.7rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.8rem', { lineHeight: '1.2rem' }],
        'mobile-base': ['0.9rem', { lineHeight: '1.4rem' }],
        'mobile-lg': ['2rem', { lineHeight: '2.5rem' }],
      }
    },
  },
  plugins: [],
}
