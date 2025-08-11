import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Space Grotesk',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
        serif: [
          'Newsreader',
          'ui-serif',
          'Georgia',
          'Cambria',
          "Times New Roman",
          'Times',
          'serif',
        ],
      },
      colors: {
        night: {
          bg: '#0b0e14', // deep space blue-black
          panel: '#11151f',
          text: '#e6e6e6',
          subtle: '#a1a1aa',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
