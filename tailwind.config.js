/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#a0d7e7",
        mental: "#e5f9ff",
      },
    },
  },
  plugins: [],
}

