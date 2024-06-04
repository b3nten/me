<script>
	let {children} = $props()
</script>

<div class="page-wrapper">{@render children()}</div>

<style>
	.page-wrapper {
		margin-top: 10rem;
		padding: 1rem;
		max-width: 1024px;
		margin-left: auto;
		margin-right: auto;
	}
</style>