// tailwind.config.js
const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
      xxl: "1920px",
    },
    

    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },

  plugins: [heroui(
    {
      themes: {
        light: {
          layout: {},
          colors: {
            primary: "#1b4c2e", // 65695A
            background: "#FFFFFF",
            foreground: "#1E1E1E",
            iconbackground: "#E7E8FF",
            accent: "#757575",
          },
        },
        dark: {
          layout: {},
          colors: {
            primary: "#1b4c2e", // 65695A
            background: "#121212",
            foreground: "#FFFFFF",
            iconbackground: "#091057",
            accent: "#757575",
          },
        },
      },
    }
  )],
};