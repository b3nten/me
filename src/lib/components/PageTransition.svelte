<script>
	import { fade } from 'svelte/transition'
	let {children, key} = $props()
</script>

<div class="transition-container">
	{#key key}
		<main transition:fade={{ x: -200, duration: 175 }}>
			{@render children()}
		</main>
	{/key}
</div>

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