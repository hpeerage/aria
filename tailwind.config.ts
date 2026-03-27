import type { Config } from "tailwindcss";

const config: Config = {
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
          dark: "#0F241A",
        },
        accent: {
          DEFAULT: "#F26B38",
          light: "#F58B62",
          dark: "#D14D1B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
