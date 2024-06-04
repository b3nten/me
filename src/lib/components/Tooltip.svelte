<script>
	import {fade} from "svelte/transition";

	let { open = $bindable(), children } = $props()

	let element;

	$effect(() => {
		if(!open) return
		const handler = (e) => {
			if (element?.contains(e.target)) return
			open = false
			window.removeEventListener("click", handler)
		}
		setTimeout(() => window.addEventListener("click", handler))
		return () => window.removeEventListener("click", handler)
	})

</script>

{#if open}
	<div bind:this={element} in:fade={{duration: 100}}>
		{@render children()}
	</div>
{/if}