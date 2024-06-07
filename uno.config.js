import { defineConfig, presetWind, presetWebFonts } from "unocss";

export default defineConfig({
	presets: [
		presetWind(),
		presetWebFonts({
			provider: 'google',
			fonts: {
				sans: 'Inter',
				display: "Play",
				mono: ['Fira Code'],
			},
	
		})
	],
	theme: {
		fontFamily: {
			serif: ["Georgia", "serif"],
		},
		colors: {
			primary: {
				'50':  'rgba(var(--primary-50))',
				'100': 'rgba(var(--primary-100))',
				'200': 'rgba(var(--primary-200))',
				'300': 'rgba(var(--primary-300))',
				'400': 'rgba(var(--primary-400))',
				'500': 'rgba(var(--primary-500))',
				'600': 'rgba(var(--primary-600))',
				'700': 'rgba(var(--primary-700))',
				'800': 'rgba(var(--primary-800))',
				'900': 'rgba(var(--primary-900))',
				'950': 'rgba(var(--primary-950))',
			}
		}
	}
})