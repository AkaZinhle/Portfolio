/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#12110d',
          secondary: '#1a1812',
          tertiary: '#242118',
          card: '#1e1c15',
          subtle: '#2d281d',
        },
        foreground: {
          DEFAULT: '#F0E5DB',
          muted: '#c7bcab',
          subtle: '#8e8472',
          dark: '#474329',
        },
        brand: {
          primary: '#F0E5DB',
          secondary: '#474329',
          olive: '#474329',
          oliveLight: '#756f45',
          oliveMuted: '#5a5435',
          accent: '#FC75B4',
          pink: '#FC75B4',
          pinkLight: '#ffa3d1',
          pinkDark: '#d94d8f',
          cream: '#F0E5DB',
          gold: '#c9be83',
          // Aliases to seamlessly theme existing components
          aqua: '#FC75B4',
          teal: '#756f45',
          cyan: '#FC75B4',
          sky: '#ffa3d1',
          blue: '#FC75B4',
          violet: '#756f45',
          purple: '#d94d8f',
          amber: '#c9be83',
        },
        border: {
          subtle: 'rgba(240, 229, 219, 0.12)',
          strong: 'rgba(240, 229, 219, 0.22)',
          accent: 'rgba(252, 117, 180, 0.4)',
          secondary: 'rgba(71, 67, 41, 0.6)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        pixel: ['ByteBounce', 'monospace'],
        display: ['Medodica', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
};
