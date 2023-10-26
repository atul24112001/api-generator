import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "background-primary": "rgb(var(--background-primary))",
        "background-secondary": "rgb(var(--background-secondary))",
        "primary-light": "rgb(var(--primary-light))",
        "primary-light-1": "rgba(var(--primary-light-1))",
        "primary-light-2": "rgba(var(--primary-light-2))",
        "primary-light-3": "rgba(var(--primary-light-3))",
        "primary-light-4": "rgba(var(--primary-light-4))",
        "primary-light-5": "rgba(var(--primary-light-5))",
        "primary-light-6": "rgba(var(--primary-light-6))",
        "primary-light-7": "rgba(var(--primary-light-7))",
        "primary-light-8": "rgba(var(--primary-light-8))",
        "primary-dark": "rgb(var(--primary-dark))",
        "text-primary": "rgb(var(--text-primary))",
        "text-secondary": "rgb(var(--text-secondary))",
      },
      fontFamily: {
        "cursive-text": "var(--cursive-text)",
      },
    },
  },
  plugins: [],
};
export default config;
