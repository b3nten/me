<script>
	import LeftArrow from "$lib/icons/LeftArrow.svelte";

	let {meta, children} = $props()
</script>

<div class="text-white max-w-3xl mx-auto">
	<a class="text-lg opacity-50 hover:opacity-100 hover:bg-gray/50 transition rounded-md p-2 font-display inline-flex items-center space-x-2" href="/thoughts">
		<LeftArrow size={18} /> back
	</a>
	<h1 class="text-7xl font-bold leading-tight">{meta.title}</h1>
	<div class="mt-12 text-lg font-display flex items-center space-x-2">
		<p class="opacity-50">{meta.date}</p>
		<ul class="flex items-center space-x-2">
		{#each meta.tags as tag}
			<li class=" bg-gray-700 text-white px-2 py-1 rounded">{tag}</li>
		{/each}
		</ul>
	</div>
	<article class="mt-20 text-lg font-serif">
		{@render children()}
	</article>
</div>