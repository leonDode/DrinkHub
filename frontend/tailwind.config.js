/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBackground: "#000000",
        lightBackground: "#ffffff",
        darkText: "#ffffff",
        lightText: "#000000",
        darkIcon: "#ffffff",
        lightIcon: "#000000",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
