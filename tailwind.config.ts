import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        night: "#05070c",
        abyss: "#0c1620",
        forest: "#13261e",
        ember: "#d59a43",
        gold: "#f2cc8f",
        mist: "#a9b7c5"
      },
      boxShadow: {
        glow: "0 0 30px rgba(213, 154, 67, 0.18)",
        panel: "0 28px 80px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(213,154,67,0.18), transparent 35%), radial-gradient(circle at 70% 20%, rgba(96,145,135,0.12), transparent 30%)"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -14px, 0) scale(1.04)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.8" }
        },
        floatParticle: {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "0" },
          "20%": { opacity: "0.45" },
          "100%": { transform: "translate3d(8px, -120px, 0)", opacity: "0" }
        }
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        glow: "pulseGlow 7s ease-in-out infinite",
        particle: "floatParticle 9s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
