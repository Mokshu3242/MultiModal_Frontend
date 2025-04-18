// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  content: [
    './public/*.html',
    './src/**/*.{js,jsx,ts,tsx}', // Adjust as necessary for your project structure
  ],
  theme: {
    extend: {
      colors: {
        border: '#e5e7eb', // Example color for border
        // Add other custom colors here if needed
      },
    },
  },
  plugins: [],
};
