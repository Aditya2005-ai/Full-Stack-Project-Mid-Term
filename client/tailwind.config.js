/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Notion-inspired editorial palette
        canvas: {
          DEFAULT: '#FFFFFF',
          soft: '#FBFBFA',
          subtle: '#F7F7F5',
          inset: '#F1F1EF'
        },
        border: {
          subtle: '#EDEDEB',
          DEFAULT: '#E3E2DE',
          strong: '#D3D1CB'
        },
        ink: {
          DEFAULT: '#37352F',
          soft: '#5F5E5B',
          muted: '#787774',
          subtle: '#9B9A97',
          faint: '#D3D1CB'
        },
        accent: {
          DEFAULT: '#2383E2',
          hover: '#1B6EC2',
          light: '#EBF4FD',
          border: '#D0E6FC'
        },
        success: {
          DEFAULT: '#0F7B6C',
          light: '#EBF8F5',
          border: '#D2F1EA'
        },
        warning: {
          DEFAULT: '#D9730D',
          light: '#FBF3DB',
          border: '#F6E5B8'
        },
        danger: {
          DEFAULT: '#EB5757',
          light: '#FDEBEC',
          border: '#FBD2D5'
        }
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          '"Apple Color Emoji"',
          'Arial',
          'sans-serif',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ],
        mono: [
          '"SFMono-Regular"',
          'Consolas',
          '"Liberation Mono"',
          'Menlo',
          'Courier',
          'monospace'
        ]
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(15, 15, 15, 0.04)',
        popover: '0 4px 12px rgba(15, 15, 15, 0.08), 0 0 0 1px rgba(15, 15, 15, 0.05)',
        card: '0 1px 3px rgba(15, 15, 15, 0.05)'
      }
    },
  },
  plugins: [],
}
