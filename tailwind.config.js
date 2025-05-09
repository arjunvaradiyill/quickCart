/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';

export default {
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  "./node_modules/flowbite/**/*.js"
],
  theme: {
    extend: {},
  },
plugins: [
    flowbite
]
}
