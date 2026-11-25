/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { ink: '#090A0C', paper: '#E8E9EC', signal: '#648CFF', quiet: '#777D89' }, fontFamily: { display: ['Space Grotesk','sans-serif'], sans: ['Inter','sans-serif'], mono: ['JetBrains Mono','monospace'] } } },
  plugins: [],
};
