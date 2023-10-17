/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-cascadia-mono)",
          "var(--font-victor-mono)",
          "var(--font-roboto-mono)",
          "var(--font-space-mono)",
          "monospace",
        ],
      },
      animation: {
        blink: "blink 1s linear infinite",
        slow_blink: "blink 3s linear infinite",
        glow: "glow 2s ease-in-out infinite",
        flicker: "flicker 10s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: 0.5,
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: 0.1,
          },
        },
        blink: {
          "50%": {
            opacity: 0,
          },
        },
        glow: {
          "50%": {
            color: "#c1b492",
            "text-shadow": "#d2738a 1px 4px 5px",
          },
        },
      },
    },
  },
  plugins: [],
};
