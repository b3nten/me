<script>
	import "@unocss/reset/tailwind.css"
	import "virtual:uno.css"

	import { fade } from 'svelte/transition'
	import Nav from "$lib/components/Nav.svelte"
	import { createBackgroundEffect } from "$lib/webgl/background.js";
	import PageTransition from "$lib/components/PageTransition.svelte";
	import globals from "$lib/globals.svelte.js"
    import { onDestroy, onMount } from "svelte";

	onMount(() => {
		globals.start()
	})
	
	onMount(() => createBackgroundEffect(document.getElementById("bg")))

	let {children, data} = $props()

	let url = $derived(data.url.split("/")[1])
</script>

<svelte:head>
	<title>BƎNTƎN</title>
</svelte:head>

<Nav />

<PageTransition key={url}>
	{#if globals.showUi}
		<main transition:fade={{ x: -200, duration: 175 }}>{@render children()}</main>
	{/if}
</PageTransition>

<div id="bg" class="fixed inset-0 -z-40"></div>

<style>
	:global(:root) {
		--primary-50:#effafc;
        --primary-100:#e1f5f9;
    	--primary-200:#b2e3ef;
        --primary-300:#7dcfe3;
        --primary-400:#41b0cf;
        --primary-500:#2594b5;
        --primary-600:#227798;
        --primary-700:#22627c;
        --primary-800:#245166;
        --primary-900:#224557;
        --primary-950:#112c3b;
	}
</style>
