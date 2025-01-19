import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        mlg: "931px",
        xxl: "1440px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        footer: "var(--footer)",
        "footer-foreground": "var(--footer-foreground)",
        muted: "var(--muted)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        border: "var(--border)",

        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeIn: {
          to: {
            opacity: "1",
          },
        },

        jumpIn: {
          "0%": { transform: "translateY(10px)" },
          "50%": { transform: "translateY(-5px)" },
          "100%": { transform: "translateY(0)" },
        },
        fillWidth: {
          "0%": { width: "0px" },
          "100%": { width: "100%" },
        },
        staggered: {
          to: { transform: "translateY(0%)" },
        },
        textUpOut: {
          "0%": { transform: "translateY(0%)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        textUpIn: {
          "0%": { transform: "translateY(0%)", opacity: "0" },
          "100%": { transform: "translateY(-100%)", opacity: "1" },
        },
        sectionUp: {
          to: { transform: "translateY(0%)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-in-out forwards",
        chat: "fadeIn 0.8s ease-out forwards 0.1s",
        jumpIn: "jumpIn 0.3s ease-out forwards",
        fillWidth: "fillWidth 1s ease-in-out forwards 0.1s",
        staggered: "staggered 0.5s ease-in-out forwards",
        textUpOut: "textUpOut 0.3s ease-in forwards",
        textUpIn: "textUpIn 0.3s ease-out forwards",
        sectionUp: "sectionUp 0.3s ease-out forwards",
      },

      fontFamily: {
        primary: ["var(--font-geist-mono)"],
        secondary: ["var(--font-secondary)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
