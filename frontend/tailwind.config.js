/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CMC Brand Colors
        'cmc-navy': {
          DEFAULT: '#1A1F3C',
          50: '#E8E9EF',
          100: '#D1D4DF',
          200: '#A3A9BF',
          300: '#757E9F',
          400: '#47537F',
          500: '#1A1F3C',
          600: '#151930',
          700: '#101324',
          800: '#0A0C18',
          900: '#05060C',
        },
        'cmc-gold': {
          DEFAULT: '#D4AF37',
          50: '#FAF7ED',
          100: '#F5EFDB',
          200: '#EBDFB7',
          300: '#E1CF93',
          400: '#D7BF6F',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#7F6921',
          800: '#554616',
          900: '#2A230B',
        },
        // Semantic colors
        'warm-gray': {
          DEFAULT: '#6B7280',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Courier New', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'elevated': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
        'modal': '0 25px 50px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
