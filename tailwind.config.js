/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Core Royal Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          cyan: '#0284c7',
          gold: '#d97706',
          emerald: '#059669',
          purple: '#7c3aed',
          rose: '#e11d48',
        },
      },
      backgroundImage: {
        'light-radial': 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
        'accent-blue': 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
      boxShadow: {
        'subtle-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'subtle-md': '0 4px 16px -2px rgba(37, 99, 235, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'subtle-lg': '0 10px 30px -4px rgba(37, 99, 235, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'glow-blue': '0 0 20px 0 rgba(37, 99, 235, 0.25)',
        'glow-gold': '0 0 20px 0 rgba(217, 119, 6, 0.25)',
      },
    },
  },
  plugins: [],
};
