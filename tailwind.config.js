export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FAFBFF",
        sage: "#6DBF9E",
        periwinkle: "#8B9CF4",
        blush: "#F4A89A",
        navy: "#1E2A5E",
        slate: "#5A6482",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"DM Sans"', "sans-serif"],
        chat: ['"Lora"', "serif"],
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(0.98)" },
          "50%": { transform: "scale(1.02)" },
        },
        levitate: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        levitate: "levitate 5s cubic-bezier(0.25, 0.8, 0.25, 1) infinite",
        bob: "bob 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
