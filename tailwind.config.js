/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1020",
        cyberCyan: "#00F5FF",
        cyberPurple: "#6C63FF",
        cyberGreen: "#00FF9D",
        cyberPink: "#FF007A",
        spaceDark: "#050811",
        spaceLight: "#141C34",
      },
      fontFamily: {
        sans: ["Noto Sans", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        mono: ["Noto Sans", "sans-serif"],
      },
      boxShadow: {
        neonCyan: "0 0 10px rgba(0, 245, 255, 0.5), 0 0 20px rgba(0, 245, 255, 0.2)",
        neonGreen: "0 0 10px rgba(0, 255, 157, 0.5), 0 0 20px rgba(0, 255, 157, 0.2)",
        neonPink: "0 0 10px rgba(255, 0, 122, 0.5), 0 0 20px rgba(255, 0, 122, 0.2)",
        neonPurple: "0 0 10px rgba(108, 99, 255, 0.5), 0 0 20px rgba(108, 99, 255, 0.2)",
      },
      backgroundImage: {
        "radial-cyber": "radial-gradient(circle at center, rgba(108, 99, 255, 0.15) 0%, rgba(5, 8, 17, 0) 70%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
        "spin-slow": "spin 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 1s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.6, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glitch: {
          "0%, 100%": { clipPath: "inset(0 0 0 0)" },
          "20%": { clipPath: "inset(10% 0 30% 0)" },
          "40%": { clipPath: "inset(40% 0 15% 0)" },
          "60%": { clipPath: "inset(5% 0 75% 0)" },
          "80%": { clipPath: "inset(65% 0 5% 0)" },
        }
      }
    },
  },
  plugins: [],
};
