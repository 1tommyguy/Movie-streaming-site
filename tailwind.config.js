/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#06060f',
        surface: '#0e0e1c',
        card: '#131325',
        border: 'rgba(139,92,246,0.18)',
        primary: '#8b5cf6',
        'primary-light': '#a78bfa',
        accent: '#22d3ee',
        indigo: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'grad-accent': 'linear-gradient(135deg, #22d3ee, #6366f1)',
        'grad-card': 'linear-gradient(180deg, #131325 0%, #0e0e1c 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(139,92,246,0.35)',
        'glow-sm': '0 0 10px rgba(139,92,246,0.25)',
        'glow-cyan': '0 0 20px rgba(34,211,238,0.3)',
      },
    },
  },
  plugins: [],
}
