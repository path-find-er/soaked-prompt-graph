/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0284FD',
          50: '#E6F3FF',
          100: '#CCE6FF',
          200: '#9ACEFE',
          300: '#67B5FE',
          400: '#359DFD',
          500: '#0284FD',
          600: '#026ACA',
          700: '#014F98',
          800: '#013565',
          900: '#001A33',
        },

        accent: {
          DEFAULT: '#8a0acb',
          blue: '#00B4CD',
        },

        info: {
          100: '#e6f7ff',
          200: '#ccefff',
          300: '#b3e7ff',
          400: '#99dfff',
          500: '#80d7ff',
          600: '#66accc',
          700: '#4d8199',
          800: '#335666',
          900: '#1a2b33',
        },
        success: {
          100: '#e0f8d5',
          200: '#c2f1ab',
          300: '#a3eb82',
          400: '#85e458',
          500: '#66dd2e',
          600: '#52b125',
          700: '#3d851c',
          800: '#295812',
          900: '#142c09',
        },

        warning: {
          100: '#fff2d9',
          200: '#ffe4b2',
          300: '#ffd78c',
          400: '#ffc965',
          500: '#ffbc3f',
          600: '#cc9632',
          700: '#997126',
          800: '#664b19',
          900: '#33260d',
        },

        danger: {
          100: '#ffebec',
          200: '#ffd6da',
          300: '#ffc2c7',
          400: '#ffadb5',
          500: '#ff99a2',
          600: '#cc7a82',
          700: '#995c61',
          800: '#663d41',
          900: '#331f20',
        },
        neutral: {
          50: '#f9faf9',
          100: '#eff1f3',
          200: '#dadfe4',
          300: '#b3bdc5',
          400: '#83959d',
          500: '#657278',
          600: '#51575a',
          700: '#3e4144',
          800: '#2a2c2f',
          900: '#191a1e',
        },

        base: {
          50: '#f9faf9',
          100: '#eff1f3',
          200: '#dadfe4',
          300: '#b3bdc5',
          400: '#83959d',
          500: '#657278',
          600: '#51575a',
          700: '#3e4144',
          800: '#2a2c2f',
          900: '#191a1e',
        },

        gradient: {
          0: '#813bff',
          1: '#276fff',
          2: '#0090ff',
          3: '#00a9ff',
          4: '#13beff',
          5: '#62c1ff',
          6: '#88c4ff',
          7: '#a4c8ff',
          8: '#c4bbf8',
          9: '#e2ace5',
          10: '#f7a0c7',
          11: '#ff99a2',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
