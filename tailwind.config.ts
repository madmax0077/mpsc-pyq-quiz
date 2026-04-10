import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Segoe UI", "system-ui", "-apple-system", "BlinkMacSystemFont",
        "Roboto", "Helvetica Neue", "Arial", "sans-serif",
      ],
    },
    extend: {
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "confetti-fall": "confettiFall var(--duration, 2s) ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        confettiFall: {
          "0%": { opacity: "1", transform: "translateY(0) translateX(0) rotate(0deg)" },
          "100%": { opacity: "0", transform: "translateY(100vh) translateX(var(--drift, 0px)) rotate(720deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
