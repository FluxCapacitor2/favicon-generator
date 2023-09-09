import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
      },
      keyframes: {
        "slide-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      colors: {
        primary: colors.blue,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
