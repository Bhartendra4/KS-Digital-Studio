import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1440px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#050505", 900: "#050505", 800: "#0A0A0A", 700: "#101010", 600: "#141414" },
        card: "#101010",
        accent: {
          blue: "#4F7BFF",
          electric: "#2E6BFF",
          purple: "#8B5CF6",
          cyan: "#22D3EE",
        },
      },
      fontFamily: {
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(60% 60% at 50% 40%, rgba(79,123,255,0.18) 0%, rgba(11,11,11,0) 70%)",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        shimmer: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "hero-reveal": {
          "0%": { opacity: "0.45", transform: "scale(1.045) translateY(14px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        marquee: "marquee 28s linear infinite",
        "hero-reveal": "hero-reveal 1.3s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
