/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        p: "#e26136",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
        "arabic-serif": ["Noto Serif Arabic", "serif"],
      },
    },
  },
  plugins: [],
};
