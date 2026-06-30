/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255,255,255,0.08)',
          medium: 'rgba(255,255,255,0.12)',
          heavy: 'rgba(255,255,255,0.18)',
          border: 'rgba(255,255,255,0.10)',
        },
        brand: { primary: '#34C759', secondary: '#30B350', accent: '#FF9500', danger: '#FF3B30', info: '#007AFF' },
      },
      backdropBlur: { xs: '2px' },
      fontFamily: { sans: ['"SF Pro Display"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
