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
		}
	}
})

export default defineConfig({
	plugins: [sveltekit(), unocss(uno)]
});
