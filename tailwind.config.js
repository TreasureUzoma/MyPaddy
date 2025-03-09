/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                geist: ["Geist", "Arial"]
            },
            backgroundColor: {
                myBlack: "#131313"
            }
        }
    },
    plugins: []
};
