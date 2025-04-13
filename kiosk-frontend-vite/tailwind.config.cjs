// tailwind.config.cjs (또는 tailwind.config.js)
module.exports = {
  content: [
    "./index.html",              // 루트 HTML 파일
    "./src/**/*.{js,jsx,ts,tsx}",  // src 폴더 하위의 모든 JavaScript/TypeScript 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
