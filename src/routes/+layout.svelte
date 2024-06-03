<script>
	import "@unocss/reset/tailwind.css"
	import "virtual:uno.css"
	import { createBackgroundEffect } from "$lib/webgl/background.js";
	$effect(() => createBackgroundEffect(document.getElementById("bg")))

	let {children} = $props()
</script>

<nav></nav>
<main>
	{@render children()}
</main>
<div id="bg" class="fixed inset-0 -z-10"></div>
<footer></footer>