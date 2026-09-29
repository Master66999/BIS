/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bis: {
          navy: "#0A2540",
          navyDark: "#061526",
          navyLight: "#16385C",
          blue: "#1E3A8A",
          saffron: "#FF9933",
          saffronDark: "#E65100",
          saffronLight: "#FFB066",
          grayBg: "#F8FAFC",
          cardBorder: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
