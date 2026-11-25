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
        // Pixel Valley Master Palette Specification
        surface: {
          DEFAULT: '#1b1830', // Violet-ink, world's shadow color
          raised: '#272343',  // Cards, inputs
          hover: '#352f5a',   // Hover and active states
        },
        border: {
          DEFAULT: '#4a4378', // The birds' wing color
          subtle: 'rgba(74, 67, 120, 0.4)',
          strong: '#4a4378',
        },
        outline: {
          DEFAULT: '#0c0a2a', // Sprite shadow color, hard shadow
        },
        hardShadow: '#0c0a2a',
        content: {
          DEFAULT: '#fbf1d4', // Warm cream, like firelight on paper
          muted: '#b8b0d4',   // Lavender-grey
        },
        ember: {
          DEFAULT: '#ff9a3c', // Campfire orange, primary action
          pressed: '#e8741a', // Active / pressed state
        },
        pond: {
          DEFAULT: '#8fc3e8', // Water highlight, links & info
        },
        firefly: {
          DEFAULT: '#d8ff7a', // Success, live indicators
        },
        berry: {
          DEFAULT: '#ff6f6f', // Error, alerts, heart bubble
        },
        // Backward-compatibility aliases
        background: {
          DEFAULT: '#1b1830',
          secondary: '#272343',
          tertiary: '#352f5a',
          card: '#272343',
          subtle: '#1b1830',
        },
        foreground: {
          DEFAULT: '#fbf1d4',
          muted: '#b8b0d4',
          subtle: '#b8b0d4',
          dark: '#0c0a2a',
        },
        brand: {
          primary: '#fbf1d4',
          secondary: '#4a4378',
          accent: '#ff9a3c',
          pink: '#ff9a3c',
          pinkLight: '#ffb43c',
          pinkDark: '#e8741a',
          cream: '#fbf1d4',
          gold: '#d8ff7a',
          aqua: '#8fc3e8',
          teal: '#8fc3e8',
          cyan: '#8fc3e8',
          sky: '#8fc3e8',
          blue: '#8fc3e8',
          violet: '#4a4378',
          purple: '#352f5a',
          amber: '#ff9a3c',
          emerald: '#d8ff7a',
          rose: '#ff6f6f',
        },
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
