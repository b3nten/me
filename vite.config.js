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
				display: "Ubuntu Mono",
				mono: ['Fira Code'],
			},
		})
	]
})

export default defineConfig({
	plugins: [sveltekit(), unocss(uno)]
});
