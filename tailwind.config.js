/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F3',
          100: '#F6F0E6',
          200: '#EDE3D2',
          300: '#E0D2BA',
        },
        sand: {
          400: '#C9B79A',
          500: '#B89F7A',
          600: '#A08660',
        },
        charcoal: {
          700: '#2A2520',
          800: '#1F1B17',
          900: '#15120F',
        },
        bronze: {
          400: '#D4B271',
          500: '#C9A961',
          600: '#B8934A',
          700: '#9A7A38',
        },
        rose: {
          400: '#E8C4B8',
          500: '#D9A89A',
          600: '#C28778',
        },
        sage: {
          500: '#8A9A82',
          600: '#6B7B62',
        },
        success: {
          500: '#5B8C5A',
          600: '#4A7549',
        },
        warning: {
          500: '#D49B3F',
          600: '#B87F2A',
        },
        error: {
          500: '#C25B4F',
          600: '#A24438',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      spacing: {
        18: '4.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.7s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
