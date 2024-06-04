<script>
	let {meta, children} = $props()
	console.log(meta)
</script>

<div>
	{@render children()}
</div>