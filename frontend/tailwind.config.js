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
        background: '#080D18',
        surface: {
          DEFAULT: '#111827',
          light: '#1F2937',
          card: '#0F172A',
          hover: '#1E293B',
        },
        primary: {
          DEFAULT: '#2ED6C3',
          hover: '#25B8A8',
          light: '#E6FAF8'
        },
        secondary: '#0FB5A6',
        accent: '#0277A6',
        deepBlue: '#013A72',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #2ED6C3 0%, #0FB5A6 35%, #0277A6 70%, #013A72 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(46, 214, 195, 0.15) 0%, rgba(8, 13, 24, 0) 70%)',
      }
    },
  },
  plugins: [],
}
