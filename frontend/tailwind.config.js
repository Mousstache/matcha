/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'Arial', 'Helvetica', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      }
    },
  },
};