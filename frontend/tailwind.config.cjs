/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm Oat / Cream canvas — tactile, paper-like warmth
        cream: {
          DEFAULT: "#FBF9F5",
          50: "#FBF9F5",
          100: "#F7F4EF",
          200: "#EFEAE0",
          300: "#E4DCCD",
          400: "#D6C9B2",
        },
        oat: "#F7F4EF",
        // Deep Forest Moss / Muted Sage — primary brand + focus states
        moss: {
          DEFAULT: "#3B4D3C",
          50: "#F2F5F2",
          100: "#E4EAE4",
          200: "#C9D5CA",
          300: "#A5B9A7",
          400: "#7C977F",
          500: "#5B795F",
          600: "#3B4D3C",
          700: "#2E4033",
          800: "#263529",
          900: "#1E2A20",
        },
        // Terracotta / Burnt Sienna — warm highlights, sale tags, cozy CTAs
        terracotta: {
          DEFAULT: "#C86D51",
          50: "#FBF3F0",
          100: "#F6E3DC",
          200: "#EDC5B4",
          300: "#E0A086",
          400: "#D07A5E",
          500: "#C86D51",
          600: "#A9543C",
          700: "#8A4431",
          800: "#6F3829",
          900: "#5A2E22",
        },
        // Soft charcoal for text — never pure black
        charcoal: {
          DEFAULT: "#2C2C2A",
          300: "#B5B5AE",
          400: "#8A8A84",
          500: "#5E5E58",
          600: "#3E3E3A",
          700: "#2C2C2A",
          800: "#1F1F1D",
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "Inter",
          '"Noto Sans Georgian"',
          '"Fira Go"',
          '"BPG Arial"',
          "system-ui",
          "sans-serif",
        ],
        georgian: ['"Fira Go"', '"BPG Arial"', '"Noto Sans Georgian"', "sans-serif"],
        display: [
          '"Plus Jakarta Sans"',
          "Inter",
          '"Noto Sans Georgian"',
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(44, 44, 42, 0.05)",
        "soft-md": "0 14px 40px -12px rgba(44, 44, 42, 0.08)",
        "soft-lg": "0 24px 60px -16px rgba(44, 44, 42, 0.12)",
        card: "0 1px 2px rgba(44, 44, 42, 0.04), 0 10px 30px -10px rgba(44, 44, 42, 0.06)",
        float: "0 20px 50px -12px rgba(44, 44, 42, 0.14)",
        "inner-soft": "inset 0 2px 6px rgba(44, 44, 42, 0.06)",
      },
      transitionDuration: {
        400: "400ms",
      },
      lineHeight: {
        relaxed: "1.6",
      },
    },
  },
  plugins: [],
};
