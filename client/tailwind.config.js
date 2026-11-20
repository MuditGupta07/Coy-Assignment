/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        slate: '#666666',
        surface: '#FAFAFA',
        pink: '#FF3B81',
        yellow: '#FFE14D',
        green: '#2EE56B',
        peach: '#FFD6BA',
        sky: '#CFE8FF',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        nb: '3px 3px 0px #111111',
        'nb-lg': '5px 5px 0px #111111',
      },
    },
  },
  plugins: [],
};
