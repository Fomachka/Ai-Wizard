/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      gridTemplateColumns: {
        flexible: "minmax(auto, 320px) 1fr",
      },
      transitionProperty: {
        width: "width",
      },
      screens: {
        xsm: {
          min: "425px",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: "white",
              backgroundColor: "#202123",
              border: "1px solid gray",
            },
            code: {
              backgroundColor: "#FAE69E",
              padding: "2px 3px",
              borderRadius: "4px",
              color: "#202123",
            },
            "code::before": {
              content: '""',
              "padding-left": "0.25rem",
            },
            "code::after": {
              content: '""',
              "padding-right": "0.25rem",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
