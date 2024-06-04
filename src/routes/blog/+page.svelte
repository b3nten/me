<script>
	let { data } = $props();
</script>


	{#each data.posts as post}
		<a href={`/blog/p/${post.slug}`}>{post.title}</a>
	{/each}


<div class="-z-10 fixed inset-0 bg-slate-600/70 backdrop-blur-xl"></div>
