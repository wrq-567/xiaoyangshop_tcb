/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 这一行最重要，告诉样式库去扫描您的 App.jsx
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}