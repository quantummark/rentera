import { fontFamily } from 'tailwindcss/defaultTheme'


export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './components/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        // ... другие цвета
      },
      keyframes: {
        'fade-in-0': {'0%': {opacity: 0}, '100%': {opacity: 1}},
        'fade-out-0': {'0%': {opacity: 1}, '100%': {opacity: 0}},
        'slide-in-from-right': {'0%': {transform: 'translateX(100%)'}, '100%': {transform: 'translateX(0)'}},
        'slide-out-to-right': {'0%': {transform: 'translateX(0)'}, '100%': {transform: 'translateX(100%)'}},
        'slide-in-from-left': {'0%': {transform: 'translateX(-100%)'}, '100%': {transform: 'translateX(0)'}},
        'slide-out-to-left': {'0%': {transform: 'translateX(0)'}, '100%': {transform: 'translateX(-100%)'}},
        'slide-in-from-bottom': {'0%': {transform: 'translateY(100%)'}, '100%': {transform: 'translateY(0)'}},
        'slide-out-to-bottom': {'0%': {transform: 'translateY(0)'}, '100%': {transform: 'translateY(100%)'}},
        'slide-in-from-top': {'0%': {transform: 'translateY(-100%)'}, '100%': {transform: 'translateY(0)'}},
        'slide-out-to-top': {'0%': {transform: 'translateY(0)'}, '100%': {transform: 'translateY(-100%)'}},
      },
      animation: {
        'fade-in-0': 'fade-in-0 0.2s ease-out',
        'fade-out-0': 'fade-out-0 0.2s ease-in',
        'slide-in-from-right': 'slide-in-from-right 0.25s ease-out',
        'slide-out-to-right': 'slide-out-to-right 0.25s ease-in',
        'slide-in-from-left': 'slide-in-from-left 0.25s ease-out',
        'slide-out-to-left': 'slide-out-to-left 0.25s ease-in',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.25s ease-out',
        'slide-out-to-bottom': 'slide-out-to-bottom 0.25s ease-in',
        'slide-in-from-top': 'slide-in-from-top 0.25s ease-out',
        'slide-out-to-top': 'slide-out-to-top 0.25s ease-in',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tw-animate-css'),
  ],
}