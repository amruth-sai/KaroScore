/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit", // Just-In-Time compilation for faster builds
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Covers all files in the `app` directory
    "./components/**/*.{js,ts,jsx,tsx}", // Covers reusable components
    "./pages/**/*.{js,ts,jsx,tsx}", // Covers API routes or older `pages` directory
    "./utils/**/*.{js,ts,jsx,tsx}", // Covers utilities like helpers
    "./fonts/**/*.{js,ts,jsx,tsx}", // Covers custom font-related scripts, if applicable
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
