import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#244B40", 50: "#EEF3F1", 100: "#D5E2DD", 700: "#1C3B32", 900: "#13281F" },
        river: { DEFAULT: "#477D8C", 50: "#EEF4F6", 100: "#D3E3E8", 700: "#36616D" },
        cream: { DEFAULT: "#F7F4EC", 200: "#EFE9DA" },
        terracotta: { DEFAULT: "#C77B58", 50: "#FAF0EB", 700: "#A15D3E" },
        charcoal: { DEFAULT: "#293330", 600: "#4A5753", 400: "#6E7A76" },
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
      },
      boxShadow: { card: "0 1px 2px rgba(41,51,48,.06), 0 8px 24px -12px rgba(41,51,48,.18)" },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
} satisfies Config;
