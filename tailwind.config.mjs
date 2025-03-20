/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1c1c1c",
        secondary: "#FF6200",
        tertiary: "#EB001B",
      },
      fontFamily: {
        anton: ["var(--font-anton)"],
      },
    },
  },
  plugins: [],
};
