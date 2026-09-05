/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#07090e',
          900: '#0c0f17',
          850: '#111622',
          800: '#171e2e',
          750: '#1d263a',
          700: '#26324b',
          600: '#394b6d',
          500: '#536b97',
          400: '#839bc4',
          300: '#b4c4de',
        },
        melody: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        accent: {
          rose: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soundwave': 'soundwave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        soundwave: {
          '0%': { height: '6px' },
          '100%': { height: '24px' },
        }
      }
    },
  },
  plugins: [],
}
