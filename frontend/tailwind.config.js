/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'va-purple': {
          DEFAULT: '#8B5CF6',
          light: '#A855F7',
          dark: '#7047D6',
          neon: '#B794F4',
          bright: '#E9D5FF',
          glow: '#C084FC',
        },
        'va-dark': {
          DEFAULT: '#0F0B1E',
          lighter: '#1A1433',
          card: 'rgba(26, 20, 51, 0.4)',
          border: '#3E2E6B',
          surface: '#150F2D',
          grid: 'rgba(139, 92, 246, 0.1)',
        },
        'va-blue': {
          dark: '#0B0E23',
          darker: '#060817',
          grid: 'rgba(59, 130, 246, 0.08)',
        },
        'va-gray': {
          DEFAULT: '#9CA3AF',
          light: '#D1D5DB',
          dark: '#6B7280',
        }
      },
      backgroundImage: {
        'va-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'va-gradient-reverse': 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
        'va-gradient-purple': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 50%, #4C1D95 100%)',
        'va-gradient-neon': 'linear-gradient(135deg, #B794F4 0%, #9333EA 50%, #7C3AED 100%)',
        'va-card-gradient': 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
        'va-mesh': 'radial-gradient(at 40% 20%, hsla(280,100%,74%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(280,100%,74%,0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(280,100%,74%,0.2) 0px, transparent 50%)',
        'va-grid': 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139, 92, 246, 0.1) 40px, rgba(139, 92, 246, 0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139, 92, 246, 0.1) 40px, rgba(139, 92, 246, 0.1) 41px)',
        'va-dark-bg': 'linear-gradient(180deg, #0F0B1E 0%, #0B0E23 50%, #060817 100%)',
      },
      borderRadius: {
        'va': '20px',
        'va-sm': '12px',
        'va-lg': '24px',
        'va-xl': '28px',
      },
      boxShadow: {
        'va-glow': '0 0 40px rgba(139, 92, 246, 0.4)',
        'va-glow-sm': '0 0 20px rgba(139, 92, 246, 0.3)',
        'va-neon': '0 0 60px rgba(183, 148, 244, 0.5)',
        'va-neon-border': '0 0 30px rgba(192, 132, 252, 0.6), inset 0 0 20px rgba(192, 132, 252, 0.2)',
        'va-card': '0 4px 20px rgba(0, 0, 0, 0.5)',
        'va-inset': 'inset 0 2px 10px rgba(139, 92, 246, 0.2)',
      },
      fontFamily: {
        'rockstar': ['RockStar', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 3s ease infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}