/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d7dbe3",
          300: "#b3bac9",
          400: "#8a93a8",
          500: "#697290",
          600: "#525a76",
          700: "#43495f",
          800: "#383c4d",
          900: "#232631",
        },
        brand: {
          50: "#f0fbfa",
          100: "#d7f4f1",
          200: "#b0e8e2",
          300: "#7cd6cd",
          400: "#45bcb0",
          500: "#279e93",
          600: "#1c8077",
          700: "#1a6660",
          800: "#19524e",
          900: "#184542",
        },
        sun: {
          50: "#fff9ed",
          100: "#fef0d2",
          200: "#fddca4",
          300: "#fcc16c",
          400: "#fa9e37",
          500: "#f68013",
          600: "#e2650a",
          700: "#bc4a0b",
          800: "#963b10",
          900: "#7a3210",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: [
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(35, 38, 49, 0.06)",
        card: "0 1px 2px rgba(35,38,49,0.04), 0 8px 24px rgba(35,38,49,0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
