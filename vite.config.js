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
				'50': 'var(--primary-50)',
				'100': 'var(--primary-100)',
				'200': 'var(--primary-200)',
				'300': 'var(--primary-300)',
				'400': 'var(--primary-400)',
				'500': 'var(--primary-500)',
				'600': 'var(--primary-600)',
				'700': 'var(--primary-700)',
				'800': 'var(--primary-800)',
				'900': 'var(--primary-900)',
				'950': 'var(--primary-950)',
			}
		}
	}
})

export default defineConfig({
	plugins: [sveltekit(), unocss(uno)]
});
