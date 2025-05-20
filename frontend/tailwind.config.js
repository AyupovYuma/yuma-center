/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'retro-black': '#1a1a1a',
        'retro-white': '#f0f0f0',
        'retro-red': '#ff6b6b',
        'retro-blue': '#4ecdc4',
        'retro-yellow': '#ffe66d',
        'retro-purple': '#9b59b6',
        'neon-pink': '#ff00cc',
        'neon-cyan': '#00ffff',
        'dark-bg': '#111827',     // Добавил для темной темы
        'gray-800': '#1F2937',    // Дополнительные оттенки
        'gray-700': '#374151',
      },
      fontFamily: {
        pixel: [
          'Neucha',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ],
        retro: [
          '"Press Start 2P"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif'
        ]
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': {
            transform: 'translate(0)',
            textShadow: '2px 0 #ff00cc, -2px 0 #00ffff'
          },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-2px, -2px)' }
        }
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(255, 0, 204, 0.5)',
        'neon-cyan': '0 0 15px rgba(0, 255, 255, 0.5)',
      }
    },
  },
  plugins: [],
}