/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: {'min': '320px', 'max': '480px'},
        // => @media (min-width: 320px and max-width: 639px) { ... }

        md: {'min': '481px', 'max': '1024px'},
        // => @media (min-width: 481px and max-width: 1024px) { ... }

        lg: {'min': '1025px'},
        // => @media (min-width: 1025px) { ... }
      },
    },
  },
  plugins: [],
};
