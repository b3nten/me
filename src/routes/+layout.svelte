<script>
	import "@unocss/reset/tailwind.css"
	import "virtual:uno.css"

	import { fade } from 'svelte/transition'
	import Nav from "$lib/components/Nav.svelte"
	import { createBackgroundEffect } from "$lib/webgl/background.js";
	import globals from "$lib/globals.svelte.js"

	$effect(() => createBackgroundEffect(document.getElementById("bg")))

	let {children, data} = $props()

	$effect(() => {
		if(data.url === "/") {
			globals.timeFactor = 1
		} else {
			globals.timeFactor = 0.25
		}
	})
</script>

<svelte:head>
	<title>BƎNTƎN</title>
</svelte:head>

<Nav />
<div class="transition-container">
	{#key data.url}
		<main transition:fade={{ x: -200, duration: 175 }}>
			{@render children()}
		</main>
	{/key}
</div>

<div id="bg" class="fixed inset-0 -z-10"></div>
<footer></footer>

<style>
	.transition-container {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.transition-container > * {
		grid-row: 1;
		grid-column: 1;
	}
</style>