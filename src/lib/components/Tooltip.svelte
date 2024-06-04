<script>
	import {fade} from "svelte/transition";

	let { open, children } = $props()

	let element;

	$effect(() => {
		console.log('open', open)
		if(!open) return
		const handler = (e) => {
			if (element?.contains(e.target)) return
			open = false
		}
		window.addEventListener("click", handler)
		return () => window.removeEventListener("click", handler)
	})
</script>

{#if open}
	<div bind:this={element} in:fade={{duration: 100}}>
		{@render children()}
	</div>
{/if}