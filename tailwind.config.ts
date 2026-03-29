import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'media',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        forest: {
          DEFAULT: "#1A432F",
          light: "#245A41",
          dark: "#040A08",
        },
        accent: {
          DEFAULT: "#FF7F50", // Coral for better visibility
          light: "#FFA07A",
          dark: "#CD5C5C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
