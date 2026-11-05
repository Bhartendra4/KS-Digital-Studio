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
        ink: { DEFAULT: "#0F0D0B", 900: "#0F0D0B", 800: "#15120F", 700: "#1B1713", 600: "#221D18" },
        card: "#1B1713",
        accent: {
          blue: "#E3B868",      // champagne gold (main accent)
          electric: "#CC5500",  // burnt amber
          purple: "#9A5B2E",    // bronze / mocha
          cyan: "#F4D9A0",      // light champagne
        },
      },
      fontFamily: {
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(60% 60% at 50% 40%, rgba(227,184,104,0.16) 0%, rgba(11,11,11,0) 70%)",
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        shimmer: { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        rise: { "0%": { transform: "translateY(110%)" }, "100%": { transform: "translateY(0)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
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
        rise: "rise 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in": "fade-in 1.1s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
