/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',   // src 폴더 내 모든 JS/TSX 파일
    './public/index.html',          // public 폴더의 html 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
