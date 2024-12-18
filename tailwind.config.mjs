import { AstroBlogTailwindPaths } from './tailwind.plugin'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
        './src/**/*.{astro,html,js,jsx,ts,tsx}',
        ...AstroBlogTailwindPaths,
    ],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {},
	},
	plugins: [],
}
