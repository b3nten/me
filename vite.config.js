import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import unocss from "unocss/vite"
import {presetWebFonts, defineConfig as defineUno, presetWind} from "unocss";

const uno = defineUno({
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

export default defineConfig({
	plugins: [sveltekit(), unocss(uno)]
});
