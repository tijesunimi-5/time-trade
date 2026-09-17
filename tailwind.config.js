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
        navy: {
          950: '#070C1B',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#142247',
          700: '#1E293B',
          600: '#334155',
        },
        brand: {
          cyan: '#38BDF8',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          gold: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
      },
      backgroundImage: {
        'glass-radial': 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15) 0%, rgba(11, 19, 43, 0) 70%)',
        'glass-card': 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 26, 58, 0.5) 100%)',
        'glass-card-hover': 'linear-gradient(135deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #38BDF8 0%, #3B82F6 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.45)',
        'glow-cyan': '0 0 24px 0 rgba(56, 189, 248, 0.35)',
        'glow-gold': '0 0 24px 0 rgba(245, 158, 11, 0.35)',
      },
    },
  },
  plugins: [],
};
