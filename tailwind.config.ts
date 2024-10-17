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
        main: "#28e98c",
        "main-dark": "#1f1f1f",
        fcolor: "#ffffff",
        ptext: "#999999",
      },
    },
  },
  plugins: [],
};
export default config;
