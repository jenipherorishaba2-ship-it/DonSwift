const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => [s, v(`brand-${s}`)])),
        accent: { 400: v('accent-400'), 500: v('accent-500'), 600: v('accent-600') },
      },
    },
  },
  plugins: [],
};
