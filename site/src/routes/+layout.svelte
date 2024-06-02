<script>
	import "@unocss/reset/tailwind.css"
	import { createBackgroundEffect } from "$lib/bg/bg.js";
	import {onMount} from "svelte";
	onMount(() => {
		createBackgroundEffect();
	});
</script>

<nav></nav>
<main>
	<slot></slot>
</main>
<div></div>
<footer></footer>