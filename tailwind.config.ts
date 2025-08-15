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
        mono: [
          'IBM Plex Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      colors: {
        night: {
          bg: '#0b0e14', // deep space blue-black
          panel: '#11151f',
          text: '#b8b8b8', // dimmer, more realistic old screen text
          subtle: '#8a8a8a',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
