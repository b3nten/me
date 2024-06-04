<script>
	import "@unocss/reset/tailwind.css"
	import "virtual:uno.css"

	import { fade } from 'svelte/transition'
	import Nav from "$lib/components/Nav.svelte"
	import { createBackgroundEffect } from "$lib/webgl/background.js";
	import PageTransition from "$lib/components/PageTransition.svelte";

	$effect(() => createBackgroundEffect(document.getElementById("bg")))

	let {children, data} = $props()

	let url = $derived(data.url.split("/")[1])
</script>

<svelte:head>
	<title>BƎNTƎN</title>
</svelte:head>

<Nav />

<PageTransition key={url}>
	<main transition:fade={{ x: -200, duration: 175 }}>{@render children()}</main>
</PageTransition>

<div id="bg" class="fixed inset-0 -z-40"></div>
