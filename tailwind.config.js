/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'callout-background': 'transparent', // A light blue similar to Twitter's OG card
        'callout-background-focused': '#E5E7EB', // A slightly darker blue for focus/hover state
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),

  ],
}
