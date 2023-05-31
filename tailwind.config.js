/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xsm: {
          min: "425px",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: "#d1d5db",
              backgroundColor: "#111111",
            },
            code: {
              backgroundColor: "#1C30BC",
              padding: "1px",
              borderRadius: "4px",
              color: "#f5f5f5",
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
