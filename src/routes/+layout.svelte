<script>
	import "@unocss/reset/tailwind.css"
	import { createBackgroundEffect } from "$lib/bg/bg.js";
	$effect(createBackgroundEffect)

	let {children} = $props()
</script>

<nav></nav>
<main>
	{@render children()}
</main>
<div></div>
<footer></footer>