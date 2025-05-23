/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8ff',
          100: '#e0f0fe',
          200: '#bae0fd',
          300: '#7dc9fc',
          400: '#39aef9',
          500: '#0f93e8',
          600: '#0078d4', // Color principal
          700: '#0058a1',
          800: '#004580',
          900: '#003c6c',
        },
        secondary: {
          50: '#f5fbf9',
          100: '#e7f7f2',
          200: '#ceeee1',
          300: '#a9e2cd',
          400: '#64cba8',
          500: '#36b389', // Color secundario
          600: '#229671',
          700: '#1e7a5d',
          800: '#1d624c',
          900: '#1a5141',
        },
        neutral: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#acacac',
          500: '#9c9c9c',
          600: '#6e6e6e',
          700: '#5a5a5a',
          800: '#3d3d3d',
          900: '#2c2c2c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
