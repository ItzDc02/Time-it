/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "desktop-background": "url('/src/assets/desktop-background.png')",
        "mobile-background": "url('/src/assets/mobile-background.png')",
      },
    },
    plugins: [],
  },
};
